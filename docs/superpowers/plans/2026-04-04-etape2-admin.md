# Étape 2 Admin — Recherche, Filtres Commandes, Tri Colonnes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une recherche textuelle sur le tableau produits, des filtres (statut/date) sur le tableau commandes, et le tri cliquable sur les colonnes des deux tableaux dans le dashboard admin.

**Architecture:** Deux hooks custom (`useProductFilters`, `useOrderFilters`) extraient la logique de filtrage/tri depuis `AdminDashboard.jsx`. Tout est client-side : les données sont déjà en mémoire après le chargement initial. `AdminDashboard` consomme les hooks et ne gère plus que l'affichage.

**Tech Stack:** React 18, hooks (`useState`, `useMemo`), Tailwind CSS

---

## Fichiers

| Fichier | Action |
|---------|--------|
| `frontend/src/hooks/useProductFilters.js` | Créé — logique filtrage+tri produits |
| `frontend/src/hooks/useOrderFilters.js` | Créé — logique filtrage+tri commandes |
| `frontend/src/pages/AdminDashboard.jsx` | Modifié — consomme les hooks, nouveau JSX search/sort/filters |

---

## Task 1 : Créer `useProductFilters.js`

**Files:**
- Create: `frontend/src/hooks/useProductFilters.js`

- [ ] **Créer le fichier avec le contenu suivant**

```js
// frontend/src/hooks/useProductFilters.js
import { useState, useMemo } from 'react';

export function useProductFilters(products) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // 'all' | 'in' | 'out'
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterStock('all');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setSortKey('');
    setSortDir('asc');
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name?.toLowerCase().includes(q) &&
          !p.category?.toLowerCase().includes(q) &&
          !p.description?.toLowerCase().includes(q)
        ) return false;
      }
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterStock === 'in' && p.stock === 0) return false;
      if (filterStock === 'out' && p.stock > 0) return false;
      if (filterMinPrice !== '' && Number(p.price) < Number(filterMinPrice)) return false;
      if (filterMaxPrice !== '' && Number(p.price) > Number(filterMaxPrice)) return false;
      return true;
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        let av = a[sortKey];
        let bv = b[sortKey];
        if (sortKey === 'price' || sortKey === 'stock') {
          av = Number(av);
          bv = Number(bv);
        } else {
          av = String(av ?? '').toLowerCase();
          bv = String(bv ?? '').toLowerCase();
        }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, search, filterCategory, filterStock, filterMinPrice, filterMaxPrice, sortKey, sortDir]);

  return {
    search, setSearch,
    filterCategory, setFilterCategory,
    filterStock, setFilterStock,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
    sortKey, sortDir, toggleSort,
    resetFilters,
    filtered,
  };
}
```

- [ ] **Commit**

```bash
git add frontend/src/hooks/useProductFilters.js
git commit -m "feat: add useProductFilters hook with search, filters and sort"
```

---

## Task 2 : Créer `useOrderFilters.js`

**Files:**
- Create: `frontend/src/hooks/useOrderFilters.js`

- [ ] **Créer le fichier avec le contenu suivant**

```js
// frontend/src/hooks/useOrderFilters.js
import { useState, useMemo } from 'react';

export function useOrderFilters(orders) {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'confirmed'
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc'); // commandes récentes en premier par défaut

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSortKey('created_at');
    setSortDir('desc');
  };

  const filtered = useMemo(() => {
    let result = orders.filter((o) => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (filterDateFrom) {
        if (new Date(o.created_at) < new Date(filterDateFrom)) return false;
      }
      if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(o.created_at) > to) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === 'id') {
        av = Number(av);
        bv = Number(bv);
      } else if (sortKey === 'created_at') {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else {
        av = String(av ?? '').toLowerCase();
        bv = String(bv ?? '').toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, filterStatus, filterDateFrom, filterDateTo, sortKey, sortDir]);

  return {
    filterStatus, setFilterStatus,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortKey, sortDir, toggleSort,
    resetFilters,
    filtered,
  };
}
```

- [ ] **Commit**

```bash
git add frontend/src/hooks/useOrderFilters.js
git commit -m "feat: add useOrderFilters hook with status/date filters and sort"
```

---

## Task 3 : Migrer la section Produits dans AdminDashboard

**Files:**
- Modify: `frontend/src/pages/AdminDashboard.jsx`

Cette tâche :
1. Ajoute les imports des deux hooks et de `useMemo`
2. Supprime les 4 états de filtres inline existants
3. Remplace le bloc IIFE dans le JSX par du JSX direct utilisant `filteredProducts`
4. Ajoute le champ de recherche texte
5. Rend les en-têtes du tableau produits cliquables

- [ ] **Modifier la ligne d'import React (ligne 1) pour ajouter `useMemo`**

Remplacer :
```js
import { Fragment, useEffect, useState } from 'react';
```
Par :
```js
import { Fragment, useEffect, useMemo, useState } from 'react';
```

- [ ] **Ajouter les imports des hooks après les imports existants (après ligne 10, avant `const EMPTY_FORM`)**

```js
import { useProductFilters } from '../hooks/useProductFilters';
import { useOrderFilters } from '../hooks/useOrderFilters';
```

- [ ] **Supprimer le bloc des 4 états de filtres produits (lignes 43-46)**

Supprimer ces 4 lignes :
```js
  // Filtres produits
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // all | in | out
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
```

- [ ] **Ajouter les appels aux hooks et le memo `categories` après la déclaration `newLoading` (ligne 51, avant le useEffect)**

```js
  const {
    search, setSearch,
    filterCategory, setFilterCategory,
    filterStock, setFilterStock,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
    sortKey: productSortKey,
    sortDir: productSortDir,
    toggleSort: toggleProductSort,
    resetFilters: resetProductFilters,
    filtered: filteredProducts,
  } = useProductFilters(products);

  const {
    filterStatus, setFilterStatus,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortKey: orderSortKey,
    sortDir: orderSortDir,
    toggleSort: toggleOrderSort,
    resetFilters: resetOrderFilters,
    filtered: filteredOrders,
  } = useOrderFilters(orders);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );
```

- [ ] **Remplacer entièrement le contenu de `<section>` produits**

Remplacer le bloc IIFE entier (de `{(() => {` jusqu'à `})()}`) par le JSX suivant. Le formulaire d'ajout de produit à la fin de la section reste **inchangé** — seul l'en-tête + tableau changent :

```jsx
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Produits ({filteredProducts.length}/{products.length})
            </h2>
            <input
              type="text"
              placeholder="Rechercher par nom, catégorie, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-48"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">Tout le stock</option>
              <option value="in">En stock</option>
              <option value="out">Rupture</option>
            </select>
            <input
              type="number"
              placeholder="Prix min"
              value={filterMinPrice}
              onChange={(e) => setFilterMinPrice(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
            />
            <input
              type="number"
              placeholder="Prix max"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
            />
            {(search || filterCategory || filterStock !== 'all' || filterMinPrice || filterMaxPrice) && (
              <button
                onClick={resetProductFilters}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Tableau produits */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th
                    onClick={() => toggleProductSort('name')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Nom {productSortKey === 'name' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() => toggleProductSort('category')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Catégorie {productSortKey === 'category' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() => toggleProductSort('price')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Prix {productSortKey === 'price' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() => toggleProductSort('stock')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Stock {productSortKey === 'stock' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">Aucun produit</td>
                  </tr>
                )}
                {filteredProducts.map((product) => (
```

Le reste du `map` (les `<Fragment key={product.id}>` avec la ligne produit et le formulaire d'édition inline) reste **identique**, seul `filtered.map` devient `filteredProducts.map`.

- [ ] **Vérification** : ouvrir le dashboard admin dans le navigateur. Taper dans le champ de recherche → le tableau se filtre. Cliquer sur les en-têtes → les flèches apparaissent et le tableau se trie.

- [ ] **Commit**

```bash
git add frontend/src/pages/AdminDashboard.jsx
git commit -m "feat: migrate products section to useProductFilters hook with search and sort"
```

---

## Task 4 : Migrer la section Commandes dans AdminDashboard

**Files:**
- Modify: `frontend/src/pages/AdminDashboard.jsx`

Les appels aux hooks (`useOrderFilters`) sont déjà en place depuis Task 3. Cette tâche modifie uniquement le JSX de la section commandes.

- [ ] **Remplacer l'en-tête de la section commandes**

Remplacer :
```jsx
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes ({orders.length})</h2>
```
Par :
```jsx
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Commandes ({filteredOrders.length}/{orders.length})
            </h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
            </select>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
            {(filterStatus !== 'all' || filterDateFrom || filterDateTo) && (
              <button
                onClick={resetOrderFilters}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Réinitialiser
              </button>
            )}
          </div>
```

- [ ] **Remplacer les en-têtes du tableau commandes par des en-têtes cliquables**

Remplacer :
```jsx
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
```
Par :
```jsx
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th
                    onClick={() => toggleOrderSort('id')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    ID {orderSortKey === 'id' ? (orderSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th
                    onClick={() => toggleOrderSort('status')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Statut {orderSortKey === 'status' ? (orderSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() => toggleOrderSort('created_at')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Date {orderSortKey === 'created_at' ? (orderSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                </tr>
              </thead>
```

- [ ] **Remplacer `orders.map` par `filteredOrders.map` dans le tbody**

Remplacer :
```jsx
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">Aucune commande</td>
                  </tr>
                )}
                {orders.map((order) => (
```
Par :
```jsx
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">Aucune commande</td>
                  </tr>
                )}
                {filteredOrders.map((order) => (
```

- [ ] **Vérification** : dans le dashboard admin, section commandes — le select statut filtre les commandes, les inputs date filtrent par plage, cliquer sur ID/Statut/Date trie le tableau. La date descend par défaut (commande la plus récente en tête).

- [ ] **Commit final**

```bash
git add frontend/src/pages/AdminDashboard.jsx
git commit -m "feat: add order filters and sortable columns to admin dashboard"
```
