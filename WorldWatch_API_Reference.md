# World Watch — API Reference

Base URL locale : `http://localhost:8080`

⚠️ **Toutes les routes sauf `/api/favorites/**` sont en accès libre.** Seuls les favoris exigent un JWT (`Authorization: Bearer <token>`), obtenu via `/api/auth/login`.

---

## 1. Auth (`com.worldwatch.auth`)

### 1.1 Inscription

```
POST /api/auth/register
Content-Type: application/json
```

**Body**
```json
{ "username": "test", "password": "pass123" }
```

**Réponse 200 OK**
```json
{ "id": 1, "username": "test" }
```

**Erreurs possibles**
- `400` : champs vides/invalides, ou username déjà pris

---

### 1.2 Connexion

```
POST /api/auth/login
Content-Type: application/json
```

**Body**
```json
{ "username": "test", "password": "pass123" }
```

**Réponse 200 OK**
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

**Erreurs possibles**
- `400` : identifiants incorrects ou champs invalides

➡️ **Copie ce token pour les endpoints protégés (favoris uniquement).**

---

## 2. Données pays (`com.worldwatch.countries`)

### 2.1 Aperçu rapide (usage interne + affichage simple)

```
GET /api/countries/{code}
```

Exemple : `GET /api/countries/MA`

**Réponse 200 OK**
```json
{
  "name": "Morocco",
  "capital": "Rabat",
  "currency": "Moroccan dirham (MAD)",
  "population": 36910558
}
```

*(source : countries.dev — utilisé aussi en interne par le chatbot IA pour le context stuffing)*

---

### 2.2 Détails enrichis (nouveau)

```
GET /api/countries/{code}/details
```

Exemple : `GET /api/countries/MA/details`

**Réponse 200 OK**
```json
{
  "countryCode": "MA",
  "name": "Morocco",
  "capital": "Rabat",
  "currency": "Moroccan dirham (MAD)",
  "currencyCode": "MAD",
  "currencySymbol": "د.م.",
  "population": 37254695,
  "landAreaKm2": 446550.0,
  "flagSvg": "https://flags.restcountries.com/v5/svg/ma.svg",
  "flagPng": "https://flags.restcountries.com/v5/w640/ma.png",
  "mapsUrl": "https://goo.gl/maps/6oMv3dyBZg3iaXQ5A",
  "timezones": ["UTC"],
  "unMember": true,
  "officialLanguages": ["Arabic", "Standard Moroccan Tamazight"],
  "borderCountries": ["DZA", "ESH", "ESP"],
  "region": "Africa",
  "subregion": "Northern Africa",
  "governmentType": "Unitary parliamentary semi-constitutional monarchy"
}
```

*(source : [REST Countries v5](https://restcountries.com/docs/countries) — officielle, 500 requêtes/mois gratuites, clé API requise)*

💡 **Utilise `currencyCode` (pas `currency`) pour appeler `/api/exchange-rate`** — c'est déjà le code ISO pur (`MAD`), pas besoin de le parser depuis la string lisible.

**Erreurs possibles**
- `404` : code pays inconnu

⚠️ **Limitation connue** : `headOfState` n'est pas disponible sur le plan gratuit de REST Countries (champ premium `leaders`). Aucun champ équivalent n'est renvoyé par cet endpoint.

---

## 3. Favoris (`com.worldwatch.favorites`) — protégé

Toutes les routes ci-dessous exigent `Authorization: Bearer <token>`.

### 3.1 Ajouter un favori
```
POST /api/favorites?countryCode=MA&countryName=Morocco
```
**Réponse 200 OK**
```json
{ "id": 1, "countryCode": "MA", "countryName": "Morocco", "ownerId": "test" }
```

### 3.2 Lister mes favoris
```
GET /api/favorites
```
**Réponse 200 OK**
```json
[{ "id": 1, "countryCode": "MA", "countryName": "Morocco", "ownerId": "test" }]
```

### 3.3 Supprimer un favori
```
DELETE /api/favorites/{id}
```
**Réponse** : `200 OK` (pas de contenu)

---

## 4. Taux de change (`com.worldwatch.exchange`)

```
GET /api/exchange-rate?currency=MAD&base=USD
```

| Param | Obligatoire | Défaut |
|---|---|---|
| `currency` | oui | — |
| `base` | non | `USD` |

**Réponse 200 OK**
```json
{ "baseCurrency": "USD", "targetCurrency": "MAD", "rate": 9.85, "date": "latest" }
```

*(source : ExchangeRate-API, 160+ devises)*

---

## 5. Actualités (`com.worldwatch.news`)

```
GET /api/news?country=Morocco
```

**Réponse 200 OK**
```json
[{
  "title": "...",
  "description": "...",
  "url": "...",
  "source": "...",
  "publishedAt": "2026-08-12T10:00:00Z"
}]
```

*(recherche via `qInTitle` + `sortBy=relevancy`)*

---

## 6. Météo (`com.worldwatch.weather`)

```
GET /api/weather?city=Rabat
```

**Réponse 200 OK**
```json
{
  "location": "Rabat",
  "temperature": 24.3,
  "windSpeed": 12.4,
  "condition": "Partly cloudy",
  "time": "2026-09-12T14:00"
}
```

*(source : Open-Meteo, sans clé API)*

---

## 7. Chatbot IA (`com.worldwatch.ai`)

```
POST /api/chat
Content-Type: application/json
```

**Body**
```json
{ "countryCode": "MA", "userMessage": "What's the weather like right now?" }
```

**Réponse 200 OK**
```json
{ "answer": "Right now in Rabat it's 24°C and partly cloudy..." }
```

**Comportement** : l'IA reçoit en contexte vérifié population/capitale/devise/météo réelle du pays sélectionné (jamais contredits), mais répond librement sur tout autre sujet (autres pays, culture, voyage, finance) grâce à ses connaissances générales.

---

## Récapitulatif des endpoints

| Méthode | Route | Auth requise |
|---|---|---|
| POST | `/api/auth/register` | ❌ |
| POST | `/api/auth/login` | ❌ |
| GET | `/api/countries/{code}` | ❌ |
| GET | `/api/countries/{code}/details` | ❌ |
| POST | `/api/favorites` | ✅ |
| GET | `/api/favorites` | ✅ |
| DELETE | `/api/favorites/{id}` | ✅ |
| GET | `/api/exchange-rate` | ❌ |
| GET | `/api/news` | ❌ |
| GET | `/api/weather` | ❌ |
| POST | `/api/chat` | ❌ |

---

## ⚠️ Point ouvert à discuter en groupe

`/api/countries/{code}` (aperçu simple) utilise encore `countries.dev`, alors que `/api/countries/{code}/details` (enrichi) utilise désormais l'API officielle REST Countries v5. Les deux sources coexistent pour l'instant — à terme, on pourrait migrer l'endpoint simple vers REST Countries v5 aussi, pour n'avoir qu'une seule source de vérité. Pas urgent, mais à trancher avant la soutenance.
