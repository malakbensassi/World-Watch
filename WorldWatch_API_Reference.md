# World Watch — API Reference (état actuel)

Base URL locale : `http://localhost:8080`

⚠️ Depuis l'ajout de Spring Security, **toutes les routes sauf `/api/auth/**` exigent un header `Authorization: Bearer <token>`** obtenu via `/api/auth/login`.

---

## 1. Auth (`com.worldwatch.auth`)

### 1.1 Inscription

```
POST /api/auth/register
Content-Type: application/json
```

**Body**
```json
{
  "username": "test",
  "password": "pass123"
}
```

**Réponse 200 OK**
```json
{
  "id": 1,
  "username": "test"
}
```

**Erreurs possibles**
- `400` si le username existe déjà (`IllegalArgumentException: Username already taken`)

---

### 1.2 Connexion

```
POST /api/auth/login
Content-Type: application/json
```

**Body**
```json
{
  "username": "test",
  "password": "pass123"
}
```

**Réponse 200 OK**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiaWF0IjoxNzU1..."
}
```

**Erreurs possibles**
- `400` si username ou password incorrect (`IllegalArgumentException: Invalid credentials`)

➡️ **Copie ce token — il faut le mettre dans le header `Authorization` de toutes les requêtes ci-dessous.**

---

## 2. Favoris (`com.worldwatch.favorites`)

Toutes les routes ci-dessous nécessitent :
```
Authorization: Bearer <token>
```
(le `ownerId` est désormais extrait automatiquement du token — plus besoin d'un header `X-User-Id` manuel)

### 2.1 Ajouter un favori

```
POST /api/favorites?countryCode=MA&countryName=Morocco
Authorization: Bearer <token>
```

**Body** : aucun (params dans l'URL)

**Réponse 200 OK**
```json
{
  "id": 1,
  "countryCode": "MA",
  "countryName": "Morocco",
  "ownerId": "test"
}
```

---

### 2.2 Lister mes favoris

```
GET /api/favorites
Authorization: Bearer <token>
```

**Body** : aucun

**Réponse 200 OK**
```json
[
  {
    "id": 1,
    "countryCode": "MA",
    "countryName": "Morocco",
    "ownerId": "test"
  }
]
```

---

### 2.3 Supprimer un favori

```
DELETE /api/favorites/{id}
Authorization: Bearer <token>
```

Exemple : `DELETE /api/favorites/1`

**Body** : aucun

**Réponse** : `200 OK` (pas de contenu)

**Erreurs possibles**
- `403`/exception si le favori n'appartient pas à l'utilisateur authentifié (`SecurityException: Not authorized to delete this favorite`)

---

## 3. Taux de change (`com.worldwatch.exchange`)

```
GET /api/exchange-rate?currency=MAD&base=USD
Authorization: Bearer <token>
```

**Body** : aucun

**Query params**
| Param | Obligatoire | Défaut | Exemple |
|---|---|---|---|
| `currency` | oui | — | `MAD` |
| `base` | non | `USD` | `EUR` |

**Réponse 200 OK**
```json
{
  "baseCurrency": "USD",
  "targetCurrency": "MAD",
  "rate": 9.85,
  "date": "latest"
}
```

*(source : ExchangeRate-API — couvre 160+ devises, y compris MAD)*

---

## 4. Actualités (`com.worldwatch.news`)

```
GET /api/news?country=Morocco
Authorization: Bearer <token>
```

**Body** : aucun

**Query params**
| Param | Obligatoire | Exemple |
|---|---|---|
| `country` | oui | `Morocco` |

**Réponse 200 OK**
```json
[
  {
    "title": "Article title mentioning Morocco",
    "description": "Short excerpt of the article...",
    "url": "https://example.com/article",
    "source": "Source Name",
    "publishedAt": "2026-08-12T10:00:00Z"
  }
]
```

*(recherche via `qInTitle` + `sortBy=relevancy` pour ne récupérer que les articles où le pays apparaît réellement dans le titre)*

---

## 5. Chatbot IA (`com.worldwatch.ai`)

```
POST /api/chat
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**
```json
{
  "countryCode": "MA",
  "userMessage": "What is the current political situation?"
}
```

**Réponse 200 OK**
```json
{
  "response": "Morocco, with its capital Rabat and a population of approximately 37 million, ..."
}
```

*(le service récupère d'abord les données factuelles du pays via `CountryDataService`, les injecte dans le system prompt, puis appelle Gemini via `gemini-2.5-flash`)*

⚠️ Vérifie les noms exacts des champs de `ChatRequest` dans ton code (`countryCode` / `userMessage`) — à ajuster si tes noms de champs diffèrent.

---

## 6. Données pays (`com.worldwatch.countries`)

⚠️ **Aucun endpoint REST public n'existe encore pour ce module.**

`CountryDataService` est actuellement **utilisé uniquement en interne** par `AiChatServiceImpl` (context stuffing pour le chatbot) — il n'est pas exposé directement au frontend.

Si tu veux que le frontend puisse aussi afficher capitale/population/devise indépendamment du chat (ce que décrit ton cahier des charges), il manque un `CountryController` du type :

```
GET /api/countries/{code}
```

Dis-moi si tu veux qu'on l'ajoute — c'est rapide vu que `CountryDataService` existe déjà, il ne manque qu'un controller fin qui l'expose.

---

## Récapitulatif des endpoints

| Méthode | Route | Auth requise | Statut |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | ✅ |
| POST | `/api/auth/login` | ❌ | ✅ |
| POST | `/api/favorites` | ✅ | ✅ |
| GET | `/api/favorites` | ✅ | ✅ |
| DELETE | `/api/favorites/{id}` | ✅ | ✅ |
| GET | `/api/exchange-rate` | ✅ | ✅ |
| GET | `/api/news` | ✅ | ✅ |
| POST | `/api/chat` | ✅ | ✅ |
| GET | `/api/countries/{code}` | — | ❌ manquant |
