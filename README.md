# World Watch — Backend

Application web centralisée fournissant en temps réel les informations clés de n'importe quel pays (capitale, population, taux de change, actualités récentes, météo), avec système de favoris personnalisés et chatbot IA généraliste doté d'un contexte pays vérifié.

Projet PFA — Modular Monolith en Java 21 / Spring Boot 3.5.16, architecture package-by-feature avec encapsulation stricte (`internal` packages).

---

## 🏗️ Stack technique

| Composant | Techno |
|---|---|
| Langage | Java 21 |
| Framework | Spring Boot 3.5.16 |
| Base de données | MySQL (Spring Data JPA / Hibernate) |
| Auth | Spring Security + JWT (stateless) — favoris uniquement |
| Appels HTTP externes | Spring WebFlux (`WebClient`) |
| IA | Spring AI + Gemini (Google GenAI) |
| Config secrets | `spring-dotenv` (fichier `.env` local, jamais commité) |

---

## 📦 Modules

```
com.worldwatch
├── auth          → inscription, connexion, JWT
├── countries     → aperçu simple (countries.dev) + détails enrichis (REST Countries v5)
├── favorites     → favoris personnalisés par utilisateur (seul module protégé JWT)
├── exchange      → taux de change en temps réel
├── news          → actualités récentes par pays
├── weather       → météo en temps réel (Open-Meteo)
├── ai            → chatbot IA généraliste avec contexte pays vérifié (population/capitale/devise/météo)
└── config        → SecurityConfig, GlobalExceptionHandler, WebClientConfig
```

📄 **Liste complète des endpoints, requêtes et réponses : voir [`WorldWatch_API_Reference.md`](./WorldWatch_API_Reference.md)**

---

## ⚙️ Setup — à faire par chaque collègue individuellement

### 1. Cloner / mettre à jour le repo
```bash
git clone https://github.com/malakbensassi/World-Watch.git
# ou, si déjà cloné :
git pull origin main
```

### 2. Créer la base de données MySQL locale
```sql
CREATE DATABASE worldwatch_db;
```

### 3. Créer ton fichier `.env` à la racine du projet

⚠️ Jamais commité (`.gitignore` déjà configuré). Chacun crée ses propres clés gratuites.

```env
# Gemini API (chatbot IA) — https://aistudio.google.com/apikey
GEMINI_API_KEY=

# ExchangeRate-API (taux de change) — https://www.exchangerate-api.com/
EXCHANGE_RATE_API_KEY=

# NewsAPI (actualités) — https://newsapi.org/register
NEWS_API_KEY=

# REST Countries v5 (détails enrichis pays) — https://restcountries.com/sign-up
RESTCOUNTRIES_API_KEY=

# JWT — génère avec : openssl rand -base64 32
JWT_SECRET=

# MySQL local
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Vérifie `application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/worldwatch_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.ai.google.genai.api-key=${GEMINI_API_KEY}
spring.ai.google.genai.chat.options.model=gemini-3.5-flash-lite

exchangerate.api.key=${EXCHANGE_RATE_API_KEY}
news.api.key=${NEWS_API_KEY}
restcountries.api.key=${RESTCOUNTRIES_API_KEY}

jwt.secret=${JWT_SECRET}
jwt.expiration-ms=86400000
```

### 5. Lance l'application
```bash
mvn clean install
```
Puis Run sur `WorldWatchApplication.java` depuis IntelliJ, ou :
```bash
./mvnw spring-boot:run
```
L'API tourne sur `http://localhost:8080`.

---

## 🔐 Authentification

Seules les routes `/api/favorites/**` exigent un JWT :
```
Authorization: Bearer <token>
```
Obtenu via `POST /api/auth/login`, valable 24h. Tout le reste (countries, exchange-rate, news, weather, chat) est en accès libre.

---

## 🌐 CORS

Accepte toute origine `localhost:*` en développement — voir `SecurityConfig.java`. À restreindre à l'URL de prod une fois le frontend déployé.

---

## 🧩 Sources de données externes

| Donnée | Source | Clé requise |
|---|---|---|
| Pays (aperçu simple) | [countries.dev](https://countries.dev) | Non |
| Pays (détails enrichis) | [REST Countries v5](https://restcountries.com) | Oui (gratuite, 500 req/mois) |
| Taux de change | [ExchangeRate-API](https://www.exchangerate-api.com/) | Oui (gratuite) |
| Actualités | [NewsAPI](https://newsapi.org) | Oui (gratuite) |
| Météo | [Open-Meteo](https://open-meteo.com) | Non |
| Chatbot IA | Google Gemini via Google AI Studio | Oui (gratuite) |

⚠️ Ne pas utiliser `restcountries.com` v3.1 (dépréciée). L'endpoint `/details` utilise déjà la v5 officielle.

---

## 🐛 Pièges déjà rencontrés

- `countries.dev` / `exchangerate-api.com` peuvent rediriger en HTTP — `WebClientConfig` gère déjà `followRedirect(true)` globalement.
- Les modèles Gemini se déprécient régulièrement — vérifier `application.properties` en cas de 404 côté `/api/chat`.
- `NewsAPI` (`/v2/everything`) cherche dans tout le corps de l'article par défaut : on utilise `qInTitle` + `sortBy=relevancy`.
- **Pour `/api/exchange-rate`, toujours utiliser `currencyCode` (ex: `MAD`), jamais la string `currency` complète (ex: `"Moroccan dirham (MAD)"`)** — l'API de change attend un code ISO pur.
- `GET /api/countries/{code}/details` exige `RESTCOUNTRIES_API_KEY` dans le `.env` — sans elle, l'appel échoue avec une erreur d'auth côté REST Countries.

---

## 📋 Décisions produit encore ouvertes

1. Faut-il migrer `/api/countries/{code}` (aperçu simple) vers REST Countries v5 aussi, pour n'avoir qu'une seule source pays ?
2. `headOfState` et `majorIndustries` ne sont disponibles dans aucune API gratuite actuelle — décider s'ils restent en fallback frontend statique ou sont retirés de l'UI.

---

## 👥 Équipe

PFA — 4 personnes. Pour toute question sur l'API, se référer à [`WorldWatch_API_Reference.md`](./WorldWatch_API_Reference.md) avant de demander sur le groupe.
