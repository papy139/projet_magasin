# Design — Étape 3 : Backend API

**Date :** 2026-04-03
**Scope :** API REST Express avec routes produits et commandes, middleware auth admin, connexion PostgreSQL

---

## Structure des fichiers

```
backend/src/
├── db/
│   └── pool.js
├── middleware/
│   ├── adminAuth.js
│   └── errorHandler.js
├── controllers/
│   ├── productsController.js
│   └── ordersController.js
├── routes/
│   ├── products.js
│   └── orders.js
└── index.js
```

---

## Routes

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | - | `{ status: "ok" }` |
| GET | `/api/products` | public | liste tous les produits, supporte `?search=` et `?category=` |
| GET | `/api/products/:id` | public | détail d'un produit |
| POST | `/api/products` | admin | créer un produit |
| PUT | `/api/products/:id` | admin | modifier nom, description, prix, image, catégorie |
| PATCH | `/api/products/:id/stock` | admin | modifier uniquement le stock |
| DELETE | `/api/products/:id` | admin | supprimer un produit |
| POST | `/api/orders` | public | passer une commande (décrémente stock) |
| GET | `/api/orders` | admin | liste toutes les commandes |

---

## Authentification admin

- Header : `x-admin-key`
- Valeur comparée à `process.env.ADMIN_KEY`
- Si absent ou incorrect : 401 `{ error: "Unauthorized" }`
- Pas de JWT, pas de session

---

## Logique commande (POST /api/orders)

Body attendu :
```json
{
  "customer_name": "Jean Dupont",
  "customer_email": "jean@example.com",
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ]
}
```

Traitement dans une transaction PostgreSQL :
1. Vérifier que chaque produit existe et a un stock suffisant
2. Si un produit est en rupture → rollback + 400 `{ error: "Stock insuffisant pour <name>" }`
3. Créer la ligne dans `orders`
4. Créer les lignes dans `order_items` (avec `unit_price` snapshot du prix actuel)
5. Décrémenter le stock de chaque produit
6. Commit transaction → 201 avec l'order créé

---

## Gestion d'erreurs

Middleware `errorHandler.js` monté en dernier dans `index.js`.
Format uniforme : `{ error: "message" }`
Codes HTTP : 400 (validation), 401 (auth), 404 (not found), 500 (serveur)

---

## Connexion PostgreSQL

`db/pool.js` : Pool pg avec `DATABASE_URL` depuis `process.env`.
Importé dans tous les controllers, jamais instancié deux fois.

---

## Critère de validation

Tester chaque endpoint avec curl depuis l'intérieur du conteneur ou via un fichier `.http`.
