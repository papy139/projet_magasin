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

INSERT INTO products (name, description, price, stock, category, image_url, is_featured, rating, rating_count) VALUES
  -- Électronique (suite)
  ('Souris sans fil ergonomique', 'Souris optique 1600 DPI, 3 boutons, autonomie 12 mois', 39.99, 20, 'Électronique', 'https://placehold.co/300x300?text=Souris', false, 4.3, 167),
  ('Clavier mécanique RGB', 'Clavier compact TKL, switches blue, rétroéclairage RGB', 89.99, 8, 'Électronique', 'https://placehold.co/300x300?text=Clavier', true, 4.6, 312),
  ('Webcam Full HD 1080p', 'Webcam USB plug-and-play, micro intégré, angle 90°', 59.99, 11, 'Électronique', 'https://placehold.co/300x300?text=Webcam', false, 4.2, 98),
  ('Batterie externe 20000 mAh', 'Power bank USB-C, charge rapide 22.5W, 2 ports USB', 44.99, 18, 'Électronique', 'https://placehold.co/300x300?text=Batterie', false, 4.4, 224),
  ('Hub USB-C 7 en 1', 'Adaptateur multiport HDMI 4K, USB 3.0 x3, SD, Ethernet', 54.99, 14, 'Électronique', 'https://placehold.co/300x300?text=Hub', false, 4.1, 143),
  -- Vêtements (suite)
  ('Robe d''été fleurie', 'Robe légère 100% viscose, motif floral, col V', 45.99, 14, 'Vêtements', 'https://placehold.co/300x300?text=Robe', false, 4.0, 89),
  ('Short de sport respirant', 'Short running tissu mesh, poche zippée, séchage rapide', 29.99, 25, 'Vêtements', 'https://placehold.co/300x300?text=Short', false, 4.2, 134),
  ('Polo classique coton piqué', 'Polo 100% coton, col boutonné, disponible en 6 couleurs', 34.99, 30, 'Vêtements', 'https://placehold.co/300x300?text=Polo', false, 4.1, 207),
  ('Manteau en laine oversize', 'Manteau chaud, coupe oversize, fermeture boutons, 80% laine', 149.99, 6, 'Vêtements', 'https://placehold.co/300x300?text=Manteau', true, 4.7, 156),
  -- Maison (suite)
  ('Miroir rond 50 cm', 'Miroir mural avec cadre en rotin naturel, crochet inclus', 39.99, 9, 'Maison', 'https://placehold.co/300x300?text=Miroir', false, 4.3, 77),
  ('Ensemble verres à vin x6', 'Verres cristallin 35cl, pied long, lave-vaisselle compatible', 29.99, 10, 'Maison', 'https://placehold.co/300x300?text=Verres', false, 4.2, 63),
  ('Plateau de service en bambou', 'Plateau 40x30cm avec poignées, bambou certifié FSC', 22.99, 13, 'Maison', 'https://placehold.co/300x300?text=Plateau', false, 4.0, 51),
  ('Humidificateur d''air 3L', 'Humidificateur silencieux, brumisation froide, timer 8h', 49.99, 7, 'Maison', 'https://placehold.co/300x300?text=Humidificateur', false, 4.4, 189),
  -- Sport (suite)
  ('Haltères 5 kg (la paire)', 'Haltères néoprène antidérapant, poignée confortable', 34.99, 6, 'Sport', 'https://placehold.co/300x300?text=Halteres', false, 4.5, 201),
  ('Foam roller massage', 'Rouleau mousse haute densité 33cm, relief grille', 19.99, 22, 'Sport', 'https://placehold.co/300x300?text=Foam', false, 4.3, 118),
  ('Sac de sport 40L', 'Sac imperméable, compartiment chaussures, bandoulière réglable', 49.99, 9, 'Sport', 'https://placehold.co/300x300?text=SacSport', false, 4.1, 87),
  -- Livres (suite)
  ('Harry Potter à l''école des sorciers', 'J.K. Rowling — Édition brochée, tome 1', 14.99, 30, 'Livres', 'https://placehold.co/300x300?text=Harry', false, 4.9, 2145),
  ('L''Alchimiste', 'Paulo Coelho — Roman de développement personnel, poche', 11.99, 25, 'Livres', 'https://placehold.co/300x300?text=Alchimiste', false, 4.6, 987),
  ('Atomic Habits', 'James Clear — Construire de bonnes habitudes, édition française', 19.99, 18, 'Livres', 'https://placehold.co/300x300?text=Habits', true, 4.8, 1432),
  -- Jardin (suite)
  ('Gants de jardinage (M/L)', 'Gants cuir et coton, résistants aux épines, taille réglable', 9.99, 20, 'Jardin', 'https://placehold.co/300x300?text=Gants', false, 4.0, 55),
  ('Kit graines aromatiques x8', 'Basilic, persil, thym, menthe... prêt à planter, bio', 14.99, 18, 'Jardin', 'https://placehold.co/300x300?text=Graines', false, 4.3, 83),
  ('Bac à fleurs rectangulaire 60cm', 'Jardinière résine imitation pierre, drainage intégré', 27.99, 12, 'Jardin', 'https://placehold.co/300x300?text=Bac', false, 3.9, 38),
  -- Beauté (suite)
  ('Palette maquillage 12 couleurs', 'Fards à paupières mat et shimmer, longue tenue, vegan', 24.99, 15, 'Beauté', 'https://placehold.co/300x300?text=Palette', false, 4.4, 312),
  ('Huile démaquillante douce', 'Huile bi-phase 150ml, waterproof, convient peaux sensibles', 15.99, 22, 'Beauté', 'https://placehold.co/300x300?text=Huile', false, 4.5, 267),
  ('Masque visage à l''argile', 'Masque purifiant 100ml, argile blanche et kaolin, 2 utilisations/semaine', 12.99, 28, 'Beauté', 'https://placehold.co/300x300?text=Masque', false, 4.2, 198);

-- Images loremflickr : keyword par produit + lock pour image stable
UPDATE products SET image_url = CASE name
  -- Électronique
  WHEN 'Smartphone XZ Pro'         THEN 'https://loremflickr.com/400/400/smartphone?lock=1'
  WHEN 'Casque audio Bluetooth'    THEN 'https://loremflickr.com/400/400/headphones?lock=2'
  WHEN 'Tablette 10 pouces'        THEN 'https://loremflickr.com/400/400/tablet?lock=3'
  WHEN 'Montre connectée'          THEN 'https://loremflickr.com/400/400/smartwatch?lock=4'
  WHEN 'Enceinte Bluetooth'        THEN 'https://loremflickr.com/400/400/bluetooth,speaker?lock=5'
  WHEN 'Clé USB 128 Go'            THEN 'https://loremflickr.com/400/400/usb,technology?lock=6'
  WHEN 'Chargeur sans fil 15W'     THEN 'https://loremflickr.com/400/400/wireless,charger?lock=7'
  WHEN 'Souris sans fil ergonomique' THEN 'https://loremflickr.com/400/400/computer,mouse?lock=8'
  WHEN 'Clavier mécanique RGB'     THEN 'https://loremflickr.com/400/400/keyboard,gaming?lock=9'
  WHEN 'Webcam Full HD 1080p'      THEN 'https://loremflickr.com/400/400/webcam,camera?lock=10'
  WHEN 'Batterie externe 20000 mAh' THEN 'https://loremflickr.com/400/400/powerbank,phone?lock=11'
  WHEN 'Hub USB-C 7 en 1'          THEN 'https://loremflickr.com/400/400/technology,hub?lock=12'
  -- Vêtements
  WHEN 'T-shirt coton bio'         THEN 'https://loremflickr.com/400/400/tshirt?lock=13'
  WHEN 'Veste imperméable'         THEN 'https://loremflickr.com/400/400/jacket,raincoat?lock=14'
  WHEN 'Jean slim stretch'         THEN 'https://loremflickr.com/400/400/jeans,denim?lock=15'
  WHEN 'Sneakers casual'           THEN 'https://loremflickr.com/400/400/sneakers,shoes?lock=16'
  WHEN 'Bonnet laine mérinos'      THEN 'https://loremflickr.com/400/400/beanie,winter?lock=17'
  WHEN 'Robe d''été fleurie'       THEN 'https://loremflickr.com/400/400/dress,floral?lock=18'
  WHEN 'Short de sport respirant'  THEN 'https://loremflickr.com/400/400/shorts,sport?lock=19'
  WHEN 'Polo classique coton piqué' THEN 'https://loremflickr.com/400/400/polo,shirt?lock=20'
  WHEN 'Manteau en laine oversize' THEN 'https://loremflickr.com/400/400/coat,wool?lock=21'
  -- Maison
  WHEN 'Lampe de bureau LED'       THEN 'https://loremflickr.com/400/400/lamp,desk?lock=22'
  WHEN 'Coussin décoratif'         THEN 'https://loremflickr.com/400/400/cushion,pillow?lock=23'
  WHEN 'Cafetière à piston'        THEN 'https://loremflickr.com/400/400/coffee,french+press?lock=24'
  WHEN 'Planche à découper bambou' THEN 'https://loremflickr.com/400/400/kitchen,wood?lock=25'
  WHEN 'Bougie parfumée'           THEN 'https://loremflickr.com/400/400/candle?lock=26'
  WHEN 'Miroir rond 50 cm'         THEN 'https://loremflickr.com/400/400/mirror,decor?lock=27'
  WHEN 'Ensemble verres à vin x6'  THEN 'https://loremflickr.com/400/400/wine,glass?lock=28'
  WHEN 'Plateau de service en bambou' THEN 'https://loremflickr.com/400/400/tray,bamboo?lock=29'
  WHEN 'Humidificateur d''air 3L'  THEN 'https://loremflickr.com/400/400/humidifier?lock=30'
  -- Sport
  WHEN 'Tapis de yoga'             THEN 'https://loremflickr.com/400/400/yoga,mat?lock=31'
  WHEN 'Gourde inox 750ml'         THEN 'https://loremflickr.com/400/400/water,bottle?lock=32'
  WHEN 'Corde à sauter pro'        THEN 'https://loremflickr.com/400/400/jump,rope?lock=33'
  WHEN 'Résistances élastiques'    THEN 'https://loremflickr.com/400/400/resistance,fitness?lock=34'
  WHEN 'Haltères 5 kg (la paire)'  THEN 'https://loremflickr.com/400/400/dumbbells,weights?lock=35'
  WHEN 'Foam roller massage'       THEN 'https://loremflickr.com/400/400/foam,roller?lock=36'
  WHEN 'Sac de sport 40L'          THEN 'https://loremflickr.com/400/400/sports,bag?lock=37'
  -- Livres
  WHEN 'Clean Code'                THEN 'https://loremflickr.com/400/400/book,programming?lock=38'
  WHEN 'Le Petit Prince'           THEN 'https://loremflickr.com/400/400/book,reading?lock=39'
  WHEN 'Dune'                      THEN 'https://loremflickr.com/400/400/book,desert?lock=40'
  WHEN 'Harry Potter à l''école des sorciers' THEN 'https://loremflickr.com/400/400/book,magic?lock=41'
  WHEN 'L''Alchimiste'             THEN 'https://loremflickr.com/400/400/book,novel?lock=42'
  WHEN 'Atomic Habits'             THEN 'https://loremflickr.com/400/400/book,motivation?lock=43'
  -- Jardin
  WHEN 'Pot de fleurs céramique'   THEN 'https://loremflickr.com/400/400/flowerpot,plant?lock=44'
  WHEN 'Arrosoir 5L'               THEN 'https://loremflickr.com/400/400/watering,garden?lock=45'
  WHEN 'Terreau universel 10L'     THEN 'https://loremflickr.com/400/400/soil,garden?lock=46'
  WHEN 'Gants de jardinage (M/L)'  THEN 'https://loremflickr.com/400/400/gardening,gloves?lock=47'
  WHEN 'Kit graines aromatiques x8' THEN 'https://loremflickr.com/400/400/seeds,herbs?lock=48'
  WHEN 'Bac à fleurs rectangulaire 60cm' THEN 'https://loremflickr.com/400/400/planter,flowers?lock=49'
  -- Beauté
  WHEN 'Sérum vitamine C'          THEN 'https://loremflickr.com/400/400/serum,skincare?lock=50'
  WHEN 'Brosse à dents électrique' THEN 'https://loremflickr.com/400/400/toothbrush?lock=51'
  WHEN 'Crème hydratante SPF30'    THEN 'https://loremflickr.com/400/400/cream,skincare?lock=52'
  WHEN 'Palette maquillage 12 couleurs' THEN 'https://loremflickr.com/400/400/makeup,palette?lock=53'
  WHEN 'Huile démaquillante douce' THEN 'https://loremflickr.com/400/400/skincare,beauty?lock=54'
  WHEN 'Masque visage à l''argile' THEN 'https://loremflickr.com/400/400/face,mask?lock=55'
  ELSE image_url
END;
