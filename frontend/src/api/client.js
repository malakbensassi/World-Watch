// WorldWatch API Client

const BASE_URL = ''; // Proxied via Vite to http://localhost:8080 or direct

export const getAuthToken = () => {
  return localStorage.getItem('worldwatch_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('worldwatch_token', token);
  } else {
    localStorage.removeItem('worldwatch_token');
  }
};

export const getStoredUser = () => {
  const user = localStorage.getItem('worldwatch_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('worldwatch_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('worldwatch_user');
  }
};

// Generic fetch wrapper with Authorization header
async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      // not JSON
    }
    const message = errorJson?.message || errorText || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

// 1. Auth Endpoints
export async function register(username, password) {
  try {
    return await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true
    });
  } catch (err) {
    console.warn('[API] Register failed:', err.message);
    throw err;
  }
}

export async function login(username, password) {
  try {
    return await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true
    });
  } catch (err) {
    console.warn('[API] Login failed:', err.message);
    throw err;
  }
}

// 2. Country Info & Details Endpoints
export async function fetchCountryData(code) {
  try {
    return await apiFetch(`/api/countries/${code}`);
  } catch (err) {
    console.warn(`[API] /api/countries/${code} request failed. Using fallback.`, err.message);
    return null;
  }
}

// Cache for offline/direct country metadata
let _cachedCountriesDataset = null;

export async function fetchCountryDetails(code) {
  const normCode = code.toUpperCase();
  const lowerCode = code.toLowerCase();

  // 1. Try Spring Boot backend
  try {
    const backendData = await apiFetch(`/api/countries/${normCode}/details`);
    if (backendData && backendData.flagSvg) {
      return {
        ...backendData,
        flagSvg: backendData.flagSvg || `https://flagcdn.com/${lowerCode}.svg`,
        flagPng: backendData.flagPng || `https://flagcdn.com/w320/${lowerCode}.png`,
        coatOfArmsSvg: backendData.coatOfArmsSvg || `https://mainfacts.com/media/images/coats_of_arms/${lowerCode}.svg`,
        mapsUrl: backendData.mapsUrl || `https://www.google.com/maps/place/${encodeURIComponent(backendData.name || normCode)}`
      };
    }
  } catch (err) {
    // proceed to direct query
  }

  // 2. Direct query to global REST Countries dataset mirror
  try {
    if (!_cachedCountriesDataset) {
      const resp = await fetch('https://raw.githubusercontent.com/mledoze/countries/master/countries.json');
      if (resp.ok) {
        _cachedCountriesDataset = await resp.json();
      }
    }

    if (Array.isArray(_cachedCountriesDataset)) {
      const match = _cachedCountriesDataset.find(
        c => (c.cca2 && c.cca2.toUpperCase() === normCode) ||
             (c.cca3 && c.cca3.toUpperCase() === normCode) ||
             (c.cioc && c.cioc.toUpperCase() === normCode)
      );

      if (match) {
        const curKeys = Object.keys(match.currencies || {});
        const curObj = curKeys.length > 0 ? match.currencies[curKeys[0]] : null;
        const curStr = curObj ? `${curObj.name || curKeys[0]} (${curObj.symbol || curKeys[0]})` : 'USD ($)';

        return {
          countryCode: normCode,
          name: match.name?.common || match.name?.official || normCode,
          officialName: match.name?.official || match.name?.common,
          capital: Array.isArray(match.capital) ? match.capital[0] : (match.capital || 'N/A'),
          currency: curStr,
          currencySymbol: curObj?.symbol || '$',
          population: match.population || 0,
          landAreaKm2: match.area || 0,
          flagSvg: `https://flagcdn.com/${lowerCode}.svg`,
          flagPng: `https://flagcdn.com/w320/${lowerCode}.png`,
          flagAlt: `Official national flag of ${match.name?.common || normCode}`,
          coatOfArmsSvg: `https://mainfacts.com/media/images/coats_of_arms/${lowerCode}.svg`,
          mapsUrl: `https://www.google.com/maps/place/${encodeURIComponent(match.name?.common || normCode)}`,
          timezones: Array.isArray(match.timezones) && match.timezones.length > 0 ? match.timezones : ['UTC+00:00'],
          unMember: match.unMember ?? true,
          officialLanguages: match.languages ? Object.values(match.languages) : [],
          borderCountries: Array.isArray(match.borders) ? match.borders : [],
          region: match.region || match.subregion || 'Global',
          subregion: match.subregion || match.region || ''
        };
      }
    }
  } catch (err) {
    console.warn(`[API] Remote country metadata fetch fallback for ${normCode}:`, err.message);
  }

  // 3. Fallback with guaranteed flag assets
  return {
    countryCode: normCode,
    flagSvg: `https://flagcdn.com/${lowerCode}.svg`,
    flagPng: `https://flagcdn.com/w320/${lowerCode}.png`,
    flagAlt: `National flag of ${normCode}`,
    coatOfArmsSvg: `https://mainfacts.com/media/images/coats_of_arms/${lowerCode}.svg`,
    mapsUrl: `https://www.google.com/maps/place/${normCode}`,
    timezones: ['UTC+00:00'],
    unMember: true,
    officialLanguages: [],
    borderCountries: []
  };
}


// 3. Exchange Rate Endpoints (Backend + Direct Real-time Public Feed)
let _cachedRatesUSD = null;
let _cachedRatesTimestamp = 0;

export async function fetchLiveForexMatrix(baseCurrency = 'USD') {
  const now = Date.now();
  // Cache for 60 seconds to avoid spamming
  if (_cachedRatesUSD && baseCurrency === 'USD' && (now - _cachedRatesTimestamp < 60000)) {
    return _cachedRatesUSD;
  }

  // 1. Try Spring Boot backend first
  try {
    const backendTest = await apiFetch(`/api/exchange-rate?currency=MAD&base=${baseCurrency}`);
    if (backendTest && typeof backendTest.rate === 'number') {
      // Backend is alive!
    }
  } catch (err) {
    // Backend offline or running standalone on GitHub Pages
  }

  // 2. Query Real-Time Forex API (Open Exchange Rates / ExchangeRate-API free tier)
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        if (baseCurrency === 'USD') {
          _cachedRatesUSD = data;
          _cachedRatesTimestamp = now;
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('[API] Real-time forex feed error:', err.message);
  }

  // 3. Secondary Backup: Frankfurter / European Central Bank API
  try {
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        const fullRates = { ...data.rates, [baseCurrency]: 1 };
        const result = { rates: fullRates, time_last_update_utc: data.date };
        return result;
      }
    }
  } catch (err) {
    // Fallback
  }

  return _cachedRatesUSD || null;
}

export async function fetchLiveTickerRates() {
  const matrix = await fetchLiveForexMatrix('USD');
  const rates = matrix?.rates || {};
  const lastUpdate = matrix?.time_last_update_utc || new Date().toUTCString();

  // Helper to format pair rates
  const getRate = (pair, val, change, up) => {
    return {
      pair,
      rate: typeof val === 'number' ? (val >= 100 ? val.toFixed(2) : val >= 10 ? val.toFixed(3) : val.toFixed(4)) : '---',
      rawRate: val || 1,
      change,
      up,
      lastUpdate
    };
  };

  const mad = rates['MAD'] || 9.3527;
  const eur = rates['EUR'] || 0.8611;
  const gbp = rates['GBP'] || 0.7397;
  const jpy = rates['JPY'] || 156.18;
  const aed = rates['AED'] || 3.6725;
  const cad = rates['CAD'] || 1.3831;
  const sar = rates['SAR'] || 3.7500;
  const chf = rates['CHF'] || 0.8099;
  const cny = rates['CNY'] || 6.7194;

  const eurUsd = eur > 0 ? (1 / eur) : 1.161;
  const gbpUsd = gbp > 0 ? (1 / gbp) : 1.352;
  const eurMad = eur > 0 ? (mad / eur) : 10.86;
  const eurGbp = eur > 0 ? (gbp / eur) : 0.859;

  return [
    getRate('USD / MAD', mad, '+0.12%', true),
    getRate('EUR / USD', eurUsd, '+0.06%', true),
    getRate('GBP / USD', gbpUsd, '-0.14%', false),
    getRate('USD / JPY', jpy, '+0.28%', true),
    getRate('EUR / MAD', eurMad, '+0.18%', true),
    getRate('USD / AED', aed, '0.00%', true),
    getRate('USD / CAD', cad, '-0.09%', false),
    getRate('USD / SAR', sar, '+0.01%', true),
    getRate('EUR / GBP', eurGbp, '+0.11%', true),
    getRate('USD / CHF', chf, '-0.05%', false),
    getRate('USD / CNY', cny, '+0.03%', true),
  ];
}

export async function fetchExchangeRate(targetCurrency, baseCurrency = 'USD') {
  // 1. Try Spring Boot backend
  try {
    const backendRate = await apiFetch(`/api/exchange-rate?currency=${targetCurrency}&base=${baseCurrency}`);
    if (backendRate && typeof backendRate.rate === 'number') {
      return backendRate;
    }
  } catch (err) {
    // Proceed to live API
  }

  // 2. Try Direct Real-Time Feed
  try {
    const matrix = await fetchLiveForexMatrix(baseCurrency);
    if (matrix && matrix.rates && matrix.rates[targetCurrency]) {
      return {
        baseCurrency,
        targetCurrency,
        rate: matrix.rates[targetCurrency],
        date: matrix.time_last_update_utc || 'Live Real-Time Feed',
        allRates: matrix.rates
      };
    }
  } catch (err) {
    console.warn('[API] Fallback exchange rate query failed:', err.message);
  }

  return null;
}

// 4. News Endpoints (General & Yahoo Finance)
export async function fetchNews(countryName) {
  try {
    return await apiFetch(`/api/news?country=${encodeURIComponent(countryName)}`);
  } catch (err) {
    console.warn(`[API] /api/news failed.`, err.message);
    return null;
  }
}

export async function fetchFinanceNews(countryName) {
  try {
    return await apiFetch(`/api/news/finance?country=${encodeURIComponent(countryName)}`);
  } catch (err) {
    console.warn(`[API] /api/news/finance failed.`, err.message);
    return null;
  }
}

// 5. Economic Indicators Endpoint
export async function fetchEconomicIndicators(countryCode) {
  try {
    return await apiFetch(`/api/economics/${countryCode}`);
  } catch (err) {
    console.warn(`[API] /api/economics/${countryCode} failed. Using benchmark fallback.`, err.message);
    return null;
  }
}

// 6. Geopolitical & Economic Conflicts Endpoint
export async function fetchConflictProfile(countryCode) {
  try {
    return await apiFetch(`/api/conflicts/${countryCode}`);
  } catch (err) {
    console.warn(`[API] /api/conflicts/${countryCode} failed. Using benchmark fallback.`, err.message);
    return null;
  }
}

// 7. Favorites Endpoints
export async function fetchFavorites() {
  try {
    return await apiFetch('/api/favorites');
  } catch (err) {
    console.warn(`[API] /api/favorites failed.`, err.message);
    return null;
  }
}

export async function addFavorite(countryCode, countryName) {
  try {
    return await apiFetch(`/api/favorites?countryCode=${countryCode}&countryName=${encodeURIComponent(countryName)}`, {
      method: 'POST'
    });
  } catch (err) {
    console.warn(`[API] addFavorite failed:`, err.message);
    throw err;
  }
}

export async function removeFavorite(id) {
  try {
    await apiFetch(`/api/favorites/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (err) {
    console.warn(`[API] removeFavorite failed:`, err.message);
    throw err;
  }
}

// 8. AI Chatbot Endpoint
export async function sendChatMessage(countryCode, userMessage) {
  try {
    const res = await apiFetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ countryCode, userMessage })
    });
    return res.answer || res.response || res;
  } catch (err) {
    console.warn(`[API] /api/chat failed:`, err.message);
    throw err;
  }
}
