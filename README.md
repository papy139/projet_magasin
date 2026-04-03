# E-commerce Fullstack

Application e-commerce fullstack avec React, Node.js/Express et PostgreSQL, orchestrée via Docker Compose.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus dans Docker Desktop)

## Lancement

```bash
git clone https://github.com/papy139/projet_magasin.git
cd projet_magasin
cp .env.example .env
docker compose up --build
```

Le fichier `.env.example` contient des valeurs par défaut fonctionnelles — pas besoin de l'éditer pour un premier lancement.

Les 3 services démarrent automatiquement :
- **Base de données** PostgreSQL (avec données initiales)
- **Backend** Express (attend que la DB soit prête)
- **Frontend** React/Vite (attend que le backend soit prêt)

## URLs

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:3001      |
| Health   | http://localhost:3001/health |

## Clé admin par défaut

La clé admin définie dans `.env.example` est `admin-secret-key`.

Accès au dashboard admin : http://localhost:5173/admin

## Fonctionnalités

**Côté public**
- Catalogue produits avec recherche et filtre par catégorie
- Panier (Context API, persistant dans la session)
- Passage de commande (nom + email)
- Historique des commandes (stocké en localStorage)

**Côté admin** (clé requise)
- Ajout / modification / suppression de produits
- Gestion des stocks
- Visualisation de toutes les commandes

## Stack technique

- Frontend : React 18 + Vite 5 + Tailwind CSS
- Backend : Node.js + Express
- Base de données : PostgreSQL 15
- Orchestration : Docker Compose
