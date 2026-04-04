-- Produits
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

-- Commandes
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lignes de commande
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

-- Données de test
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
