# World Watch — Backend

Application web centralisée fournissant en temps réel les informations clés de n'importe quel pays (capitale, population, taux de change, actualités récentes), avec système de favoris personnalisés et chatbot IA dédié.

Projet PFA — Modular Monolith en Java 21 / Spring Boot 3.2.5, architecture package-by-feature avec encapsulation stricte (`internal` packages).

---

## 🏗️ Stack technique

| Composant | Techno |
|---|---|
| Langage | Java 21 |
| Framework | Spring Boot 3.2.5 |
| Base de données | MySQL (via Spring Data JPA / Hibernate) |
| Auth | Spring Security + JWT (stateless) |
| Appels HTTP externes | Spring WebFlux (`WebClient`) |
| IA | Spring AI + Gemini (Google GenAI, `gemini-2.5-flash`) |
| Config secrets | `spring-dotenv` (fichier `.env` local, jamais commité) |

---

## 📦 Modules

```
com.worldwatch
├── auth          → inscription, connexion, JWT
├── countries     → données pays (capitale, population, devise)
├── favorites     → favoris personnalisés par utilisateur (protégé JWT)
├── exchange      → taux de change en temps réel
├── news          → actualités récentes par pays
├── ai            → chatbot IA avec context stuffing
└── config        → SecurityConfig, GlobalExceptionHandler, WebClientConfig
```

Chaque module suit le même pattern : une interface publique (`XxxService`) + des DTOs publics au niveau du package racine du module, et l'implémentation (`XxxServiceImpl`, `XxxController`, entités JPA) cachée dans un sous-package `internal` non accessible depuis l'extérieur du module.

📄 **Liste complète des endpoints, requêtes et réponses : voir [`WorldWatch_API_Reference.md`](./WorldWatch_API_Reference.md)**

---

## ⚙️ Setup — À faire par chaque collègue individuellement

### 1. Cloner le repo

```bash
git clone <url-du-repo>
cd WorldWatch
```

### 2. Créer la base de données MySQL locale

```sql
CREATE DATABASE worldwatch_db;
```

Le schéma des tables est généré automatiquement au démarrage par Hibernate (`spring.jpa.hibernate.ddl-auto=update`) — aucune migration manuelle nécessaire.

### 3. Créer ton fichier `.env` à la racine du projet

⚠️ **Ce fichier est dans `.gitignore` — il ne doit jamais être commité.** Chacun a ses propres clés, gratuites et individuelles.

```env
# Gemini API (chatbot IA) — clé gratuite sur https://aistudio.google.com/apikey
GEMINI_API_KEY=

# ExchangeRate-API (taux de change) — clé gratuite sur https://www.exchangerate-api.com/
EXCHANGE_RATE_API_KEY=

# NewsAPI (actualités) — clé gratuite sur https://newsapi.org/register
NEWS_API_KEY=

# JWT — génère une chaîne aléatoire de 32+ caractères, ex: openssl rand -base64 32
JWT_SECRET=

# MySQL local (ajuste selon ta config)
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Vérifie `application.properties`

Ces valeurs pointent déjà vers les variables `.env` ci-dessus — rien à changer sauf le port MySQL si le tien diffère de `3306` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/worldwatch_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.ai.google.genai.api-key=${GEMINI_API_KEY}
spring.ai.google.genai.chat.options.model=gemini-2.5-flash

exchangerate.api.key=${EXCHANGE_RATE_API_KEY}
news.api.key=${NEWS_API_KEY}

jwt.secret=${JWT_SECRET}
jwt.expiration-ms=86400000
```

### 5. Lance l'application

Depuis IntelliJ : Run sur `WorldWatchApplication.java`, ou en ligne de commande :

```bash
./mvnw spring-boot:run
```

L'API tourne sur `http://localhost:8080`.

---

## 🔐 Authentification

Toutes les routes sauf `/api/auth/register` et `/api/auth/login` exigent un JWT :

```
Authorization: Bearer <token>
```

Le token s'obtient via `POST /api/auth/login`, valable 24h.

---

## 🌐 CORS (pour le développement frontend)

Le backend accepte actuellement toute origine `localhost:*` en développement (peu importe le port choisi pour Vite/React/etc.). Cette configuration est temporaire et sera restreinte à l'URL de prod une fois le frontend déployé — voir `SecurityConfig.java`.

---

## 🧩 Sources de données externes utilisées

| Donnée | Source | Clé requise |
|---|---|---|
| Pays (capitale, population, devise) | [countries.dev](https://countries.dev) | Non |
| Taux de change | [ExchangeRate-API](https://www.exchangerate-api.com/) | Oui (gratuite) |
| Actualités | [NewsAPI](https://newsapi.org) | Oui (gratuite) |
| Chatbot IA | Google Gemini via Google AI Studio | Oui (gratuite) |

⚠️ Ne pas utiliser `restcountries.com` — l'ancienne API (v3.1) est dépréciée et la nouvelle (v5) nécessite une clé payante.

---

## 🐛 Problèmes connus / pièges déjà rencontrés

- `countries.dev` et `exchangerate-api.com` peuvent nécessiter de suivre des redirections HTTP — le `WebClient` global (`WebClientConfig`) est déjà configuré avec `followRedirect(true)`, ne pas dupliquer cette config par service.
- Le modèle Gemini se déprécie régulièrement — si `/api/chat` renvoie une erreur 404 côté Google, vérifier le modèle configuré dans `application.properties`.
- `NewsAPI` avec l'endpoint `/v2/everything` cherche par défaut dans tout le corps de l'article : on utilise `qInTitle` + `sortBy=relevancy` pour éviter les faux positifs.

---

## 👥 Équipe

PFA — 4 personnes. Pour toute question sur l'API, se référer à [`WorldWatch_API_Reference.md`](./WorldWatch_API_Reference.md) avant de demander sur le groupe.
