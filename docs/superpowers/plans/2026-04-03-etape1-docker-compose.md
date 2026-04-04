# Étape 1 — Docker Compose Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Faire démarrer les 3 conteneurs (db, backend, frontend) avec `docker compose up --build`.

**Architecture:** Trois services Docker orchestrés via Compose. Les Dockerfiles backend et frontend sont des placeholders minimalistes — le vrai code applicatif vient aux étapes suivantes. Le service `db` démarre en premier grâce au healthcheck `pg_isready`, le backend attend `db healthy`, le frontend attend `backend`.

**Tech Stack:** Docker Compose, PostgreSQL 15, Node 18 Alpine, Vite 5, React 18, Express 4

---

### Task 1 : Fichiers d'environnement

**Files:**
- Create: `.env`
- Create: `.env.example`

- [ ] **Step 1 : Créer `.env`**

```
POSTGRES_USER=user
POSTGRES_PASSWORD=secret
POSTGRES_DB=ecommerce
ADMIN_KEY=admin-secret-key
```

- [ ] **Step 2 : Créer `.env.example`**

```
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=ecommerce
ADMIN_KEY=your_admin_key
```

- [ ] **Step 3 : Commit**

```bash
git init
git add .env.example
git commit -m "feat: add env example file"
```

Note : `.env` ne sera pas commité (sera dans `.gitignore` à l'étape 5).

---

### Task 2 : Backend placeholder

**Files:**
- Create: `backend/Dockerfile`
- Create: `backend/package.json`
- Create: `backend/src/index.js`

- [ ] **Step 1 : Créer `backend/package.json`**

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

- [ ] **Step 2 : Créer `backend/src/index.js`**

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

- [ ] **Step 3 : Créer `backend/Dockerfile`**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "src/index.js"]
```

- [ ] **Step 4 : Commit**

```bash
git add backend/
git commit -m "feat: add backend placeholder"
```

---

### Task 3 : Frontend placeholder

**Files:**
- Create: `frontend/Dockerfile`
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.jsx`

- [ ] **Step 1 : Créer `frontend/package.json`**

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2 : Créer `frontend/vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
```

- [ ] **Step 3 : Créer `frontend/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>E-commerce</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4 : Créer `frontend/src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <h1>E-commerce — placeholder</h1>
  </React.StrictMode>
);
```

- [ ] **Step 5 : Créer `frontend/Dockerfile`**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

- [ ] **Step 6 : Commit**

```bash
git add frontend/
git commit -m "feat: add frontend placeholder"
```

---

### Task 4 : docker-compose.yml

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1 : Créer `docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:15
    env_file:
      - .env
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    env_file:
      - .env
    environment:
      PORT: 3001
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    ports:
      - "3001:3001"
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  pgdata:
```

Note : le volume `./database/init.sql` sera créé à l'étape 2. Pour l'étape 1, créer un fichier vide `database/init.sql` pour éviter l'erreur Docker.

- [ ] **Step 2 : Créer `database/init.sql` vide**

```bash
mkdir -p database
touch database/init.sql
```

- [ ] **Step 3 : Valider — lancer le build**

```bash
docker compose up --build
```

Résultat attendu :
```
projet_lorenzo-db-1       | database system is ready to accept connections
projet_lorenzo-backend-1  | Backend running on port 3001
projet_lorenzo-frontend-1 | VITE v5.x ready in ...ms
```

- [ ] **Step 4 : Vérifier le health endpoint**

```bash
curl http://localhost:3001/health
```

Résultat attendu : `{"status":"ok"}`

- [ ] **Step 5 : Commit**

```bash
git add docker-compose.yml database/
git commit -m "feat: add docker-compose with 3 services"
```
