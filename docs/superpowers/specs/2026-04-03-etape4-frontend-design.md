# Design — Étape 4 : Frontend

**Date :** 2026-04-03
**Scope :** Application React + Vite avec 6 pages, Context API panier, Tailwind CSS

---

## Stack

- React 18 + Vite 5
- react-router-dom v6
- Tailwind CSS v3
- Context API (panier)
- fetch natif pour les appels API

---

## Structure des fichiers

```
frontend/src/
├── api/
│   ├── products.js
│   └── orders.js
├── context/
│   └── CartContext.jsx
├── components/
│   ├── Navbar.jsx
│   └── ProductCard.jsx
├── pages/
│   ├── Catalogue.jsx
│   ├── Panier.jsx
│   ├── Commande.jsx
│   ├── Historique.jsx
│   ├── AdminLogin.jsx
│   └── AdminDashboard.jsx
└── App.jsx
```

---

## Couche API

`VITE_API_URL` dans `.env` du frontend = `http://localhost:3001`

**`src/api/products.js`**
- `getProducts(search, category)` → GET /api/products
- `getProductById(id)` → GET /api/products/:id
- `createProduct(data, adminKey)` → POST /api/products
- `updateProduct(id, data, adminKey)` → PUT /api/products/:id
- `updateStock(id, stock, adminKey)` → PATCH /api/products/:id/stock
- `deleteProduct(id, adminKey)` → DELETE /api/products/:id

**`src/api/orders.js`**
- `createOrder(data)` → POST /api/orders
- `getOrders(adminKey)` → GET /api/orders

---

## CartContext

State : `items` (tableau `{ product, quantity }`)

Actions :
- `addToCart(product)` — ajoute ou incrémente quantity
- `removeFromCart(productId)` — retire le produit
- `updateQuantity(productId, quantity)` — modifie la quantité
- `clearCart()` — vide le panier
- `total` — calculé (somme price * quantity)
- `itemCount` — nombre total d'articles

---

## Pages

### Catalogue (`/`)
- `useEffect` → `getProducts()` au mount
- Barre de recherche + dropdown catégorie → filtrage côté client
- `ProductCard` pour chaque produit
- Bouton "Ajouter au panier" désactivé si `stock === 0`
- Badge stock visible sur chaque carte

### Panier (`/panier`)
- Lit `CartContext`
- Affiche produits, quantités, sous-totaux, total
- Bouton "Passer la commande" → navigate `/commande`
- Bouton "Vider le panier" → `clearCart()`
- Si panier vide : message + lien vers catalogue

### Commande (`/commande`)
- Redirige vers `/panier` si panier vide
- Formulaire : customer_name + customer_email
- Submit → `createOrder({ customer_name, customer_email, items })`
- Succès → `clearCart()` + affiche confirmation avec order.id
- Erreur → affiche message d'erreur du backend

### Historique (`/historique`)
- Stocke les commandes passées dans `localStorage` (clé `order_history`)
- Chaque commande confirmée est ajoutée à localStorage dans la page Commande
- Historique : liste des commandes avec id, date, statut
- Pas besoin d'email — affiche toutes les commandes du navigateur

### Login Admin (`/admin`)
- Champ texte clé admin
- Submit → `getOrders(key)` pour vérifier la clé
- Si 200 → stocke clé dans `sessionStorage` + navigate `/admin/dashboard`
- Si 401 → affiche "Clé incorrecte"

### Dashboard Admin (`/admin/dashboard`)
- Au mount : vérifie clé en `sessionStorage`, sinon redirect `/admin`
- **Section produits** :
  - Tableau avec tous les produits
  - Bouton "Modifier" → formulaire inline ou modal
  - Bouton "Stock" → input inline pour modifier le stock
  - Bouton "Supprimer" → confirm + `deleteProduct`
  - Formulaire d'ajout produit
- **Section commandes** : tableau de toutes les commandes

---

## Routing (App.jsx)

```
/                  → Catalogue
/panier            → Panier
/commande          → Commande
/historique        → Historique
/admin             → AdminLogin
/admin/dashboard   → AdminDashboard
```

---

## Configuration Tailwind

- `tailwind.config.js` à la racine de `frontend/`
- `postcss.config.js` requis pour Vite + Tailwind
- Import dans `frontend/src/index.css` : `@tailwind base/components/utilities`
- Import de `index.css` dans `main.jsx`

---

## Variables d'environnement frontend

`frontend/.env` :
```
VITE_API_URL=http://localhost:3001
```

`frontend/.env.example` :
```
VITE_API_URL=http://localhost:3001
```
