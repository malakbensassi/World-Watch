# 🌍 WorldWatch — Real-time Global Intelligence & Geopolitical Risk Terminal

Application web centralisée fournissant en temps réel les informations clés, les indicateurs macroéconomiques et les risques géopolitiques mondiaux (capitales, devises, PIB, alliances, actualités financières et géopolitiques), avec carte mondiale interactive en matrice de points (*canvas dot map*), système de favoris et analyste IA dédié (Gemini).

Projet PFA — Architecture découplée :
- **Backend** : Spring Boot 3.2.5 (Java 21), Modular Monolith, Spring Security JWT, Spring AI Gemini, Spring Data JPA / MySQL.
- **Frontend** : React 18, Vite, Vanilla CSS haute performance (Design Fintech Pro, Dark/Light modes), Canvas HTML5 D3-Geo pour la carte interactive.

---

## 🏗️ Architecture & Stack Technique

| Composant | Technologie | Description |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Interface ultra-réactive avec navigation fluide |
| **Data Viz / Cartographie** | HTML5 Canvas + `d3-geo` + `topojson-client` | Carte mondiale interactive en pointillés haute performance |
| **Styling** | Vanilla CSS Moderne | Design system sur-mesure Fintech, Glassmorphism, animations fluides |
| **Backend Framework** | Spring Boot 3.2.5 (Java 21) | Architecture modulaire par fonctionnalité avec encapsulation stricte |
| **Base de données** | MySQL | Persistance utilisateurs et listes de surveillance / favoris |
| **Sécurité** | Spring Security + JWT | Authentification sans état (stateless) |
| **Intelligence Artificielle** | Spring AI + Google Gemini (`gemini-2.5-flash`) | Analyste géopolitique contextuel |
| **Données Externes** | WebClient / REST APIs | Yahoo Finance, Données pays, Taux de change |

---

## 📦 Organisation du Projet

```
WorldWatch/
├── frontend/                          → Application React moderne
│   ├── src/
│   │   ├── api/                       → Client API (endpoints backend & proxies)
│   │   ├── components/                → Composants UI
│   │   │   ├── WorldMap.jsx           → Carte interactive en matrice de points
│   │   │   ├── LandingPage.jsx        → Page d'accueil Fintech de présentation
│   │   │   ├── SignInPage.jsx         → Page d'authentification complète
│   │   │   ├── CountryHero.jsx        → Dossier complet & gouvernance pays
│   │   │   ├── EconomicsWidget.jsx    → Indicateurs macroéconomiques (PIB, dette, rating)
│   │   │   ├── ConflictsWidget.jsx    → Risques & conflits géopolitiques
│   │   │   ├── ExchangeWidget.jsx     → Convertisseur de devises en temps réel
│   │   │   ├── NewsWidget.jsx         → Flux d'actualités (Finances & Géopolitique)
│   │   │   └── AiChatWidget.jsx       → Analyste IA Gemini avec contexte pays
│   │   ├── context/                   → Contextes Auth et Thème (Dark / Light)
│   │   ├── data/                      → Référentiel des pays & cartographie
│   │   └── styles/index.css           → Design System complet et tokens CSS
├── src/main/java/com/worldwatch/      → Backend Spring Boot
│   ├── auth/                          → Inscription, connexion, validation JWT
│   ├── countries/                     → Données pays
│   ├── favorites/                     → Gestion de la liste de surveillance
│   ├── exchange/                      → Taux de change en temps réel
│   ├── news/                          → Actualités par pays
│   ├── ai/                            → Chatbot IA Gemini
│   └── config/                        → Sécurité, CORS, WebClient global
├── pom.xml                            → Dépendances Maven Java
└── WorldWatch_API_Reference.md        → Spécification détaillée des endpoints REST
```

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- **Java 21** installé
- **Node.js** (v18+) et **npm**
- **MySQL** local (optionnel pour le frontend autonome)

### 2. Lancement du Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application s'ouvre sur : **`http://localhost:5173`**  
- Navigation interactive entre :
  - **Landing Page** : Présentation du terminal Fintech
  - **World Map** : Carte mondiale interactive en pointillés avec sélection et inspection
  - **Dashboard** : Terminal analytique complet (Macroéconomie, Risques, Devises, News, IA)
  - **Dark / Light Mode** : Basculement instantané en haut à droite

### 3. Lancement du Backend

Créez votre fichier `.env` à la racine à partir du modèle `.env.example` :

```env
GEMINI_API_KEY=votre_cle_gemini
EXCHANGE_RATE_API_KEY=votre_cle_exchangerate
NEWS_API_KEY=votre_cle_newsapi
JWT_SECRET=votre_secret_jwt_32_caracteres_min
DB_USERNAME=root
DB_PASSWORD=
```

Puis lancez l'application Spring Boot :

```bash
./mvnw spring-boot:run
```

L'API sera disponible sur **`http://localhost:8080`**.

---

## 🗺️ Fonctionnalités Clés du Terminal

1. **Carte Interactive en Points (Dotted Matrix)** :
   - Rendu Canvas 60 FPS sans dépendance externe lourde.
   - Surlignage immédiat du pays sélectionné en cyan lumineux avec halo (*glow*).
   - Niveau de menace géopolitique visible par couleur de point (*Critical, Elevated, Moderate, Low*).
   - Inspection au survol et profil complet en panneau latéral.
2. **Dossier Géopolitique & Économique** :
   - PIB nominal, croissance, inflation, dette publique, notation souveraine.
   - Alliances géostratégiques (OTAN, Ligue Arabe, Union Africaine, etc.) et zones de litiges actifs.
3. **Double Thème Fluide** :
   - Mode Sombre Obsidian / Navy pour salle de marché.
   - Mode Clair épuré et contrasté.
4. **Analyste IA Intégré** :
   - Prompting contextuel injectant les données temps réel du pays interrogé dans Gemini.

---

## 📄 Documentation API

Pour consulter l'intégralité des routes, payloads et codes de retour HTTP, consultez :  
👉 [`WorldWatch_API_Reference.md`](./WorldWatch_API_Reference.md)
