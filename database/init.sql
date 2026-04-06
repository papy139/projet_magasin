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

INSERT INTO products (name, description, price, stock, category, image_url, is_featured, rating, rating_count) VALUES
  -- Informatique
  ('Ordinateur portable 15"', 'Laptop Intel Core i5, 16 Go RAM, SSD 512 Go, écran Full HD IPS', 899.99, 6, 'Informatique', 'https://placehold.co/300x300?text=Laptop', true, 4.6, 312),
  ('Écran 27" 4K', 'Moniteur IPS 4K UHD, 60 Hz, HDMI + DisplayPort, réglable en hauteur', 449.99, 4, 'Informatique', 'https://placehold.co/300x300?text=Ecran', false, 4.5, 187),
  ('Disque SSD 1 To', 'SSD NVMe PCIe 4.0, lectures 7000 Mo/s, format M.2 2280', 89.99, 20, 'Informatique', 'https://placehold.co/300x300?text=SSD', false, 4.7, 523),
  ('RAM DDR5 16 Go', 'Kit 2x8 Go DDR5 5200 MHz, CL40, compatible Intel & AMD', 69.99, 12, 'Informatique', 'https://placehold.co/300x300?text=RAM', false, 4.4, 198),
  ('Carte graphique RTX 4060', 'GPU 8 Go GDDR6, ray tracing, DLSS 3, 3 DisplayPort 1.4', 349.99, 3, 'Informatique', 'https://placehold.co/300x300?text=GPU', true, 4.8, 421),
  ('Routeur Wi-Fi 6 AX3000', 'Dual band 2.4+5 GHz, jusqu''à 3000 Mbps, 4 antennes, MU-MIMO', 129.99, 8, 'Informatique', 'https://placehold.co/300x300?text=Routeur', false, 4.3, 167),
  ('Disque dur externe 2 To', 'HDD USB 3.0, portable 2.5", compatible PC/Mac/PS5', 79.99, 15, 'Informatique', 'https://placehold.co/300x300?text=HDD', false, 4.2, 289),
  ('Station d''accueil 12 en 1', 'Docking USB-C : 4K HDMI, 100W PD, 4xUSB, SD, RJ45, audio', 159.99, 7, 'Informatique', 'https://placehold.co/300x300?text=Dock', false, 4.5, 143),
  ('Imprimante laser multifonction', 'Laser mono A4, scan, copie, Wi-Fi, recto-verso auto, 30 ppm', 199.99, 5, 'Informatique', 'https://placehold.co/300x300?text=Imprimante', false, 4.1, 98),
  ('Ventilateur boîtier 120mm RGB', 'Fan ARGB 120mm, débit 52 CFM, roulement hydraulique, silencieux', 24.99, 25, 'Informatique', 'https://placehold.co/300x300?text=Fan', false, 4.0, 76),
  -- Cuisine
  ('Blender puissant 1200W', 'Blender 1.5L, 6 lames acier inox, 3 vitesses + pulse, sans BPA', 79.99, 10, 'Cuisine', 'https://placehold.co/300x300?text=Blender', false, 4.4, 234),
  ('Poêle antiadhésive 28cm', 'Revêtement céramique sans PFAS, fond induction, compatible lave-vaisselle', 39.99, 18, 'Cuisine', 'https://placehold.co/300x300?text=Poele', false, 4.3, 312),
  ('Robot pâtissier 1000W', 'Cuve 5L inox, 6 vitesses + pulse, fouet, crochet, feuille inclus', 299.99, 4, 'Cuisine', 'https://placehold.co/300x300?text=Robot', true, 4.7, 445),
  ('Couteau de chef 20cm', 'Lame acier inox forgé allemand, manche ergonomique, équilibré', 49.99, 14, 'Cuisine', 'https://placehold.co/300x300?text=Couteau', false, 4.6, 378),
  ('Balance de cuisine numérique', 'Précision 1g, capacité 5kg, écran LCD, unités multiples, tare', 24.99, 22, 'Cuisine', 'https://placehold.co/300x300?text=Balance', false, 4.2, 189),
  ('Mixeur plongeant 600W', 'Mixeur 600W, pied amovible inox, 2 vitesses + turbo, accessoires inclus', 44.99, 12, 'Cuisine', 'https://placehold.co/300x300?text=Mixeur', false, 4.3, 167),
  ('Batterie de cuisine 5 pièces', 'Set casseroles + sauteuse inox, fond tri-ply, compatible induction', 129.99, 6, 'Cuisine', 'https://placehold.co/300x300?text=Batterie', false, 4.4, 201),
  ('Machine à café à capsules', 'Compatible Nespresso, 19 bars, réservoir 1L, chauffe en 25s', 89.99, 8, 'Cuisine', 'https://placehold.co/300x300?text=Cafe', false, 4.5, 512),
  ('Moule à gâteau 24cm', 'Moule rond antiadhésif, fond amovible, acier carbone, 8 personnes', 14.99, 30, 'Cuisine', 'https://placehold.co/300x300?text=Moule', false, 4.1, 98),
  ('Plat à gratin céramique 30cm', 'Plat ovale 2L, résistant 280°C, micro-ondes OK, design moderne', 29.99, 16, 'Cuisine', 'https://placehold.co/300x300?text=Gratin', false, 4.2, 134),
  ('Grille-pain 2 fentes', 'Grille-pain 850W, 6 niveaux de cuisson, plateau ramasse-miettes', 34.99, 15, 'Cuisine', 'https://placehold.co/300x300?text=Grille', false, 4.0, 87),
  ('Livre de recettes végétariennes', '200 recettes végétariennes et veganes, photos HD, saisonnier', 19.99, 25, 'Cuisine', 'https://placehold.co/300x300?text=Recettes', false, 4.3, 145),
  -- Jouets
  ('LEGO City 500 pièces', 'Set LEGO City avec véhicules et personnages, à partir de 8 ans', 59.99, 12, 'Jouets', 'https://placehold.co/300x300?text=LEGO', true, 4.8, 634),
  ('Poupée articulée 30cm', 'Poupée avec tenue, accessoires et support, articulée 11 points', 24.99, 20, 'Jouets', 'https://placehold.co/300x300?text=Poupee', false, 4.2, 189),
  ('Drone enfant télécommandé', 'Drone 2.4 GHz, caméra HD 720p, autonomie 15min, à partir de 8 ans', 49.99, 8, 'Jouets', 'https://placehold.co/300x300?text=Drone', false, 4.1, 143),
  ('Jeu de société Monopoly', 'Monopoly classique en français, 2-6 joueurs, plateau illustré', 34.99, 15, 'Jouets', 'https://placehold.co/300x300?text=Monopoly', false, 4.7, 892),
  ('Voiture télécommandée 1/18', 'Voiture RC 4WD 2.4 GHz, 30 km/h, LED, batterie rechargeable', 39.99, 10, 'Jouets', 'https://placehold.co/300x300?text=RC', false, 4.3, 201),
  ('Kit créatif peinture enfant', 'Set peinture 24 couleurs, pinceaux, palette, tablier, 4-10 ans', 19.99, 25, 'Jouets', 'https://placehold.co/300x300?text=Peinture', false, 4.4, 167),
  ('Puzzle 1000 pièces paysage', 'Puzzle panoramique forêt automnale, carton épais, boîte solide', 22.99, 18, 'Jouets', 'https://placehold.co/300x300?text=Puzzle', false, 4.5, 312),
  ('Jeu d''échecs en bois', 'Échiquier bois massif 40cm, pièces Staunton lestées, feutre vert', 29.99, 12, 'Jouets', 'https://placehold.co/300x300?text=Echecs', false, 4.6, 245),
  ('Trampoline 3m avec filet', 'Trampoline extérieur 3m, filet de sécurité, échelle, charge 150kg', 199.99, 3, 'Jouets', 'https://placehold.co/300x300?text=Trampoline', false, 4.4, 156),
  ('Figurines Pokémon set x12', 'Set 12 figurines articulées 5cm, différentes générations', 34.99, 20, 'Jouets', 'https://placehold.co/300x300?text=Pokemon', false, 4.5, 423),
  -- Animalerie
  ('Croquettes chien adulte 10kg', 'Croquettes bœuf & légumes, sans colorants, pour chien adulte moyen', 39.99, 15, 'Animalerie', 'https://placehold.co/300x300?text=Croquettes', false, 4.3, 234),
  ('Litière chat agglomérante 10L', 'Litière minérale ultra-absorbante, neutralise les odeurs, faible poussière', 14.99, 25, 'Animalerie', 'https://placehold.co/300x300?text=Litiere', false, 4.2, 312),
  ('Gamelle double inox 2x350ml', 'Gamelle double inox sur support antidérapant, lave-vaisselle OK', 19.99, 20, 'Animalerie', 'https://placehold.co/300x300?text=Gamelle', false, 4.1, 178),
  ('Laisse rétractable 5m', 'Laisse rétractable 5m, sangle large, bouton frein, jusqu''à 50kg', 17.99, 18, 'Animalerie', 'https://placehold.co/300x300?text=Laisse', false, 4.0, 145),
  ('Jouet interactif chat laser', 'Jouet électronique laser + plume tournante, 3 vitesses, minuterie', 12.99, 30, 'Animalerie', 'https://placehold.co/300x300?text=Jouet', false, 4.3, 267),
  ('Cage oiseau 50x40cm', 'Cage perruche ou canari, fond plastique amovible, 2 mangeoires inox', 59.99, 6, 'Animalerie', 'https://placehold.co/300x300?text=Cage', false, 4.1, 89),
  ('Aquarium 60L kit complet', 'Aquarium 60L avec filtre, LED, chauffage, thermo, pompette', 129.99, 4, 'Animalerie', 'https://placehold.co/300x300?text=Aquarium', false, 4.4, 123),
  ('Collier antiparasitaire 8 mois', 'Collier anti-puces et tiques, efficacité 8 mois, taille réglable', 9.99, 35, 'Animalerie', 'https://placehold.co/300x300?text=Collier', false, 4.0, 198),
  -- Musique
  ('Guitare acoustique 4/4', 'Guitare folk épicéa/tilleul, mécaniques chrome, housse incluse', 149.99, 5, 'Musique', 'https://placehold.co/300x300?text=Guitare', true, 4.5, 312),
  ('Piano numérique 61 touches', 'Piano 61 touches lestées, 128 sons, Bluetooth, USB-MIDI, pédale incluse', 249.99, 3, 'Musique', 'https://placehold.co/300x300?text=Piano', false, 4.6, 245),
  ('Casque studio fermé', 'Casque circum-aural, réponse 10-25000 Hz, impédance 32Ω, câble 3m', 89.99, 8, 'Musique', 'https://placehold.co/300x300?text=Casque', false, 4.4, 178),
  ('Cajon percussion bois', 'Cajon bouleau, snare réglable, poignées transport, sac inclus', 79.99, 7, 'Musique', 'https://placehold.co/300x300?text=Cajon', false, 4.3, 134),
  ('Pack médiators x20', 'Mix d''épaisseurs 0.5 à 1.5mm, matières variées, idéal débutant', 4.99, 50, 'Musique', 'https://placehold.co/300x300?text=Mediator', false, 4.2, 89),
  ('Pied de microphone réglable', 'Pied micro 80-150cm, col de cygne flexible, attache pincer, stable', 29.99, 12, 'Musique', 'https://placehold.co/300x300?text=Pied', false, 4.1, 112),
  ('Ukulélé soprano acajou', 'Ukulélé 21 pouces acajou, cordes Aquila, accordeur clip offert', 59.99, 9, 'Musique', 'https://placehold.co/300x300?text=Ukulele', false, 4.4, 201),
  ('Interface audio USB 2 entrées', 'Interface 2 entrées XLR/Jack, 24 bits/192 kHz, alimentation fantôme', 119.99, 6, 'Musique', 'https://placehold.co/300x300?text=Interface', false, 4.5, 167),
  -- Voyage
  ('Valise cabine 55cm', 'Valise rigide polycarbonate, 4 roues 360°, verrou TSA, 35L', 89.99, 10, 'Voyage', 'https://placehold.co/300x300?text=Valise', false, 4.4, 312),
  ('Sac à dos randonnée 40L', 'Sac trekking 40L, dos respirant, ceinture ventrale, couvre-pluie', 79.99, 8, 'Voyage', 'https://placehold.co/300x300?text=Sac', false, 4.5, 245),
  ('Adaptateur universel voyage', 'Adaptateur 150 pays, 3 USB + 1 USB-C, compact, avec protection surge', 19.99, 30, 'Voyage', 'https://placehold.co/300x300?text=Adaptateur', false, 4.3, 423),
  ('Coussin de voyage ergonomique', 'Coussin cervical mémoire de forme, housse lavable, avec masque nuit', 24.99, 20, 'Voyage', 'https://placehold.co/300x300?text=Coussin', false, 4.2, 198),
  ('Trousse de toilette voyage', 'Trousse suspendue 3 compartiments, étanche, 35x20cm déployé', 14.99, 25, 'Voyage', 'https://placehold.co/300x300?text=Trousse', false, 4.1, 145),
  ('Cadenas TSA sécurité', 'Cadenas TSA à code 3 chiffres, corps aluminium, câble acier 1m', 12.99, 35, 'Voyage', 'https://placehold.co/300x300?text=Cadenas', false, 4.0, 167),
  ('Couverture voyage compressible', 'Couverture polaire 130x150cm, pochette compressible, 200g', 34.99, 15, 'Voyage', 'https://placehold.co/300x300?text=Couverture', false, 4.3, 134),
  ('Guide Routard Europe 2025', 'Guide touristique Europe, 50 destinations, cartes détachables, 800p', 19.99, 12, 'Voyage', 'https://placehold.co/300x300?text=Guide', false, 4.4, 89),
  -- Auto
  ('Aspirateur voiture 12V', 'Mini aspirateur 12V prise allume-cigare, 120W, filtres lavables', 29.99, 18, 'Auto', 'https://placehold.co/300x300?text=Aspirateur', false, 4.1, 234),
  ('Support téléphone voiture', 'Support grille aération + ventouse, rotation 360°, universel 4-7"', 19.99, 25, 'Auto', 'https://placehold.co/300x300?text=Support', false, 4.2, 312),
  ('Chargeur voiture USB-C 65W', 'Chargeur rapide 65W USB-C + 18W USB-A, GaN, compatible PD/QC', 24.99, 20, 'Auto', 'https://placehold.co/300x300?text=Chargeur', false, 4.4, 189),
  ('Câbles de démarrage 400A', 'Câbles 400A 3m, pinces cuivre massif, mallette de transport', 39.99, 12, 'Auto', 'https://placehold.co/300x300?text=Cables', false, 4.3, 145),
  ('Désodorisant voiture bois', 'Désodorisant naturel bois de cèdre, diffuseur huiles essentielles', 9.99, 40, 'Auto', 'https://placehold.co/300x300?text=Desod', false, 4.0, 89),
  ('Kit réparation crevaison', 'Kit crevaison compresseur 12V + produit, valises, jusqu''à 195/65', 17.99, 15, 'Auto', 'https://placehold.co/300x300?text=Crevaison', false, 4.1, 112),
  ('Dashcam Full HD', 'Caméra de bord 1080p 60fps, grand angle 170°, vision nuit, loop', 79.99, 8, 'Auto', 'https://placehold.co/300x300?text=Dashcam', false, 4.4, 198),
  ('Bâche voiture universelle', 'Bâche imperméable 4 saisons, taille L (jusqu''à 5m), fixations incluses', 49.99, 10, 'Auto', 'https://placehold.co/300x300?text=Bache', false, 4.2, 134),
  -- Bureau
  ('Lampe LED bureau sans fil', 'Lampe 3 températures, intensité réglable, batterie 2500mAh, USB-C', 44.99, 14, 'Bureau', 'https://placehold.co/300x300?text=Lampe', false, 4.5, 201),
  ('Organiseur de bureau 6 cases', 'Organiseur bambou 6 compartiments, crayon + doc + mobile, épuré', 24.99, 20, 'Bureau', 'https://placehold.co/300x300?text=Organiseur', false, 4.3, 167),
  ('Carnet A5 papier recyclé', 'Carnet 160 pages papier 90g recyclé, couverture rigide, élastique', 9.99, 35, 'Bureau', 'https://placehold.co/300x300?text=Carnet', false, 4.2, 134),
  ('Stylos gel x12 couleurs', 'Pack 12 stylos gel 0.7mm, séchage rapide, rechargeable', 14.99, 30, 'Bureau', 'https://placehold.co/300x300?text=Stylos', false, 4.4, 189),
  ('Agenda 2026 semainier A5', 'Agenda hebdomadaire A5, papier 80g, onglets mois, marque-pages', 12.99, 25, 'Bureau', 'https://placehold.co/300x300?text=Agenda', false, 4.3, 145),
  ('Repose-poignet clavier gel', 'Repose-poignet gel memory foam, revêtement lycra, 45cm', 19.99, 18, 'Bureau', 'https://placehold.co/300x300?text=Repose', false, 4.1, 98),
  ('Tapis de souris XXL 90x40cm', 'Grand tapis gaming, surface lisse, bords couturés, antidérapant', 29.99, 15, 'Bureau', 'https://placehold.co/300x300?text=Tapis', false, 4.4, 234),
  ('Imprimante étiquettes thermique', 'Imprimante thermique sans encre, Bluetooth, étiquettes 12-57mm', 59.99, 8, 'Bureau', 'https://placehold.co/300x300?text=Etiquettes', false, 4.3, 156),
  -- Vêtements (suite)
  ('Chaussettes sport x5 paires', 'Lot 5 paires chaussettes sport, tissu respirant, renforcé talon/orteils', 19.99, 40, 'Vêtements', 'https://placehold.co/300x300?text=Chaussettes', false, 4.1, 234),
  ('Sweat à capuche unisexe', 'Hoodie coton molletonné, poche kangourou, cordon réglable', 49.99, 22, 'Vêtements', 'https://placehold.co/300x300?text=Sweat', false, 4.3, 312),
  ('Legging sport taille haute', 'Legging compression, taille haute, poche latérale, séchage rapide', 34.99, 18, 'Vêtements', 'https://placehold.co/300x300?text=Legging', false, 4.5, 267),
  ('Ceinture cuir tressé', 'Ceinture tressé cuir véritable, boucle métal brossé, 3 tailles', 29.99, 20, 'Vêtements', 'https://placehold.co/300x300?text=Ceinture', false, 4.2, 145),
  ('Écharpe laine douce', 'Écharpe 180x30cm, mélange laine douce, motif chevron bicolore', 24.99, 30, 'Vêtements', 'https://placehold.co/300x300?text=Echarpe', false, 4.3, 189),
  -- Maison (suite)
  ('Cadre photo 30x40cm', 'Cadre bois massif chêne, vitre antireflet, support + crochet', 19.99, 25, 'Maison', 'https://placehold.co/300x300?text=Cadre', false, 4.2, 156),
  ('Horloge murale silencieuse', 'Pendule 30cm mouvement silencieux, chiffres romains, cadran blanc', 34.99, 12, 'Maison', 'https://placehold.co/300x300?text=Horloge', false, 4.3, 134),
  ('Tapis salon 160x230cm', 'Tapis poils ras 7mm, motif géométrique, anti-taches, antidérapant', 149.99, 4, 'Maison', 'https://placehold.co/300x300?text=Tapis', false, 4.4, 98),
  ('Rideau occultant 140x260cm', 'Paire rideaux blackout, isolation thermique, anneaux inclus', 39.99, 10, 'Maison', 'https://placehold.co/300x300?text=Rideau', false, 4.1, 112),
  ('Porte-serviettes bambou', 'Porte-serviettes mural 3 barres, bambou certifié, fixation sans perçage', 27.99, 16, 'Maison', 'https://placehold.co/300x300?text=PorteServ', false, 4.2, 89),
  -- Sport (suite)
  ('Vélo appartement pliable', 'Vélo fitness pliable, 8 résistances, écran LCD calories/distance, 15kg', 299.99, 3, 'Sport', 'https://placehold.co/300x300?text=Velo', false, 4.3, 201),
  ('Raquette de tennis adulte', 'Raquette 270g, tête 100 in², cordée, grip L2, housse incluse', 79.99, 8, 'Sport', 'https://placehold.co/300x300?text=Raquette', false, 4.4, 145),
  ('Ballon de football T5', 'Ballon taille 5 cousu main, 32 panneaux, utilisation extérieure', 29.99, 20, 'Sport', 'https://placehold.co/300x300?text=Ballon', false, 4.2, 234),
  ('Gants de boxe 12oz', 'Gants cuir synthétique 12oz, rembourrage triple couche, scratch fixation', 44.99, 10, 'Sport', 'https://placehold.co/300x300?text=Gants', false, 4.3, 167),
  ('Chronomètre digital sport', 'Chrono 1/100s, mémoire 99 temps, clip ceinture, résistant eau', 14.99, 25, 'Sport', 'https://placehold.co/300x300?text=Chrono', false, 4.1, 112),
  -- Électronique (suite)
  ('Liseuse e-ink 6"', 'Liseuse 300 ppi, éclairage chaud/froid, 8 Go, étanche IPX8, 6 semaines', 129.99, 10, 'Électronique', 'https://placehold.co/300x300?text=Liseuse', false, 4.7, 589),
  ('Ventilateur USB bureau 2en1', 'Ventilateur + lampe LED bureau USB, 3 vitesses, silencieux 25dB', 19.99, 22, 'Électronique', 'https://placehold.co/300x300?text=Ventilo', false, 4.0, 134),
  ('Multiprise 8 prises + 4 USB', 'Multiprise parafoudre, 8 prises + 4 USB + 1 USB-C, câble 3m', 34.99, 18, 'Électronique', 'https://placehold.co/300x300?text=Multiprise', false, 4.3, 245),
  ('Caméra surveillance WiFi', 'Caméra IP 2K WiFi, vision nuit 10m, détection mouvement, microSD', 59.99, 9, 'Électronique', 'https://placehold.co/300x300?text=Camera', false, 4.2, 189),
  ('Mini projecteur portable', 'Projecteur LED 200 lumens, HDMI + USB, batterie 2h, image 120"', 149.99, 5, 'Électronique', 'https://placehold.co/300x300?text=Projecteur', false, 4.1, 145),
  -- Beauté (suite)
  ('Épilateur électrique sans fil', 'Épilateur rechargeable USB, 20 pincettes, tête lavable, 40min', 49.99, 12, 'Beauté', 'https://placehold.co/300x300?text=Epilateur', false, 4.2, 234),
  ('Fond de teint longue tenue', 'Fond de teint 30ml, 20 teintes, tenue 24h, SPF 15, vegan', 24.99, 20, 'Beauté', 'https://placehold.co/300x300?text=FondTeint', false, 4.3, 312),
  ('Shampoing solide bio', 'Shampoing solide 85g = 3 flacons, certifié bio, sans sulfates, tous types', 9.99, 35, 'Beauté', 'https://placehold.co/300x300?text=Shampoing', false, 4.4, 267),
  ('Eau de toilette 50ml', 'Parfum boisé-épicé, tenue 6h, vaporisateur, sans parabènes', 44.99, 8, 'Beauté', 'https://placehold.co/300x300?text=Parfum', false, 4.3, 189),
  ('Cotons démaquillants lavables', 'Lot 10 cotons bambou lavables, pochette de lavage incluse, zéro déchet', 14.99, 25, 'Beauté', 'https://placehold.co/300x300?text=Coton', false, 4.5, 345);

