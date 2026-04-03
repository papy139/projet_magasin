# Projet : Application E-commerce Fullstack

## Stack technique
- Frontend : React + Vite (JSX)
- Backend : Node.js + Express
- Base de données : PostgreSQL
- Orchestration : Docker Compose (3 services : front, back, db)

## Structure cible
```
projet/
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md
├── frontend/
│   ├── Dockerfile
│   ├── vite.config.js
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── api/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       └── db/
└── database/
    └── init.sql
```

---

## Ordre de travail STRICT — ne pas sauter d'étape

### Étape 1 — Docker Compose
Crée le docker-compose.yml avec les 3 services :
- `db` : image postgres:15, volume persistant, healthcheck sur pg_isready
- `backend` : build depuis ./backend, dépend de db healthy, port 3001
- `frontend` : build depuis ./frontend, dépend de backend, port 5173

Toutes les variables sensibles (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) dans un fichier `.env` à la racine, référencé via `env_file` dans le compose.

**Validation : `docker compose up --build` → les 3 conteneurs doivent être UP avant de continuer.**

---

### Étape 2 — Base de données
Crée `database/init.sql` avec les tables suivantes :

```sql
-- Produits
products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Commandes
orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
)

-- Lignes de commande
order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
)
```

Pas de table users côté client — le sujet ne le demande pas.

---

### Étape 3 — Backend API

Structure stricte :
```
src/
├── routes/
│   ├── products.js
│   └── orders.js
├── controllers/
│   ├── productsController.js
│   └── ordersController.js
├── middleware/
│   ├── adminAuth.js       # vérification clé admin simple
│   └── errorHandler.js
└── db/
    └── pool.js            # connexion PostgreSQL via pg
```

#### Routes à implémenter dans l'ordre :

**Santé**
- `GET /health` → retourne `{ status: "ok" }`

**Produits (public)**
- `GET /api/products` → liste tous les produits, supporte query params `?search=` et `?category=`
- `GET /api/products/:id` → détail d'un produit

**Produits (admin protégé)**
- `POST /api/products` → créer un produit
- `PUT /api/products/:id` → modifier un produit (nom, description, prix, image, catégorie)
- `PATCH /api/products/:id/stock` → modifier uniquement le stock
- `DELETE /api/products/:id` → supprimer un produit

**Commandes (public)**
- `POST /api/orders` → passer une commande (décrémente le stock automatiquement)

**Commandes (admin protégé)**
- `GET /api/orders` → liste toutes les commandes

#### Authentification admin
Pas de JWT. Une clé statique dans le `.env` (`ADMIN_KEY`).
Le middleware `adminAuth.js` vérifie le header `x-admin-key`.
Simple, suffisant pour le scope du projet.

**Validation : tester chaque endpoint avec curl ou un fichier `.http` avant de passer à l'étape suivante.**

---

### Étape 4 — Frontend

Pages à créer dans cet ordre :

1. **Catalogue** (page d'accueil)
   - Affichage de tous les produits avec stock disponible
   - Barre de recherche et/ou filtre par catégorie
   - Bouton "Ajouter au panier" (désactivé si stock = 0)

2. **Panier**
   - State global via Context API
   - Affichage des produits ajoutés, quantités, total
   - Bouton "Passer la commande"

3. **Passage de commande**
   - Formulaire : nom + email client
   - Pas de paiement, pas de livraison
   - Appel `POST /api/orders` à la validation

4. **Historique des commandes**
   - Le client entre son email pour retrouver ses commandes
   - Affichage de la liste avec statut

5. **Login admin**
   - Formulaire simple : saisie de la clé admin
   - Stockage de la clé dans le state ou sessionStorage

6. **Dashboard admin**
   - CRUD complet sur les produits (ajout, modification, suppression)
   - Gestion des stocks (modification des quantités)
   - Visualisation de toutes les commandes passées

---

### Étape 5 — Livrables finaux

- `.gitignore` : node_modules, .env, dist, build
- `README.md` avec :
  - Prérequis (Docker, Docker Compose)
  - Instructions de lancement (`cp .env.example .env` puis `docker compose up --build`)
  - URLs d'accès (frontend :5173, backend :3001)
  - Clé admin par défaut pour tester

**Validation finale : `docker compose up --build` depuis la racine, tout doit démarrer proprement.**

---

## Règles de développement

- Commit Git après chaque étape validée
- Variables d'environnement uniquement dans `.env`, jamais hardcodées
- Gestion d'erreurs centralisée côté backend (middleware errorHandler)
- Pas de console.log de debug laissés dans le code final
- Le stock doit être décrémenté à la commande et ne peut pas passer en négatif (vérification backend)

## Priorités d'évaluation (dans l'ordre)
1. Docker : les 3 services démarrent avec une seule commande
2. Architecture backend : séparation routes / controllers / middleware
3. Fonctionnalités complètes des deux parties (public + admin)
4. Code lisible et organisé
5. README fonctionnel

## En cas de blocage
Signaler explicitement l'étape et l'erreur exacte. Ne jamais contourner un problème Docker en hardcodant des valeurs.
