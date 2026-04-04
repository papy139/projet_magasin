# Tri Catalogue + Étoiles Produits Phares — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un select de tri dans le catalogue (prix, stock, popularité) et afficher des étoiles + badge "Produit phare" sur les bestsellers.

**Architecture:** Le backend étend `GET /api/products` avec un champ `total_sold` (LEFT JOIN sur order_items). Le frontend utilise ce champ pour trier côté client et calculer les étoiles (0–3) et le badge "Produit phare" (top 3 vendeurs).

**Tech Stack:** Node.js/Express/pg (backend), React/Tailwind (frontend)

---

## Fichiers modifiés

| Fichier | Rôle |
|---------|------|
| `backend/src/controllers/productsController.js` | Ajoute `total_sold` via LEFT JOIN |
| `frontend/src/pages/Catalogue.jsx` | Ajoute select tri + calcul stars/isFeatured |
| `frontend/src/components/ProductCard.jsx` | Affiche étoiles + badge phare |

---

### Task 1 : Backend — ajouter `total_sold` à `getAllProducts`

**Files:**
- Modify: `backend/src/controllers/productsController.js`

- [ ] **Step 1 : Modifier la requête SQL dans `getAllProducts`**

Remplacer le contenu de `getAllProducts` dans `backend/src/controllers/productsController.js` :

```js
async function getAllProducts(req, res, next) {
  try {
    const { search, category } = req.query;
    let query = `
      SELECT p.*, COALESCE(SUM(oi.quantity), 0)::int AS total_sold
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }
    if (category) {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }
    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}
```

- [ ] **Step 2 : Vérifier que le backend démarre sans erreur**

```bash
docker compose up --build backend
```

Expected : `Backend running on port 3001` sans erreur.

- [ ] **Step 3 : Tester l'endpoint avec curl**

```bash
curl -s http://localhost:3001/api/products | jq '.[0] | {id, name, total_sold}'
```

Expected :
```json
{
  "id": 1,
  "name": "Smartphone XZ Pro",
  "total_sold": 0
}
```

Le champ `total_sold` doit être présent (0 si jamais commandé, > 0 sinon).

- [ ] **Step 4 : Commit**

```bash
git add backend/src/controllers/productsController.js
git commit -m "feat: add total_sold field to GET /api/products via order_items join"
```

---

### Task 2 : Frontend — select de tri dans `Catalogue.jsx`

**Files:**
- Modify: `frontend/src/pages/Catalogue.jsx`

- [ ] **Step 1 : Ajouter le state `sortBy` et la logique de tri**

Dans `Catalogue.jsx`, ajouter après les states existants (`search`, `category`, etc.) :

```js
const [sortBy, setSortBy] = useState("newest");
```

Remplacer la ligne `const filteredProducts = products.filter(...)` et tout ce qui suit jusqu'à `const visibleProducts` par :

```js
const filteredProducts = useMemo(() => {
  const filtered = products.filter((product) => {
    const matchesSearch =
      search === "" ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "" || category === "Toutes" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered];
  if (sortBy === "price_asc") sorted.sort((a, b) => Number(a.price) - Number(b.price));
  else if (sortBy === "price_desc") sorted.sort((a, b) => Number(b.price) - Number(a.price));
  else if (sortBy === "stock_desc") sorted.sort((a, b) => Number(b.stock) - Number(a.stock));
  else if (sortBy === "popular") sorted.sort((a, b) => Number(b.total_sold) - Number(a.total_sold));
  // "newest" : ordre API par défaut, pas de re-tri

  return sorted;
}, [products, search, category, sortBy]);
```

Ajouter `useMemo` dans l'import React en haut du fichier :
```js
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
```

- [ ] **Step 2 : Reset visibleCount quand sortBy change**

Dans le `useEffect` qui reset `visibleCount`, ajouter `sortBy` comme dépendance :

```js
useEffect(() => {
  setVisibleCount(PAGE_SIZE);
}, [search, category, sortBy]);
```

- [ ] **Step 3 : Calculer étoiles et produits phares**

Juste avant le `return`, ajouter :

```js
const maxSold = Math.max(...filteredProducts.map((p) => Number(p.total_sold)), 0);
const top3Ids = [...filteredProducts]
  .filter((p) => Number(p.total_sold) > 0)
  .sort((a, b) => Number(b.total_sold) - Number(a.total_sold))
  .slice(0, 3)
  .map((p) => p.id);

const getStars = (product) => {
  if (maxSold === 0 || Number(product.total_sold) === 0) return 0;
  const ratio = Number(product.total_sold) / maxSold;
  if (ratio >= 0.66) return 3;
  if (ratio >= 0.33) return 2;
  return 1;
};
```

- [ ] **Step 4 : Ajouter le select de tri dans la barre de filtres**

La `div` de filtres passe de `grid-cols-1 md:grid-cols-2` à `grid-cols-1 md:grid-cols-3`. Ajouter après le bloc catégorie :

```jsx
<div className="bg-white rounded-lg shadow-md p-6 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Recherche — inchangé */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Rechercher
      </label>
      <input
        type="text"
        placeholder="Nom ou description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Catégorie — inchangé */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Catégorie
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat === "Toutes" ? "" : cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    {/* Tri — nouveau */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Trier par
      </label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">Nouveautés</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix décroissant</option>
        <option value="stock_desc">Stock disponible</option>
        <option value="popular">Les plus achetés</option>
      </select>
    </div>
  </div>
</div>
```

- [ ] **Step 5 : Passer `stars` et `isFeatured` à `ProductCard`**

Dans le rendu de la grille, remplacer :
```jsx
<ProductCard
  key={product.id}
  product={product}
  onAddToCart={handleAddToCart}
/>
```
par :
```jsx
<ProductCard
  key={product.id}
  product={product}
  onAddToCart={handleAddToCart}
  stars={getStars(product)}
  isFeatured={top3Ids.includes(product.id)}
/>
```

- [ ] **Step 6 : Commit**

```bash
git add frontend/src/pages/Catalogue.jsx
git commit -m "feat: add sort select and star/featured computation to Catalogue"
```

---

### Task 3 : Frontend — étoiles et badge dans `ProductCard.jsx`

**Files:**
- Modify: `frontend/src/components/ProductCard.jsx`

- [ ] **Step 1 : Ajouter les props `stars` et `isFeatured`**

Remplacer la signature de la fonction :
```jsx
export default function ProductCard({ product, onAddToCart, stars = 0, isFeatured = false }) {
```

- [ ] **Step 2 : Ajouter badge "Produit phare" sur l'image**

Dans la `div` de l'image (`h-48 bg-gray-300...`), ajouter le badge en position absolue. Remplacer la div image par :

```jsx
<div className="h-48 bg-gray-300 overflow-hidden relative">
  {product.image_url ? (
    <img
      src={product.image_url}
      alt={product.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-gray-300" />
  )}
  {isFeatured && (
    <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow">
      🏆 Produit phare
    </span>
  )}
</div>
```

- [ ] **Step 3 : Ajouter les étoiles sous le nom**

Après la balise `<h3>` du nom du produit, ajouter :

```jsx
{stars > 0 && (
  <div className="flex items-center gap-0.5 mb-2">
    {Array.from({ length: 3 }).map((_, i) => (
      <span
        key={i}
        className={i < stars ? "text-yellow-400" : "text-gray-200"}
      >
        ★
      </span>
    ))}
  </div>
)}
```

- [ ] **Step 4 : Vérifier visuellement**

Ouvrir `http://localhost:5173` :
- Les produits les plus commandés affichent 1, 2 ou 3 étoiles jaunes
- Les 3 plus vendus ont le badge "🏆 Produit phare" en haut à gauche de l'image
- Les produits jamais commandés n'ont pas d'étoiles
- Le select "Trier par" fonctionne (prix ↑/↓, stock, plus achetés, nouveautés)

- [ ] **Step 5 : Commit**

```bash
git add frontend/src/components/ProductCard.jsx
git commit -m "feat: add star rating and featured badge to ProductCard"
```

---

### Task 4 : Push final

- [ ] **Step 1 : Push**

```bash
git push origin main
```
