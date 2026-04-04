# Étape 2 — Base de données Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplir `database/init.sql` avec les 3 tables et des données de test, puis valider que PostgreSQL les crée au démarrage.

**Architecture:** Un seul fichier SQL monté dans `/docker-entrypoint-initdb.d/` — PostgreSQL l'exécute automatiquement à la première initialisation du volume. Tables : `products`, `orders`, `order_items`. ~8 produits en 3 catégories dont un avec stock=0.

**Tech Stack:** PostgreSQL 15, SQL

---

### Task 1 : Écrire database/init.sql

**Files:**
- Modify: `database/init.sql`

- [ ] **Step 1 : Écrire le contenu complet de `database/init.sql`**

```sql
-- Produits
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commandes
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lignes de commande
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

-- Données de test
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
  ('Smartphone XZ Pro', 'Smartphone 6.5 pouces, 128 Go, double caméra', 699.99, 15, 'Électronique', 'https://placehold.co/300x300?text=Smartphone'),
  ('Casque audio Bluetooth', 'Casque sans fil, réduction de bruit active, 30h autonomie', 129.99, 8, 'Électronique', 'https://placehold.co/300x300?text=Casque'),
  ('Tablette 10 pouces', 'Tablette Android, 64 Go, écran Full HD', 349.99, 5, 'Électronique', 'https://placehold.co/300x300?text=Tablette'),
  ('T-shirt coton bio', 'T-shirt 100% coton biologique, lavable à 60°C', 24.99, 50, 'Vêtements', 'https://placehold.co/300x300?text=Tshirt'),
  ('Veste imperméable', 'Veste légère imperméable, capuche amovible', 89.99, 12, 'Vêtements', 'https://placehold.co/300x300?text=Veste'),
  ('Lampe de bureau LED', 'Lampe LED réglable, 3 températures de couleur, port USB', 49.99, 20, 'Maison', 'https://placehold.co/300x300?text=Lampe'),
  ('Coussin décoratif', 'Coussin 45x45 cm, housse lavable, garnissage inclus', 19.99, 0, 'Maison', 'https://placehold.co/300x300?text=Coussin'),
  ('Cafetière à piston', 'French press 1L, verre borosilicate, filtre inox', 34.99, 7, 'Maison', 'https://placehold.co/300x300?text=Cafetiere');
```

Note : `stock=0` sur le coussin pour tester le bouton "Ajouter au panier" désactivé.

- [ ] **Step 2 : Supprimer le volume PostgreSQL existant pour forcer la réinitialisation**

Le volume `pgdata` a déjà été créé à l'étape 1 (vide). PostgreSQL n'exécute `init.sql` qu'à la première initialisation. Il faut supprimer le volume :

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose down -v
```

- [ ] **Step 3 : Rebuilder et démarrer**

```bash
docker compose up --build -d
```

Attendre ~15 secondes que PostgreSQL s'initialise.

- [ ] **Step 4 : Vérifier que les tables existent**

```bash
docker compose exec db psql -U user -d ecommerce -c "\dt"
```

Résultat attendu :
```
          List of relations
 Schema |    Name     | Type  |  Owner
--------+-------------+-------+---------
 public | order_items | table | user
 public | orders      | table | user
 public | products    | table | user
(3 rows)
```

- [ ] **Step 5 : Vérifier les données de test**

```bash
docker compose exec db psql -U user -d ecommerce -c "SELECT id, name, stock, category FROM products;"
```

Résultat attendu : 8 lignes avec les produits insérés, dont `Coussin décoratif` avec stock=0.

- [ ] **Step 6 : Arrêter les conteneurs**

```bash
docker compose down
```

- [ ] **Step 7 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add database/init.sql
git commit -m "feat: add database schema and test data"
```
