# Design — Étape 1 : Docker Compose

**Date :** 2026-04-03
**Scope :** Mise en place de l'infrastructure Docker Compose (3 services)

---

## Décision d'approche

Option A retenue : conformité stricte avec le CLAUDE.md, aucun ajout superflu.

---

## Fichiers à créer

| Fichier | Rôle |
|---|---|
| `docker-compose.yml` | Orchestration des 3 services |
| `.env` | Variables sensibles (non committé) |
| `.env.example` | Template sans valeurs réelles |
| `backend/Dockerfile` | Image Node 18 placeholder |
| `frontend/Dockerfile` | Image Node 18 + Vite placeholder |

---

## Services Docker Compose

### `db`
- Image : `postgres:15`
- Volume nommé : `pgdata` (persistance)
- Variables : `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` depuis `.env`
- Healthcheck : `pg_isready -U $POSTGRES_USER` (interval 5s, retries 5)

### `backend`
- Build : `./backend`
- Port : `3001:3001`
- `depends_on: db: condition: service_healthy`
- Variables DB injectées depuis `.env`

### `frontend`
- Build : `./frontend`
- Port : `5173:5173`
- `depends_on: backend`

---

## Variables d'environnement (.env)

```
POSTGRES_USER=user
POSTGRES_PASSWORD=secret
POSTGRES_DB=ecommerce
ADMIN_KEY=admin-secret-key
```

---

## Dockerfiles placeholders

Les Dockerfiles sont minimalistes pour valider le build à l'étape 1.
Le vrai code applicatif sera ajouté aux étapes 2, 3 et 4.

**backend/Dockerfile** : Node 18 alpine, expose 3001
**frontend/Dockerfile** : Node 18 alpine, expose 5173

---

## Critère de validation

`docker compose up --build` → les 3 conteneurs sont UP sans erreur.
