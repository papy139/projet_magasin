# Étape 1 UX Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter scroll infini sur le catalogue, toasts react-hot-toast, et persistance du panier en localStorage avec vérification de stock au rechargement.

**Architecture:** Trois features indépendantes modifiant des fichiers distincts. react-hot-toast est installé une fois et utilisé dans CartContext, Catalogue, et Commande. Le scroll infini est entièrement côté client (slice sur les produits déjà chargés). La persistance panier vit dans CartContext.

**Tech Stack:** React 18, react-hot-toast, IntersectionObserver API, localStorage

---

### Task 1 : Installer react-hot-toast et ajouter le Toaster

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1 : Installer react-hot-toast**

```bash
cd frontend && npm install react-hot-toast
```

Vérifier que `package.json` contient `"react-hot-toast"` dans `dependencies`.

- [ ] **Step 2 : Ajouter le Toaster dans App.jsx**

Remplacer le contenu de `frontend/src/App.jsx` :

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
        <Toaster position="bottom-right" />
        <Navbar />
        <main>
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

- [ ] **Step 3 : Vérifier que l'app compile**

```bash
cd frontend && npm run build 2>&1 | tail -5
```

Résultat attendu : `✓ built in Xs`

- [ ] **Step 4 : Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/App.jsx
git commit -m "feat: install react-hot-toast and add Toaster to App"
```

---

### Task 2 : Persistance panier localStorage + vérification stock

**Files:**
- Modify: `frontend/src/context/CartContext.jsx`

- [ ] **Step 1 : Remplacer CartContext.jsx**

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getProducts } from '../api/products';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Vérification stock au mount
  useEffect(() => {
    const savedItems = (() => {
      try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
      } catch {
        return [];
      }
    })();
    if (savedItems.length === 0) return;

    getProducts()
      .then((products) => {
        setItems((prev) => {
          const updated = prev.filter((item) => {
            const fresh = products.find((p) => p.id === item.product.id);
            if (!fresh || fresh.stock === 0) {
              toast.error(`"${item.product.name}" retiré : rupture de stock`);
              return false;
            }
            return true;
          });
          return updated;
        });
      })
      .catch(() => {
        // Fail silently — on garde les items sans vérification
      });
  }, []);

  const addToCart = (product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const value = {
    items,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
```

- [ ] **Step 2 : Vérifier la compilation**

```bash
cd frontend && npm run build 2>&1 | tail -5
```

Résultat attendu : `✓ built in Xs`

- [ ] **Step 3 : Vérification manuelle**

Lancer l'app (`docker compose up` ou `npm run dev` dans `frontend/`).
1. Ajouter un produit au panier
2. Rafraîchir la page → le produit doit toujours être dans le panier
3. Vérifier dans DevTools → Application → localStorage → clé `cart`

- [ ] **Step 4 : Commit**

```bash
git add frontend/src/context/CartContext.jsx
git commit -m "feat: persist cart in localStorage with stock check on mount"
```

---

### Task 3 : Scroll infini + toasts dans Catalogue

**Files:**
- Modify: `frontend/src/pages/Catalogue.jsx`

- [ ] **Step 1 : Remplacer Catalogue.jsx**

```jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getProducts } from '../api/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const PAGE_SIZE = 12;

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => toast.error(err.message || 'Impossible de charger les produits'))
      .finally(() => setLoading(false));
  }, []);

  // Reset visibleCount quand les filtres changent
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category]);

  const categories = [
    'Toutes',
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      search === '' ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === '' || category === 'Toutes' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // IntersectionObserver pour le scroll infini
  const handleSentinel = useCallback((entries) => {
    if (entries[0].isIntersecting) {
      setVisibleCount((n) => n + PAGE_SIZE);
    }
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(handleSentinel, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, handleSentinel]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`"${product.name}" ajouté au panier`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Catalogue</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <input
                type="text"
                placeholder="Nom ou description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'Toutes' ? '' : cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
            {hasMore && (
              <div ref={sentinelRef} className="h-10 mt-6" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2 : Vérifier la compilation**

```bash
cd frontend && npm run build 2>&1 | tail -5
```

Résultat attendu : `✓ built in Xs`

- [ ] **Step 3 : Vérification manuelle**

1. Ajouter ≥ 13 produits via le dashboard admin
2. Ouvrir le catalogue → vérifier que seulement 12 sont affichés
3. Scroller jusqu'en bas → les 12 suivants doivent apparaître automatiquement
4. Cliquer "Ajouter au panier" → toast vert en bas à droite

- [ ] **Step 4 : Commit**

```bash
git add frontend/src/pages/Catalogue.jsx
git commit -m "feat: add infinite scroll and toast on Catalogue"
```

---

### Task 4 : Toast confirmation commande dans Commande.jsx

**Files:**
- Modify: `frontend/src/pages/Commande.jsx`

- [ ] **Step 1 : Ajouter l'import toast et le déclenchement**

Ajouter `import toast from 'react-hot-toast';` en haut du fichier.

Puis dans `handleSubmit`, après `setOrderConfirmed(response)` :

```js
toast.success(`Commande #${response.id} confirmée !`);
```

Le bloc `handleSubmit` complet doit ressembler à :

```js
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const orderData = {
      customer_name,
      customer_email,
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        unit_price: i.product.price,
      })),
    };

    const response = await createOrder(orderData);
    clearCart();
    const history = JSON.parse(localStorage.getItem('order_history') || '[]');
    history.push({
      id: response.id,
      date: new Date().toISOString(),
      status: response.status || 'pending',
      customer_name,
      customer_email,
    });
    localStorage.setItem('order_history', JSON.stringify(history));
    toast.success(`Commande #${response.id} confirmée !`);
    setOrderConfirmed(response);
  } catch (err) {
    setError(err.message || 'Erreur lors de la création de la commande');
  } finally {
    setLoading(false);
  }
};
```

- [ ] **Step 2 : Vérifier la compilation**

```bash
cd frontend && npm run build 2>&1 | tail -5
```

Résultat attendu : `✓ built in Xs`

- [ ] **Step 3 : Vérification manuelle**

Passer une commande complète → un toast vert "Commande #X confirmée !" doit apparaître en bas à droite.

- [ ] **Step 4 : Commit**

```bash
git add frontend/src/pages/Commande.jsx
git commit -m "feat: add toast on order confirmation"
```
