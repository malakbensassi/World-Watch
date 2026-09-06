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


// 3. Exchange Rate Endpoint
export async function fetchExchangeRate(targetCurrency, baseCurrency = 'USD') {
  try {
    return await apiFetch(`/api/exchange-rate?currency=${targetCurrency}&base=${baseCurrency}`);
  } catch (err) {
    console.warn(`[API] /api/exchange-rate failed. Using simulated rate calculation.`, err.message);
    return null;
  }
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
