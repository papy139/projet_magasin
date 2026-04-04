# Étape 4 — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire l'interface React complète avec 6 pages, Context API panier, Tailwind CSS et appels vers le backend Express.

**Architecture:** React Router v6 pour la navigation, CartContext global pour le panier, couche `api/` pour tous les appels fetch. Tailwind CSS pour le style. Les commandes passées sont stockées dans `localStorage` pour l'historique.

**Tech Stack:** React 18, Vite 5, react-router-dom v6, Tailwind CSS v3, fetch natif

---

### Task 1 : Setup (Tailwind, Router, .env, App.jsx, Navbar)

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/.env`
- Create: `frontend/.env.example`
- Create: `frontend/src/index.css`
- Modify: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1 : Mettre à jour `frontend/package.json`**

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
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2 : Créer `frontend/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 3 : Créer `frontend/postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4 : Créer `frontend/.env`**

```
VITE_API_URL=http://localhost:3001
```

- [ ] **Step 5 : Créer `frontend/.env.example`**

```
VITE_API_URL=http://localhost:3001
```

- [ ] **Step 6 : Remplacer `frontend/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 7 : Remplacer `frontend/src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 8 : Créer `frontend/src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import Catalogue from './pages/Catalogue';
import Panier from './pages/Panier';
import Commande from './pages/Commande';
import Historique from './pages/Historique';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Catalogue />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/commande" element={<Commande />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}
```

- [ ] **Step 9 : Créer `frontend/src/components/Navbar.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center gap-6">
      <Link to="/" className="font-bold text-lg">E-commerce</Link>
      <Link to="/" className="hover:underline">Catalogue</Link>
      <Link to="/historique" className="hover:underline">Mes commandes</Link>
      <Link to="/admin" className="hover:underline">Admin</Link>
      <Link to="/panier" className="ml-auto hover:underline">
        Panier {itemCount > 0 && <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-sm font-bold ml-1">{itemCount}</span>}
      </Link>
    </nav>
  );
}
```

Note : `CartContext` et les pages sont créés dans les tâches suivantes. Pour éviter les erreurs d'import lors du build intermédiaire, créer des placeholders pour les fichiers manquants :

```bash
mkdir -p /home/papy139/Documents/projet_lorenzo/frontend/src/context
mkdir -p /home/papy139/Documents/projet_lorenzo/frontend/src/pages

cat > /home/papy139/Documents/projet_lorenzo/frontend/src/context/CartContext.jsx << 'EOF'
import { createContext, useContext, useState } from 'react';
const CartContext = createContext();
export function CartProvider({ children }) {
  return <CartContext.Provider value={{ items: [], itemCount: 0, total: 0, addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {} }}>{children}</CartContext.Provider>;
}
export function useCart() { return useContext(CartContext); }
EOF

for page in Catalogue Panier Commande Historique AdminLogin AdminDashboard; do
  echo "export default function $page() { return <div>$page</div>; }" > /home/papy139/Documents/projet_lorenzo/frontend/src/pages/$page.jsx
done
```

- [ ] **Step 10 : Valider le démarrage**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose up --build -d frontend
sleep 20
docker compose logs frontend | tail -10
docker compose down
```

Résultat attendu dans les logs : `VITE v5.x  ready in ...ms` et `➜  Local: http://localhost:5173/`

- [ ] **Step 11 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/
git commit -m "feat: setup frontend (tailwind, router, navbar, app structure)"
```

---

### Task 2 : Couche API

**Files:**
- Create: `frontend/src/api/products.js`
- Create: `frontend/src/api/orders.js`

- [ ] **Step 1 : Créer `frontend/src/api/products.js`**

```js
const BASE = import.meta.env.VITE_API_URL;

export async function getProducts(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  const res = await fetch(`${BASE}/api/products?${params}`);
  if (!res.ok) throw new Error('Erreur chargement produits');
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${BASE}/api/products/${id}`);
  if (!res.ok) throw new Error('Produit introuvable');
  return res.json();
}

export async function createProduct(data, adminKey) {
  const res = await fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function updateProduct(id, data, adminKey) {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function updateStock(id, stock, adminKey) {
  const res = await fetch(`${BASE}/api/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ stock }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function deleteProduct(id, adminKey) {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}
```

- [ ] **Step 2 : Créer `frontend/src/api/orders.js`**

```js
const BASE = import.meta.env.VITE_API_URL;

export async function createOrder(data) {
  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function getOrders(adminKey) {
  const res = await fetch(`${BASE}/api/orders`, {
    headers: { 'x-admin-key': adminKey },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}
```

- [ ] **Step 3 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/api/
git commit -m "feat: add frontend API layer (products, orders)"
```

---

### Task 3 : CartContext

**Files:**
- Modify: `frontend/src/context/CartContext.jsx`

- [ ] **Step 1 : Remplacer `frontend/src/context/CartContext.jsx`**

```jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(product) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
```

- [ ] **Step 2 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/context/CartContext.jsx
git commit -m "feat: add CartContext (add, remove, updateQuantity, clearCart)"
```

---

### Task 4 : Page Catalogue + ProductCard

**Files:**
- Create: `frontend/src/components/ProductCard.jsx`
- Modify: `frontend/src/pages/Catalogue.jsx`

- [ ] **Step 1 : Créer `frontend/src/components/ProductCard.jsx`**

```jsx
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock === 0;

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
      {product.image_url && (
        <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded" />
      )}
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-500 text-sm flex-1">{product.description}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold text-blue-600">{parseFloat(product.price).toFixed(2)} €</span>
        <span className={`text-sm ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
          {outOfStock ? 'Rupture de stock' : `Stock : ${product.stock}`}
        </span>
      </div>
      <button
        onClick={() => addToCart(product)}
        disabled={outOfStock}
        className="mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Ajouter au panier
      </button>
    </div>
  );
}
```

- [ ] **Step 2 : Remplacer `frontend/src/pages/Catalogue.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Toutes', 'Électronique', 'Vêtements', 'Maison'];

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catalogue</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value === 'Toutes' ? '' : e.target.value)}
          className="border rounded px-3 py-2"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {!loading && filtered.length === 0 && <p className="text-gray-500">Aucun produit trouvé.</p>}
    </div>
  );
}
```

- [ ] **Step 3 : Valider dans Docker**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose up --build -d
sleep 20
docker compose logs frontend | grep -E "ready|error|Error" | tail -5
docker compose down
```

Résultat attendu : `VITE v5.x  ready` sans erreur.

- [ ] **Step 4 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/components/ProductCard.jsx frontend/src/pages/Catalogue.jsx
git commit -m "feat: add Catalogue page and ProductCard component"
```

---

### Task 5 : Page Panier

**Files:**
- Modify: `frontend/src/pages/Panier.jsx`

- [ ] **Step 1 : Remplacer `frontend/src/pages/Panier.jsx`**

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Panier() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Votre panier est vide.</p>
        <Link to="/" className="text-blue-600 hover:underline">Retour au catalogue</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panier</h1>
      <div className="flex flex-col gap-4 mb-6">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 border rounded p-4">
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-500 text-sm">{parseFloat(product.price).toFixed(2)} € / unité</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1 border rounded">-</button>
              <span className="w-8 text-center">{quantity}</span>
              <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
            <p className="w-24 text-right font-bold">{(product.price * quantity).toFixed(2)} €</p>
            <button onClick={() => removeFromCart(product.id)} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-4">
        <button onClick={clearCart} className="text-gray-500 hover:text-red-500">Vider le panier</button>
        <div className="flex items-center gap-6">
          <p className="text-xl font-bold">Total : {total.toFixed(2)} €</p>
          <button
            onClick={() => navigate('/commande')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Passer la commande
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/pages/Panier.jsx
git commit -m "feat: add Panier page"
```

---

### Task 6 : Page Commande

**Files:**
- Modify: `frontend/src/pages/Commande.jsx`

- [ ] **Step 1 : Remplacer `frontend/src/pages/Commande.jsx`**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';

export default function Commande() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: '', customer_email: '' });
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  if (items.length === 0 && !confirmation) {
    navigate('/panier');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const order = await createOrder({
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      });

      // Sauvegarder dans localStorage pour l'historique
      const history = JSON.parse(localStorage.getItem('order_history') || '[]');
      history.unshift({ ...order, items: items.map(i => ({ name: i.product.name, quantity: i.quantity, unit_price: i.product.price })) });
      localStorage.setItem('order_history', JSON.stringify(history));

      clearCart();
      setConfirmation(order);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (confirmation) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Commande confirmée !</h2>
        <p className="text-gray-600 mb-2">Numéro de commande : <strong>#{confirmation.id}</strong></p>
        <p className="text-gray-600 mb-6">Statut : {confirmation.status}</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Passer la commande</h1>
      <div className="bg-gray-50 rounded p-4 mb-6">
        <p className="font-semibold mb-2">{items.length} article(s) — Total : {total.toFixed(2)} €</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <input
            type="text"
            required
            value={form.customer_name}
            onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={form.customer_email}
            onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? 'Envoi...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/pages/Commande.jsx
git commit -m "feat: add Commande page with localStorage history"
```

---

### Task 7 : Page Historique

**Files:**
- Modify: `frontend/src/pages/Historique.jsx`

- [ ] **Step 1 : Remplacer `frontend/src/pages/Historique.jsx`**

```jsx
import { useState, useEffect } from 'react';

export default function Historique() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('order_history') || '[]');
    setOrders(history);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Aucune commande passée depuis ce navigateur.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>
      <div className="flex flex-col gap-6">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Commande #{order.id}</h3>
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{order.status}</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {(order.items || []).map((item, i) => (
                <li key={i}>• {item.name} × {item.quantity} — {(item.unit_price * item.quantity).toFixed(2)} €</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/pages/Historique.jsx
git commit -m "feat: add Historique page (localStorage)"
```

---

### Task 8 : Page AdminLogin

**Files:**
- Modify: `frontend/src/pages/AdminLogin.jsx`

- [ ] **Step 1 : Remplacer `frontend/src/pages/AdminLogin.jsx`**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../api/orders';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await getOrders(key);
      sessionStorage.setItem('admin_key', key);
      navigate('/admin/dashboard');
    } catch {
      setError('Clé incorrecte');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Accès Admin</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Clé admin</label>
          <input
            type="password"
            required
            value={key}
            onChange={e => setKey(e.target.value)}
            className="border rounded w-full px-3 py-2"
            placeholder="Entrez la clé admin"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? 'Vérification...' : 'Connexion'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/pages/AdminLogin.jsx
git commit -m "feat: add AdminLogin page"
```

---

### Task 9 : Page AdminDashboard

**Files:**
- Modify: `frontend/src/pages/AdminDashboard.jsx`

- [ ] **Step 1 : Remplacer `frontend/src/pages/AdminDashboard.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, updateStock, deleteProduct } from '../api/products';
import { getOrders } from '../api/orders';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminKey = sessionStorage.getItem('admin_key');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [stockEdits, setStockEdits] = useState({});
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '', image_url: '' });

  useEffect(() => {
    if (!adminKey) { navigate('/admin'); return; }
    loadData();
  }, []);

  async function loadData() {
    try {
      const [prods, ords] = await Promise.all([getProducts(), getOrders(adminKey)]);
      setProducts(prods);
      setOrders(ords);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await deleteProduct(id, adminKey);
      setProducts(p => p.filter(x => x.id !== id));
    } catch (e) { setError(e.message); }
  }

  async function handleStockSave(id) {
    try {
      const updated = await updateStock(id, parseInt(stockEdits[id]), adminKey);
      setProducts(p => p.map(x => x.id === id ? updated : x));
      setStockEdits(s => { const n = { ...s }; delete n[id]; return n; });
    } catch (e) { setError(e.message); }
  }

  async function handleEditSave(id) {
    try {
      const updated = await updateProduct(id, editForm, adminKey);
      setProducts(p => p.map(x => x.id === id ? updated : x));
      setEditingId(null);
    } catch (e) { setError(e.message); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const created = await createProduct({ ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0 }, adminKey);
      setProducts(p => [created, ...p]);
      setNewProduct({ name: '', description: '', price: '', stock: '', category: '', image_url: '' });
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button onClick={() => { sessionStorage.removeItem('admin_key'); navigate('/admin'); }} className="text-sm text-gray-500 hover:text-red-500">Déconnexion</button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Ajout produit */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Ajouter un produit</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
          <input required placeholder="Nom *" value={newProduct.name} onChange={e => setNewProduct(f => ({ ...f, name: e.target.value }))} className="border rounded px-3 py-2" />
          <input required type="number" step="0.01" placeholder="Prix * (€)" value={newProduct.price} onChange={e => setNewProduct(f => ({ ...f, price: e.target.value }))} className="border rounded px-3 py-2" />
          <input placeholder="Catégorie" value={newProduct.category} onChange={e => setNewProduct(f => ({ ...f, category: e.target.value }))} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct(f => ({ ...f, stock: e.target.value }))} className="border rounded px-3 py-2" />
          <input placeholder="URL image" value={newProduct.image_url} onChange={e => setNewProduct(f => ({ ...f, image_url: e.target.value }))} className="border rounded px-3 py-2 col-span-2" />
          <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(f => ({ ...f, description: e.target.value }))} className="border rounded px-3 py-2 col-span-2" rows={2} />
          <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">Ajouter</button>
        </form>
      </section>

      {/* Liste produits */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Produits ({products.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">Nom</th>
                <th className="text-left p-2 border">Catégorie</th>
                <th className="text-left p-2 border">Prix</th>
                <th className="text-left p-2 border">Stock</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b">
                  {editingId === p.id ? (
                    <>
                      <td className="p-2 border" colSpan={4}>
                        <div className="grid grid-cols-2 gap-2">
                          <input value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="border rounded px-2 py-1" placeholder="Nom" />
                          <input type="number" step="0.01" value={editForm.price || ''} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} className="border rounded px-2 py-1" placeholder="Prix" />
                          <input value={editForm.category || ''} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="border rounded px-2 py-1" placeholder="Catégorie" />
                          <input value={editForm.image_url || ''} onChange={e => setEditForm(f => ({ ...f, image_url: e.target.value }))} className="border rounded px-2 py-1" placeholder="URL image" />
                          <textarea value={editForm.description || ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="border rounded px-2 py-1 col-span-2" placeholder="Description" rows={2} />
                        </div>
                      </td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditSave(p.id)} className="text-green-600 hover:underline">Sauver</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">Annuler</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 border">{p.name}</td>
                      <td className="p-2 border">{p.category}</td>
                      <td className="p-2 border">{parseFloat(p.price).toFixed(2)} €</td>
                      <td className="p-2 border">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={stockEdits[p.id] !== undefined ? stockEdits[p.id] : p.stock}
                            onChange={e => setStockEdits(s => ({ ...s, [p.id]: e.target.value }))}
                            className="border rounded px-1 py-0.5 w-16 text-center"
                            min="0"
                          />
                          {stockEdits[p.id] !== undefined && (
                            <button onClick={() => handleStockSave(p.id)} className="text-blue-600 text-xs hover:underline">OK</button>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingId(p.id); setEditForm({ name: p.name, description: p.description, price: p.price, image_url: p.image_url, category: p.category }); }} className="text-blue-600 hover:underline">Modifier</button>
                          <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Supprimer</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Liste commandes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Commandes ({orders.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">#</th>
                <th className="text-left p-2 border">Client</th>
                <th className="text-left p-2 border">Email</th>
                <th className="text-left p-2 border">Statut</th>
                <th className="text-left p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b">
                  <td className="p-2 border">{o.id}</td>
                  <td className="p-2 border">{o.customer_name}</td>
                  <td className="p-2 border">{o.customer_email}</td>
                  <td className="p-2 border"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{o.status}</span></td>
                  <td className="p-2 border">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2 : Valider le build complet**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose up --build -d
sleep 25
docker compose logs frontend | grep -E "ready|error|Error|warn" | tail -10
docker compose down
```

Résultat attendu : `VITE v5.x  ready` sans erreur critique.

- [ ] **Step 3 : Commit + push**

```bash
cd /home/papy139/Documents/projet_lorenzo
git add frontend/src/pages/AdminDashboard.jsx
git commit -m "feat: add AdminDashboard page (CRUD produits, gestion stocks, commandes)"
git push origin main
```
