# Étape 3 — Backend API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter l'API REST complète (produits + commandes) avec auth admin, connexion PostgreSQL et gestion d'erreurs centralisée.

**Architecture:** Séparation stricte routes / controllers / middleware. Le pool PostgreSQL est instancié une seule fois dans `db/pool.js` et importé dans les controllers. Le middleware `errorHandler` est monté en dernier dans `index.js`. L'auth admin vérifie le header `x-admin-key` contre `ADMIN_KEY` du `.env`.

**Tech Stack:** Node.js, Express 4, pg (node-postgres), dotenv

---

### Task 1 : Infrastructure (pool, middleware, index.js)

**Files:**
- Create: `backend/src/db/pool.js`
- Create: `backend/src/middleware/adminAuth.js`
- Create: `backend/src/middleware/errorHandler.js`
- Modify: `backend/src/index.js`

- [ ] **Step 1 : Créer `backend/src/db/pool.js`**

```js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
```

- [ ] **Step 2 : Créer `backend/src/middleware/adminAuth.js`**

```js
function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = adminAuth;
```

- [ ] **Step 3 : Créer `backend/src/middleware/errorHandler.js`**

```js
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
```

- [ ] **Step 4 : Remplacer `backend/src/index.js`**

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes (ajoutées dans les tâches suivantes)
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

Note : les fichiers `routes/products.js` et `routes/orders.js` seront créés dans les tâches 2 et 4. Pour éviter une erreur au démarrage, créer des placeholders vides maintenant :

```bash
mkdir -p /home/papy139/Documents/projet_lorenzo/backend/src/routes
echo "const router = require('express').Router(); module.exports = router;" > /home/papy139/Documents/projet_lorenzo/backend/src/routes/products.js
echo "const router = require('express').Router(); module.exports = router;" > /home/papy139/Documents/projet_lorenzo/backend/src/routes/orders.js
mkdir -p /home/papy139/Documents/projet_lorenzo/backend/src/controllers
```

- [ ] **Step 5 : Valider que le backend démarre**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose up --build -d backend db
sleep 10
docker compose exec backend node -e "require('./src/index.js')" 2>&1 | head -5
docker compose logs backend | tail -5
```

Résultat attendu dans les logs : `Backend running on port 3001`

- [ ] **Step 6 : Arrêter**

```bash
docker compose down
```

- [ ] **Step 7 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add backend/src/
git commit -m "feat: add backend infrastructure (pool, middleware, index)"
```

---

### Task 2 : Routes produits — endpoints publics

**Files:**
- Create: `backend/src/controllers/productsController.js` (fonctions publiques)
- Modify: `backend/src/routes/products.js`

- [ ] **Step 1 : Créer `backend/src/controllers/productsController.js`**

```js
const pool = require('../db/pool');

async function getAllProducts(req, res, next) {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllProducts, getProductById };
```

- [ ] **Step 2 : Remplacer `backend/src/routes/products.js`**

```js
const router = require('express').Router();
const { getAllProducts, getProductById } = require('../controllers/productsController');

router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
```

- [ ] **Step 3 : Valider les endpoints publics**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose up --build -d
sleep 15
docker compose exec backend node -e "
const http = require('http');
http.get('http://localhost:3001/api/products', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', d.substring(0, 100)));
});
"
```

Résultat attendu : `STATUS: 200 BODY: [{"id":1,"name":"Smartphone XZ Pro"...`

- [ ] **Step 4 : Arrêter**

```bash
docker compose down
```

- [ ] **Step 5 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add backend/src/controllers/productsController.js backend/src/routes/products.js
git commit -m "feat: add public product endpoints (GET /api/products, GET /api/products/:id)"
```

---

### Task 3 : Routes produits — endpoints admin

**Files:**
- Modify: `backend/src/controllers/productsController.js`
- Modify: `backend/src/routes/products.js`

- [ ] **Step 1 : Ajouter les fonctions admin dans `backend/src/controllers/productsController.js`**

Ajouter à la fin du fichier (avant `module.exports`) :

```js
async function createProduct(req, res, next) {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ error: 'name et price sont requis' });
    }
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock || 0, category, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { name, description, price, image_url, category } = req.body;
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, image_url=$4, category=$5 WHERE id=$6 RETURNING *',
      [name, description, price, image_url, category, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateStock(req, res, next) {
  try {
    const { stock } = req.body;
    if (stock == null || stock < 0) {
      return res.status(400).json({ error: 'stock doit être un entier >= 0' });
    }
    const result = await pool.query(
      'UPDATE products SET stock=$1 WHERE id=$2 RETURNING *',
      [stock, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    next(err);
  }
}
```

Mettre à jour le `module.exports` :

```js
module.exports = { getAllProducts, getProductById, createProduct, updateProduct, updateStock, deleteProduct };
```

- [ ] **Step 2 : Remplacer `backend/src/routes/products.js`**

```js
const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} = require('../controllers/productsController');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.patch('/:id/stock', adminAuth, updateStock);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
```

- [ ] **Step 3 : Valider les endpoints admin**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose up --build -d
sleep 15

# Test POST sans clé → doit retourner 401
docker compose exec backend node -e "
const http = require('http');
const data = JSON.stringify({name:'Test',price:9.99,stock:5,category:'Test'});
const req = http.request({hostname:'localhost',port:3001,path:'/api/products',method:'POST',headers:{'Content-Type':'application/json','Content-Length':data.length}}, res => {
  let d=''; res.on('data',c=>d+=c); res.on('end',()=>console.log('STATUS:',res.statusCode,'BODY:',d));
});
req.write(data); req.end();
"

# Test POST avec clé admin → doit retourner 201
docker compose exec backend node -e "
const http = require('http');
const data = JSON.stringify({name:'Test produit',price:9.99,stock:5,category:'Test'});
const req = http.request({hostname:'localhost',port:3001,path:'/api/products',method:'POST',headers:{'Content-Type':'application/json','Content-Length':data.length,'x-admin-key':'admin-secret-key'}}, res => {
  let d=''; res.on('data',c=>d+=c); res.on('end',()=>console.log('STATUS:',res.statusCode,'BODY:',d));
});
req.write(data); req.end();
"
```

Résultats attendus : STATUS: 401 puis STATUS: 201

- [ ] **Step 4 : Arrêter**

```bash
docker compose down
```

- [ ] **Step 5 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add backend/src/controllers/productsController.js backend/src/routes/products.js
git commit -m "feat: add admin product endpoints (POST, PUT, PATCH stock, DELETE)"
```

---

### Task 4 : Routes commandes

**Files:**
- Create: `backend/src/controllers/ordersController.js`
- Modify: `backend/src/routes/orders.js`

- [ ] **Step 1 : Créer `backend/src/controllers/ordersController.js`**

```js
const pool = require('../db/pool');

async function createOrder(req, res, next) {
  const { customer_name, customer_email, items } = req.body;

  if (!customer_name || !customer_email || !items || items.length === 0) {
    return res.status(400).json({ error: 'customer_name, customer_email et items sont requis' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Vérifier le stock de chaque produit
    for (const item of items) {
      const result = await client.query('SELECT name, stock FROM products WHERE id=$1', [item.product_id]);
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Produit id=${item.product_id} introuvable` });
      }
      const product = result.rows[0];
      if (product.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Stock insuffisant pour ${product.name}` });
      }
    }

    // Créer la commande
    const orderResult = await client.query(
      'INSERT INTO orders (customer_name, customer_email) VALUES ($1, $2) RETURNING *',
      [customer_name, customer_email]
    );
    const order = orderResult.rows[0];

    // Créer les lignes et décrémenter le stock
    for (const item of items) {
      const productResult = await client.query('SELECT price FROM products WHERE id=$1', [item.product_id]);
      const unit_price = productResult.rows[0].price;

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, unit_price]
      );

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

async function getAllOrders(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price
      )) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getAllOrders };
```

- [ ] **Step 2 : Remplacer `backend/src/routes/orders.js`**

```js
const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const { createOrder, getAllOrders } = require('../controllers/ordersController');

router.post('/', createOrder);
router.get('/', adminAuth, getAllOrders);

module.exports = router;
```

- [ ] **Step 3 : Valider les endpoints commandes**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose up --build -d
sleep 15

# Test POST /api/orders avec produit id=1 (stock=15)
docker compose exec backend node -e "
const http = require('http');
const data = JSON.stringify({customer_name:'Jean Dupont',customer_email:'jean@test.com',items:[{product_id:1,quantity:2}]});
const req = http.request({hostname:'localhost',port:3001,path:'/api/orders',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}}, res => {
  let d=''; res.on('data',c=>d+=c); res.on('end',()=>console.log('STATUS:',res.statusCode,'BODY:',d));
});
req.write(data); req.end();
"

# Vérifier que le stock a diminué
docker compose exec db psql -U user -d ecommerce -c "SELECT id, name, stock FROM products WHERE id=1;"
```

Résultats attendus : STATUS 201 + stock du produit 1 passé de 15 à 13

- [ ] **Step 4 : Test stock insuffisant (produit id=7, stock=0)**

```bash
docker compose exec backend node -e "
const http = require('http');
const data = JSON.stringify({customer_name:'Test',customer_email:'test@test.com',items:[{product_id:7,quantity:1}]});
const req = http.request({hostname:'localhost',port:3001,path:'/api/orders',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}}, res => {
  let d=''; res.on('data',c=>d+=c); res.on('end',()=>console.log('STATUS:',res.statusCode,'BODY:',d));
});
req.write(data); req.end();
"
```

Résultat attendu : STATUS 400 + `{"error":"Stock insuffisant pour Coussin décoratif"}`

- [ ] **Step 5 : Arrêter**

```bash
docker compose down
```

- [ ] **Step 6 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add backend/src/controllers/ordersController.js backend/src/routes/orders.js
git commit -m "feat: add order endpoints (POST /api/orders, GET /api/orders admin)"
```
