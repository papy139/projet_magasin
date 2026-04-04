---
title: Tri catalogue + étoiles produits phares
date: 2026-04-04
status: approved
---

# Tri du catalogue + Étoiles / Produit phare

## Objectif

Permettre aux visiteurs de trier les produits du catalogue selon plusieurs critères (prix, stock, popularité) et afficher des étoiles + badge "Produit phare" sur les bestsellers pour inciter à l'achat.

---

## Backend

### Modification de `getAllProducts` (`productsController.js`)

Remplacer `SELECT * FROM products` par un `LEFT JOIN` sur `order_items` pour calculer `total_sold` :

```sql
SELECT p.*, COALESCE(SUM(oi.quantity), 0) AS total_sold
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE 1=1
-- filtres search / category inchangés
GROUP BY p.id
ORDER BY p.created_at DESC
```

- Le champ `total_sold` est ajouté à chaque objet produit retourné.
- Aucun nouvel endpoint — `GET /api/products` étendu.
- Les filtres `search` et `category` existants sont conservés.

---

## Frontend

### 1. Catalogue.jsx — Select de tri

Ajout d'un troisième contrôle dans la barre de filtres (qui passe de 2 à 3 colonnes sur desktop) :

| Valeur | Comportement |
|--------|-------------|
| `newest` (défaut) | Ordre `created_at DESC` (ordre naturel API) |
| `price_asc` | Prix croissant |
| `price_desc` | Prix décroissant |
| `stock_desc` | Stock disponible décroissant |
| `popular` | `total_sold` décroissant |

Le tri est appliqué en frontend sur le tableau `filteredProducts` déjà calculé — pas de nouveau fetch.

`visibleCount` est remis à `PAGE_SIZE` à chaque changement de tri (comme pour search/category).

### 2. ProductCard.jsx — Étoiles + badge

**Étoiles** calculées dans `Catalogue.jsx` à partir du `total_sold` max de la liste visible, passées en prop `stars` (0–3) à `ProductCard` :

| Condition | Étoiles |
|-----------|---------|
| `total_sold === 0` | 0 (rien affiché) |
| `total_sold > 0` et `< 33% du max` | ⭐ |
| `≥ 33%` et `< 66% du max` | ⭐⭐ |
| `≥ 66% du max` | ⭐⭐⭐ |

**Badge "Produit phare"** : prop booléenne `isFeatured` passée aux 3 produits ayant le plus grand `total_sold` (à `total_sold > 0` seulement). Affiché comme un ruban ou badge coloré sur la carte.

Les étoiles et le badge sont affichés sous le nom du produit.

---

## Fichiers modifiés

| Fichier | Changement |
|---------|-----------|
| `backend/src/controllers/productsController.js` | JOIN order_items + total_sold |
| `frontend/src/pages/Catalogue.jsx` | Select tri + calcul stars/isFeatured |
| `frontend/src/components/ProductCard.jsx` | Affichage étoiles + badge phare |

`useProductFilters.js` n'est **pas** utilisé dans Catalogue — le tri est inline pour rester cohérent avec la logique existante de la page (scroll infini, filtres locaux).

---

## Hors scope

- Persistence du tri (URL params, localStorage)
- Notation par les utilisateurs (système de reviews)
- Modification du hook `useProductFilters` (utilisé uniquement en admin)
