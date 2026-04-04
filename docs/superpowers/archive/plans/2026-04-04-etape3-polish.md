# Étape 3 Polish — 404, Title par route, Skeleton loader

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une page 404, des titres dynamiques par route, et un skeleton loader sur le catalogue.

**Architecture:** Trois ajouts indépendants, tous client-side. Un hook `usePageTitle` réutilisable, un composant `NotFound`, un composant `SkeletonCard`. Aucune modification backend, aucune dépendance npm supplémentaire.

**Tech Stack:** React 18, React Router v6, Tailwind CSS

---

## Fichiers

| Fichier | Action |
|---------|--------|
| `frontend/src/hooks/usePageTitle.js` | Créé |
| `frontend/src/pages/NotFound.jsx` | Créé |
| `frontend/src/components/SkeletonCard.jsx` | Créé |
| `frontend/index.html` | Modifié — `<title>Super Boutique</title>` |
| `frontend/src/App.jsx` | Modifié — import NotFound + route `path="*"` |
| `frontend/src/pages/Catalogue.jsx` | Modifié — usePageTitle + skeleton |
| `frontend/src/pages/Panier.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/Commande.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/Historique.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/AdminLogin.jsx` | Modifié — usePageTitle |
| `frontend/src/pages/AdminDashboard.jsx` | Modifié — usePageTitle |

---

## Task 1 : Créer `usePageTitle.js`

**Files:**
- Create: `frontend/src/hooks/usePageTitle.js`

- [ ] **Créer le fichier**

```js
// frontend/src/hooks/usePageTitle.js
import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | Super Boutique`;
  }, [title]);
}
```

- [ ] **Mettre à jour `index.html` — title par défaut**

Remplacer :
```html
<title>E-commerce</title>
```
Par :
```html
<title>Super Boutique</title>
```

- [ ] **Commit**

```bash
git add frontend/src/hooks/usePageTitle.js frontend/index.html
git commit -m "feat: add usePageTitle hook and set default title"
```

---

## Task 2 : Créer la page 404

**Files:**
- Create: `frontend/src/pages/NotFound.jsx`
- Modify: `frontend/src/App.jsx`

- [ ] **Créer `NotFound.jsx`**

```jsx
// frontend/src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('404');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <p className="text-9xl font-extrabold text-indigo-600 leading-none">404</p>
      <p className="text-5xl mt-4">🔍</p>
      <h1 className="text-2xl font-bold text-gray-800 mt-6">Page introuvable</h1>
      <p className="text-gray-500 mt-2">L'adresse que vous cherchez n'existe pas.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
```

- [ ] **Modifier `App.jsx` — ajouter l'import et la route catch-all**

Ajouter l'import après les imports existants de pages :
```js
import NotFound from './pages/NotFound';
```

Ajouter en dernière position dans `<Routes>` (après la route `/admin/dashboard`) :
```jsx
<Route path="*" element={<NotFound />} />
```

- [ ] **Vérification** : naviguer vers `/n-existe-pas` dans le navigateur → page 404 s'affiche, titre de l'onglet = "404 | Super Boutique", bouton ramène à `/`.

- [ ] **Commit**

```bash
git add frontend/src/pages/NotFound.jsx frontend/src/App.jsx
git commit -m "feat: add 404 NotFound page with route catch-all"
```

---

## Task 3 : Créer `SkeletonCard.jsx`

**Files:**
- Create: `frontend/src/components/SkeletonCard.jsx`

Le composant reproduit la structure d'une `ProductCard` (image h-48, nom, description, prix/badge, bouton) avec des blocs gris animés.

- [ ] **Créer le fichier**

```jsx
// frontend/src/components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-48 bg-gray-200" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Nom */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        {/* Description — 2 lignes */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        {/* Prix + badge */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-1/4" />
        </div>
        {/* Bouton */}
        <div className="h-9 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add frontend/src/components/SkeletonCard.jsx
git commit -m "feat: add SkeletonCard component for catalogue loading state"
```

---

## Task 4 : Intégrer le skeleton et usePageTitle dans Catalogue

**Files:**
- Modify: `frontend/src/pages/Catalogue.jsx`

- [ ] **Ajouter l'import de `usePageTitle` et `SkeletonCard`**

Après les imports existants, ajouter :
```js
import { usePageTitle } from '../hooks/usePageTitle';
import SkeletonCard from '../components/SkeletonCard';
```

- [ ] **Ajouter l'appel `usePageTitle` en première ligne du composant**

Ajouter comme première ligne dans le corps du composant `Catalogue()` (avant les useState) :
```js
usePageTitle('Catalogue');
```

- [ ] **Remplacer le bloc `if (loading)` par la grille skeleton**

Remplacer :
```jsx
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );
  }
```
Par :
```jsx
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Catalogue</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
```

- [ ] **Vérification** : recharger le catalogue, ralentir le réseau dans DevTools (Network → Slow 3G) → les 12 cartes grises animées apparaissent, puis les vraies cartes. Titre onglet = "Catalogue | Super Boutique".

- [ ] **Commit**

```bash
git add frontend/src/pages/Catalogue.jsx
git commit -m "feat: add skeleton loader and page title to Catalogue"
```

---

## Task 5 : Ajouter `usePageTitle` aux autres pages

**Files:**
- Modify: `frontend/src/pages/Panier.jsx`
- Modify: `frontend/src/pages/Commande.jsx`
- Modify: `frontend/src/pages/Historique.jsx`
- Modify: `frontend/src/pages/AdminLogin.jsx`
- Modify: `frontend/src/pages/AdminDashboard.jsx`

Pour chaque fichier : ajouter l'import du hook puis l'appel en première ligne du composant.

- [ ] **`Panier.jsx`** — ajouter :
```js
import { usePageTitle } from '../hooks/usePageTitle';
// puis dans le composant :
usePageTitle('Panier');
```

- [ ] **`Commande.jsx`** — ajouter :
```js
import { usePageTitle } from '../hooks/usePageTitle';
// puis dans le composant :
usePageTitle('Commande');
```

- [ ] **`Historique.jsx`** — ajouter :
```js
import { usePageTitle } from '../hooks/usePageTitle';
// puis dans le composant :
usePageTitle('Historique');
```

- [ ] **`AdminLogin.jsx`** — ajouter :
```js
import { usePageTitle } from '../hooks/usePageTitle';
// puis dans le composant :
usePageTitle('Admin');
```

- [ ] **`AdminDashboard.jsx`** — ajouter :
```js
import { usePageTitle } from '../hooks/usePageTitle';
// puis dans le composant :
usePageTitle('Dashboard Admin');
```

- [ ] **Vérification** : naviguer entre chaque page et vérifier que le titre de l'onglet change correctement.

- [ ] **Commit**

```bash
git add frontend/src/pages/Panier.jsx frontend/src/pages/Commande.jsx frontend/src/pages/Historique.jsx frontend/src/pages/AdminLogin.jsx frontend/src/pages/AdminDashboard.jsx
git commit -m "feat: add usePageTitle to all pages"
```
