# E-commerce Fullstack

Application e-commerce complète avec React, Node.js/Express et PostgreSQL, orchestrée via Docker Compose.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose (inclus dans Docker Desktop)

## Lancement

```bash
git clone https://github.com/papy139/projet_magasin.git
cd projet_magasin
cp .env.example .env
docker compose up --build
```

Le fichier `.env.example` contient des valeurs par défaut fonctionnelles — aucune modification nécessaire pour un premier lancement.

> **Mise à jour depuis une version précédente ?** Le schéma de base de données a évolué. Réinitialisez le volume :
> ```bash
> docker compose down -v && docker compose up --build
> ```

## URLs

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3001 |
| Santé API | http://localhost:3001/health |
| Admin    | http://localhost:5173/admin |

**Clé admin par défaut :** `admin-secret-key`

## Fonctionnalités

### Catalogue public

- Grille de produits avec recherche, filtre par catégorie et tri (nouveautés, prix, stock, popularité)
- Notation par étoiles et badge "Coup de coeur" sur les produits mis en avant
- Page détail produit avec produits similaires
- Panier persistant (localStorage), limité au stock disponible
- Passage de commande (nom + email client)
- Historique des commandes par email

### Dashboard admin

- Statistiques en temps réel (produits, ruptures, commandes, en attente)
- Ajout et modification de produits via une modale (avec preview image et catégorie intelligente)
- Gestion des stocks en ligne directement dans le tableau
- Suppression avec confirmation inline
- Visualisation et mise à jour du statut des commandes (en attente / confirmée / annulée)
- Filtres avancés sur les produits et les commandes

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18, Vite 5, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express |
| Base de données | PostgreSQL 15 |
| Orchestration | Docker Compose |

## Structure

```
projet/
├── docker-compose.yml
├── .env.example
├── frontend/          # React + Vite
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── api/
│       └── hooks/
├── backend/           # Node.js + Express
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       └── db/
└── database/
    └── init.sql       # Schéma + données initiales
```

## API Backend

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/health` | Santé du service | — |
| GET | `/api/products` | Liste des produits (`?search=` `?category=`) | — |
| GET | `/api/products/:id` | Détail d'un produit | — |
| POST | `/api/products` | Créer un produit | Admin |
| PUT | `/api/products/:id` | Modifier un produit | Admin |
| PATCH | `/api/products/:id/stock` | Modifier le stock | Admin |
| DELETE | `/api/products/:id` | Supprimer un produit | Admin |
| POST | `/api/orders` | Passer une commande | — |
| GET | `/api/orders` | Toutes les commandes | Admin |
| GET | `/api/orders?email=` | Commandes par email | — |

L'authentification admin se fait via le header `x-admin-key`.
