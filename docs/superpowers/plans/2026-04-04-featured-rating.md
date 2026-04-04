# Produits Phares + Notation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter `is_featured` et `rating`/`rating_count` en base, afficher un bandeau "Produit phare" statique et une notation étoiles (0-5) sur chaque carte produit.

**Architecture:** Les colonnes `is_featured`, `rating`, `rating_count` sont ajoutées à la table `products` dans `init.sql` et préremplies. Le backend les retourne automatiquement via `p.*`. Le frontend remplace le calcul dynamique (total_sold) par les données statiques issues de la DB.

**Tech Stack:** PostgreSQL (init.sql), Node.js/Express (backend inchangé), React/Tailwind (frontend)

---

## Fichiers modifiés

| Fichier | Changement |
|---------|-----------|
| `database/init.sql` | Ajout colonnes `is_featured`, `rating`, `rating_count` + valeurs seed |
| `frontend/src/pages/Catalogue.jsx` | Supprime `maxSold`/`top3Ids`/`getStars`, passe `rating`/`ratingCount`/`isFeatured` depuis `product` |
| `frontend/src/components/ProductCard.jsx` | Affiche 5 étoiles basées sur `rating`, compteur d'avis, bandeau phare inchangé |

> **Backend** : aucun changement — `p.*` dans `getAllProducts` retourne automatiquement les nouvelles colonnes.

---

### Task 1 : Base de données — colonnes `is_featured`, `rating`, `rating_count`

**Files:**
- Modify: `database/init.sql`

- [ ] **Step 1 : Ajouter les colonnes dans le CREATE TABLE products**

Remplacer la définition du CREATE TABLE products par :

```sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  rating NUMERIC(3,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

- [ ] **Step 2 : Remplacer le bloc INSERT INTO products par la version complète avec les nouvelles colonnes**

Remplacer tout le bloc `INSERT INTO products (name, description, price, stock, category, image_url) VALUES` par :

```sql
INSERT INTO products (name, description, price, stock, category, image_url, is_featured, rating, rating_count) VALUES
  -- Électronique
  ('Smartphone XZ Pro', 'Smartphone 6.5 pouces, 128 Go, double caméra', 699.99, 15, 'Électronique', 'https://placehold.co/300x300?text=Smartphone', true, 4.7, 342),
  ('Casque audio Bluetooth', 'Casque sans fil, réduction de bruit active, 30h autonomie', 129.99, 8, 'Électronique', 'https://placehold.co/300x300?text=Casque', false, 4.4, 189),
  ('Tablette 10 pouces', 'Tablette Android, 64 Go, écran Full HD', 349.99, 5, 'Électronique', 'https://placehold.co/300x300?text=Tablette', false, 4.1, 97),
  ('Montre connectée', 'Smartwatch GPS, suivi santé, étanche 50m, autonomie 7 jours', 199.99, 10, 'Électronique', 'https://placehold.co/300x300?text=Montre', false, 4.5, 214),
  ('Enceinte Bluetooth', 'Enceinte portable 20W, étanche IPX7, autonomie 12h', 79.99, 14, 'Électronique', 'https://placehold.co/300x300?text=Enceinte', false, 4.2, 156),
  ('Clé USB 128 Go', 'USB 3.1, lectures jusqu''à 400 Mo/s, format compact', 19.99, 30, 'Électronique', 'https://placehold.co/300x300?text=USB', false, 3.9, 78),
  ('Chargeur sans fil 15W', 'Chargeur à induction Qi, compatible iPhone et Android', 29.99, 25, 'Électronique', 'https://placehold.co/300x300?text=Chargeur', false, 4.0, 112),
  -- Vêtements
  ('T-shirt coton bio', 'T-shirt 100% coton biologique, lavable à 60°C', 24.99, 50, 'Vêtements', 'https://placehold.co/300x300?text=Tshirt', false, 4.3, 267),
  ('Veste imperméable', 'Veste légère imperméable, capuche amovible', 89.99, 12, 'Vêtements', 'https://placehold.co/300x300?text=Veste', false, 4.1, 143),
  ('Jean slim stretch', 'Jean coupe slim, tissu stretch, 5 poches', 59.99, 18, 'Vêtements', 'https://placehold.co/300x300?text=Jean', false, 3.8, 91),
  ('Sneakers casual', 'Chaussures légères semelle EVA, lacets plats, unisexe', 74.99, 22, 'Vêtements', 'https://placehold.co/300x300?text=Sneakers', true, 4.6, 398),
  ('Bonnet laine mérinos', 'Bonnet chaud, 100% laine mérinos, taille unique', 22.99, 35, 'Vêtements', 'https://placehold.co/300x300?text=Bonnet', false, 4.2, 134),
  -- Maison
  ('Lampe de bureau LED', 'Lampe LED réglable, 3 températures de couleur, port USB', 49.99, 20, 'Maison', 'https://placehold.co/300x300?text=Lampe', false, 4.4, 201),
  ('Coussin décoratif', 'Coussin 45x45 cm, housse lavable, garnissage inclus', 19.99, 0, 'Maison', 'https://placehold.co/300x300?text=Coussin', false, 3.7, 55),
  ('Cafetière à piston', 'French press 1L, verre borosilicate, filtre inox', 34.99, 7, 'Maison', 'https://placehold.co/300x300?text=Cafetiere', false, 4.5, 312),
  ('Planche à découper bambou', 'Planche en bambou certifié FSC, 40x25 cm, antidérapante', 27.99, 16, 'Maison', 'https://placehold.co/300x300?text=Planche', false, 4.1, 88),
  ('Bougie parfumée', 'Bougie soja 200g, parfum vanille-bois de santal, 45h', 14.99, 40, 'Maison', 'https://placehold.co/300x300?text=Bougie', false, 4.3, 176),
  -- Sport
  ('Tapis de yoga', 'Tapis antidérapant 183x61cm, épaisseur 6mm, sangle incluse', 39.99, 20, 'Sport', 'https://placehold.co/300x300?text=Yoga', true, 4.8, 521),
  ('Gourde inox 750ml', 'Double paroi isotherme, maintien 24h froid / 12h chaud', 24.99, 28, 'Sport', 'https://placehold.co/300x300?text=Gourde', false, 4.6, 289),
  ('Corde à sauter pro', 'Câble acier gainé, poignées ergonomiques, longueur réglable', 17.99, 15, 'Sport', 'https://placehold.co/300x300?text=Corde', false, 4.0, 67),
  ('Résistances élastiques', 'Set de 5 bandes de résistance, niveaux XS à XXL', 21.99, 12, 'Sport', 'https://placehold.co/300x300?text=Elastiques', false, 4.2, 143),
  -- Livres
  ('Clean Code', 'Robert C. Martin — Guide des bonnes pratiques de développement', 34.99, 9, 'Livres', 'https://placehold.co/300x300?text=CleanCode', true, 4.9, 874),
  ('Le Petit Prince', 'Antoine de Saint-Exupéry — Édition illustrée, relié', 12.99, 50, 'Livres', 'https://placehold.co/300x300?text=LePetitPrince', false, 4.8, 1203),
  ('Dune', 'Frank Herbert — Édition intégrale, cycle complet tome 1', 15.99, 20, 'Livres', 'https://placehold.co/300x300?text=Dune', false, 4.7, 689),
  -- Jardin
  ('Pot de fleurs céramique', 'Pot céramique émaillée Ø18cm, trou de drainage, soucoupe incluse', 18.99, 24, 'Jardin', 'https://placehold.co/300x300?text=Pot', false, 4.0, 62),
  ('Arrosoir 5L', 'Arrosoir métal galvanisé, bec long pour plantes d''intérieur', 22.99, 11, 'Jardin', 'https://placehold.co/300x300?text=Arrosoir', false, 3.9, 44),
  ('Terreau universel 10L', 'Substrat enrichi compost, pour semis et rempotage', 9.99, 30, 'Jardin', 'https://placehold.co/300x300?text=Terreau', false, 4.1, 91),
  -- Beauté
  ('Sérum vitamine C', 'Sérum visage 30ml, 15% vitamine C, anti-taches, vegan', 32.99, 17, 'Beauté', 'https://placehold.co/300x300?text=Serum', true, 4.7, 445),
  ('Brosse à dents électrique', 'Sonique 40000 vibrations/min, 3 modes, tête de rechange incluse', 49.99, 13, 'Beauté', 'https://placehold.co/300x300?text=Brosse', false, 4.3, 231),
  ('Crème hydratante SPF30', 'Soin quotidien 50ml, protection solaire intégrée, non gras', 19.99, 26, 'Beauté', 'https://placehold.co/300x300?text=Creme', false, 4.1, 178);
```

Produits marqués `is_featured = true` : Smartphone XZ Pro, Sneakers casual, Tapis de yoga, Clean Code, Sérum vitamine C.

- [ ] **Step 3 : Recréer le volume Docker et vérifier**

```bash
cd /home/papy139/Documents/projet_lorenzo
docker compose down -v
docker compose up --build -d
sleep 5
curl -s http://localhost:3001/api/products | jq '.[0] | {id, name, is_featured, rating, rating_count}'
```

Expected :
```json
{
  "id": 1,
  "name": "Smartphone XZ Pro",
  "is_featured": true,
  "rating": "4.7",
  "rating_count": 342
}
```

- [ ] **Step 4 : Commit**

```bash
git add database/init.sql
git commit -m "feat: add is_featured, rating, rating_count columns with seed values"
```

---

### Task 2 : Frontend — nettoyer Catalogue.jsx

**Files:**
- Modify: `frontend/src/pages/Catalogue.jsx`

- [ ] **Step 1 : Supprimer le bloc maxSold/top3Ids/getStars**

Supprimer ces lignes (actuellement lignes 86-99) :

```js
  const maxSold = Math.max(...filteredProducts.map((p) => Number(p.total_sold)), 0);
  const top3Ids = [...filteredProducts]
    .filter((p) => Number(p.total_sold) > 0)
    .sort((a, b) => Number(b.total_sold) - Number(a.total_sold))
    .slice(0, 3)
    .map((p) => p.id);

  const getStars = (product) => {
    if (maxSold === 0 || Number(product.total_sold) === 0) return 0;
    const ratio = Number(product.total_sold) / maxSold;
    if (ratio >= 0.66) return 3;
    if (ratio >= 0.33) return 2;
    return 1;
  };
```

- [ ] **Step 2 : Mettre à jour le rendu ProductCard**

Remplacer :
```jsx
<ProductCard
  key={product.id}
  product={product}
  onAddToCart={handleAddToCart}
  stars={getStars(product)}
  isFeatured={top3Ids.includes(product.id)}
/>
```
par :
```jsx
<ProductCard
  key={product.id}
  product={product}
  onAddToCart={handleAddToCart}
  rating={Number(product.rating)}
  ratingCount={product.rating_count}
  isFeatured={product.is_featured}
/>
```

- [ ] **Step 3 : Commit**

```bash
git add frontend/src/pages/Catalogue.jsx
git commit -m "feat: pass rating/ratingCount/isFeatured from product data to ProductCard"
```

---

### Task 3 : Frontend — notation étoiles dans ProductCard.jsx

**Files:**
- Modify: `frontend/src/components/ProductCard.jsx`

- [ ] **Step 1 : Remplacer le contenu complet de ProductCard.jsx**

```jsx
export default function ProductCard({ product, onAddToCart, rating = 0, ratingCount = 0, isFeatured = false }) {
  const isOutOfStock = product.stock === 0;
  const filledStars = Math.round(rating);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="h-48 bg-gray-300 overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
        {isFeatured && (
          <span
            aria-label="Produit mis en avant"
            className="absolute top-0 left-0 w-full bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 text-center shadow"
          >
            🏆 Produit phare
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < filledStars ? "text-yellow-400" : "text-gray-300"}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {rating.toFixed(1)} ({ratingCount} avis)
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || "Pas de description disponible"}
        </p>

        {/* Price and Stock Badge */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-gray-900">
            {Number(product.price).toFixed(2)}€
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              isOutOfStock
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {isOutOfStock ? "Rupture" : `En stock : ${product.stock}`}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded font-medium transition ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
```

Changements par rapport à l'ancienne version :
- Props : `stars` → `rating` (float 0-5) + `ratingCount` (int)
- Étoiles sur 5 (au lieu de 3), basées sur `Math.round(rating)`
- Affichage du score numérique et du nombre d'avis : `4.7 (342 avis)`
- Badge "Produit phare" : bandeau pleine largeur en haut de l'image (au lieu d'un pill en coin)

- [ ] **Step 2 : Vérifier visuellement**

Ouvrir `http://localhost:5173` :
- Chaque produit avec `rating > 0` affiche 5 étoiles (jaunes selon la note) + score + nb avis
- Les 5 produits phares (Smartphone, Sneakers, Tapis yoga, Clean Code, Sérum) ont le bandeau jaune pleine largeur
- Le bandeau n'apparaît pas sur les autres produits
- Le tri "Les plus achetés" fonctionne toujours (basé sur total_sold)

- [ ] **Step 3 : Commit**

```bash
git add frontend/src/components/ProductCard.jsx
git commit -m "feat: replace dynamic stars with static rating system and full-width featured banner"
```

---

### Task 4 : Push final

- [ ] **Step 1 : Push**

```bash
git push origin main
```
