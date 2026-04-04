# Design — Étape 3 Polish : 404, title par route, skeleton loader

**Date :** 2026-04-04  
**Scope :** `frontend/src/` uniquement — aucune modification backend  

---

## 1. Hook `usePageTitle`

**Fichier créé :** `frontend/src/hooks/usePageTitle.js`

```js
import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | Super Boutique`;
  }, [title]);
}
```

**Intégration :** appelé en première ligne de chaque page.

| Page | Appel |
|------|-------|
| Catalogue | `usePageTitle('Catalogue')` |
| Panier | `usePageTitle('Panier')` |
| Commande | `usePageTitle('Commande')` |
| Historique | `usePageTitle('Historique')` |
| AdminLogin | `usePageTitle('Admin')` |
| AdminDashboard | `usePageTitle('Dashboard Admin')` |
| NotFound | `usePageTitle('404')` |

**`index.html`** : `<title>Super Boutique</title>` conservé comme valeur par défaut avant le premier rendu React.

---

## 2. Page 404

**Fichier créé :** `frontend/src/pages/NotFound.jsx`

Contenu :
- `usePageTitle('404')`
- Grand "404" stylisé (texte gros, gras, couleur indigo)
- Emoji 🔍
- Titre : "Page introuvable"
- Sous-titre : "L'adresse que vous cherchez n'existe pas."
- Bouton "Retour à l'accueil" → `useNavigate` vers `/`

**`App.jsx`** : ajout d'une route catch-all en dernière position dans `<Routes>` :
```jsx
<Route path="*" element={<NotFound />} />
```

---

## 3. Skeleton loader catalogue

**Fichier créé :** `frontend/src/components/SkeletonCard.jsx`

Reproduit la forme d'une `ProductCard` avec Tailwind `animate-pulse` :
- Rectangle image : `h-48 bg-gray-200 rounded-t-xl`
- Ligne nom : `h-4 bg-gray-200 rounded w-3/4`
- Ligne prix : `h-4 bg-gray-200 rounded w-1/4`
- Bouton fantôme : `h-9 bg-gray-200 rounded`

**`Catalogue.jsx`** :
- Quand `loading === true` : grille de 12 `<SkeletonCard />` à la place de la grille produits
- Quand `loading === false` : comportement actuel inchangé

---

## Fichiers créés / modifiés

| Fichier | Action |
|---------|--------|
| `frontend/src/hooks/usePageTitle.js` | Créé |
| `frontend/src/pages/NotFound.jsx` | Créé |
| `frontend/src/components/SkeletonCard.jsx` | Créé |
| `frontend/index.html` | Modifié — title par défaut "Super Boutique" |
| `frontend/src/App.jsx` | Modifié — import NotFound + route `path="*"` |
| `frontend/src/pages/Catalogue.jsx` | Modifié — skeleton pendant loading |
| `frontend/src/pages/Panier.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/Commande.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/Historique.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/AdminLogin.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/AdminDashboard.jsx` | Modifié — usePageTitle |
