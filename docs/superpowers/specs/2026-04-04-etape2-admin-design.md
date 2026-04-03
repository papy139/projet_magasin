# Design — Étape 2 Admin : recherche, filtres commandes, tri colonnes

**Date :** 2026-04-04  
**Scope :** `frontend/src/pages/AdminDashboard.jsx` + deux nouveaux hooks  
**Approche retenue :** hooks custom client-side (toutes les données sont déjà chargées en mémoire)

---

## Contexte

Le dashboard admin charge produits et commandes une seule fois au montage via `Promise.all`. Les filtres produits existants (catégorie, stock, prix min/max) sont gérés inline avec des états locaux dans `AdminDashboard.jsx` (585 lignes). L'ajout de recherche textuelle, de filtres commandes et de tri de colonnes dans le même fichier le rendrait ingérable.

---

## Architecture

### Deux hooks custom

#### `frontend/src/hooks/useProductFilters.js`

Reçoit `products[]` en entrée. Expose :

| Export | Type | Description |
|--------|------|-------------|
| `search` / `setSearch` | string | Filtre textuel sur `name`, `category`, `description` |
| `filterCategory` / `setFilterCategory` | string | Filtre par catégorie exacte |
| `filterStock` / `setFilterStock` | `'all'` \| `'in'` \| `'out'` | Filtre par disponibilité stock |
| `filterMinPrice` / `setFilterMinPrice` | string | Prix minimum |
| `filterMaxPrice` / `setFilterMaxPrice` | string | Prix maximum |
| `sortKey` / `sortDir` | string | Colonne et direction de tri actifs |
| `toggleSort(key)` | fn | Bascule la direction si même colonne, change sinon (dir = `'asc'`) |
| `filtered` | array | Tableau trié + filtré prêt à l'affichage |
| `resetFilters()` | fn | Remet tous les états à leurs valeurs par défaut |

Colonnes triables : `name`, `category`, `price`, `stock`.  
Tri par défaut : aucun (ordre de l'API).

#### `frontend/src/hooks/useOrderFilters.js`

Reçoit `orders[]` en entrée. Expose :

| Export | Type | Description |
|--------|------|-------------|
| `filterStatus` / `setFilterStatus` | `'all'` \| `'pending'` \| `'confirmed'` | Filtre par statut |
| `filterDateFrom` / `setFilterDateFrom` | string (YYYY-MM-DD) | Borne inférieure de date |
| `filterDateTo` / `setFilterDateTo` | string (YYYY-MM-DD) | Borne supérieure de date |
| `sortKey` / `sortDir` | string | Colonne et direction de tri actifs |
| `toggleSort(key)` | fn | Même comportement que côté produits |
| `filtered` | array | Tableau trié + filtré |
| `resetFilters()` | fn | Remet tout à zéro |

Colonnes triables : `id`, `status`, `created_at`.  
Tri par défaut : `created_at` décroissant (commandes les plus récentes en premier).

---

## Modifications dans `AdminDashboard.jsx`

1. **Supprimer** les 5 états de filtres produits existants (`filterCategory`, `filterStock`, `filterMinPrice`, `filterMaxPrice` et la variable `filtered` inline).
2. **Remplacer** par `const { filtered: filteredProducts, ...productFilters } = useProductFilters(products)`.
3. **Ajouter** `const { filtered: filteredOrders, ...orderFilters } = useOrderFilters(orders)`.
4. **Ajouter** un input de recherche texte au-dessus de la barre de filtres produits existante.
5. **Rendre les en-têtes de tableau cliquables** avec indicateur visuel (↑ / ↓).
6. **Ajouter la barre de filtres commandes** (select statut + deux inputs date + bouton reset) au-dessus du tableau commandes.

---

## UI — détails

### Recherche produits

Input texte pleine largeur au-dessus des filtres existants :
```
[ Rechercher par nom, catégorie, description... ]
```
Recherche insensible à la casse, sur les trois champs en simultané.

### En-têtes triables (les deux tableaux)

- Colonne active : affiche `↑` (asc) ou `↓` (desc) après le libellé
- Colonnes non actives : libellé seul, curseur pointer
- Style Tailwind existant conservé (`bg-gray-100`, `text-gray-600`, etc.)

### Filtres commandes

Barre au-dessus du tableau :
```
Toutes statuts ▾   [ Du... ]   [ Au... ]   Réinitialiser (conditionnel)
```
- Le select statut : options `Tous | pending | confirmed`
- Les inputs date : `type="date"`, format natif du navigateur
- "Réinitialiser" n'apparaît que si au moins un filtre est actif

---

## Ce qui ne change pas

- Aucune modification backend (routes, controllers, DB)
- Aucun appel API supplémentaire
- Style Tailwind conservé tel quel
- Formulaire d'ajout de produit inchangé
- Formulaire d'édition inline inchangé
- Gestion du stock inchangée

---

## Fichiers créés / modifiés

| Fichier | Action |
|---------|--------|
| `frontend/src/hooks/useProductFilters.js` | Créé |
| `frontend/src/hooks/useOrderFilters.js` | Créé |
| `frontend/src/pages/AdminDashboard.jsx` | Modifié |
