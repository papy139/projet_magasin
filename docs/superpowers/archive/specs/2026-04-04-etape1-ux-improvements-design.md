# Design — Étape 1 : Améliorations UX

**Date :** 2026-04-04
**Scope :** Scroll infini catalogue, toasts react-hot-toast, persistance panier localStorage

---

## 1. Scroll infini (Catalogue.jsx)

Tous les produits sont chargés en une seule requête (comportement existant conservé).

- State `visibleCount` initialisé à 12
- `filteredProducts.slice(0, visibleCount)` utilisé pour l'affichage
- `<div ref={sentinelRef}>` placée après la grille, observée par `IntersectionObserver`
- Quand la sentinelle entre dans le viewport → `setVisibleCount(n => n + 12)`
- Reset `visibleCount` à 12 quand `search` ou `category` change
- Si `visibleCount >= filteredProducts.length` : sentinelle non rendue (plus rien à charger)

---

## 2. Toasts (react-hot-toast)

**Installation :** `npm install react-hot-toast` dans `frontend/`

**Intégration :**
- `<Toaster position="bottom-right" />` ajouté dans `App.jsx` (à l'intérieur de `BrowserRouter`)

**Déclenchements :**
| Événement | Toast |
|---|---|
| Clic "Ajouter au panier" (Catalogue) | `toast.success('Ajouté au panier')` |
| Fetch produits échoue (Catalogue) | `toast.error(message)` — remplace l'affichage d'erreur inline |
| Commande confirmée (Commande) | `toast.success('Commande #X confirmée !')` |
| Produit retiré du panier au rechargement (CartContext) | `toast.error('X retiré : rupture de stock')` |

L'affichage d'erreur inline dans Catalogue.jsx est supprimé au profit du toast.

---

## 3. Panier persistant (CartContext.jsx)

**Initialisation :**
```js
const [items, setItems] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
});
```

**Sauvegarde automatique :**
```js
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(items));
}, [items]);
```

**Vérification stock au mount :**
- `useEffect` au mount : appelle `getProducts()`
- Croise avec `items` : pour chaque item dont `product.stock === 0` dans la réponse → retire du panier via `setItems` + déclenche `toast.error('${name} retiré : rupture de stock')`
- Si le fetch échoue : on conserve les items sans vérification (fail silently)

**Note :** `toast` est appelé depuis CartContext, donc `<Toaster>` doit être dans l'arbre React avant CartProvider — il est dans `App.jsx` à l'intérieur de `BrowserRouter` mais en dehors de `CartProvider`. Ajuster l'ordre : `CartProvider` wraps `BrowserRouter`, donc placer `<Toaster>` dans un composant enfant ou directement dans `App.jsx` à la racine.

**Solution :** Déplacer `<Toaster />` dans `main.jsx` ou directement dans `App.jsx` avant `<CartProvider>`, car react-hot-toast fonctionne via un portail indépendant du contexte React — pas besoin d'être dans l'arbre CartProvider.

---

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `frontend/package.json` | Ajout react-hot-toast |
| `frontend/src/App.jsx` | Ajout `<Toaster />` |
| `frontend/src/context/CartContext.jsx` | Persistance localStorage + vérification stock |
| `frontend/src/pages/Catalogue.jsx` | Scroll infini + toast ajout panier + toast erreur |
| `frontend/src/pages/Commande.jsx` | Toast confirmation commande |
