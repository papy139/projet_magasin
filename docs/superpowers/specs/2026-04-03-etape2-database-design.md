# Design — Étape 2 : Base de données

**Date :** 2026-04-03
**Scope :** Schéma SQL et données de test dans database/init.sql

---

## Décision d'approche

Option A : tout dans `database/init.sql` — tables + données de test. Pas de fichier séparé de seed.

---

## Tables

### products
```sql
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
```

### orders
```sql
orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
)
```

### order_items
```sql
order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
)
```

Pas de table users — hors scope.

---

## Données de test

~8 produits en 3 catégories :
- **Électronique** : smartphone, casque audio, tablette
- **Vêtements** : t-shirt, veste
- **Maison** : lampe, coussin, cafetière

Un produit avec `stock=0` pour tester le bouton "Ajouter au panier" désactivé.

---

## Critère de validation

`docker compose up --build` → PostgreSQL initialise les tables depuis init.sql → `\dt` dans psql montre les 3 tables.
