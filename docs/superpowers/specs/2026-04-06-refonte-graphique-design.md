# Design — Refonte Graphique

**Date :** 2026-04-06
**Scope :** Refonte visuelle complète du frontend — palette, typographie, composants, pages (mobile-first + Tailwind CSS)

---

## Références visuelles

Deux applications mobiles e-commerce de référence :

1. **Thakurgaon Grocery App** — palette verte/orange/crème, illustrations cartoon, style épuré et joueur
2. **Multi-Category E-Commerce App** — palette orange/noir/blanc, interface minimaliste, badges produit, navigation claire

---

## Palette de couleurs

| Rôle | Couleur | Hex |
|---|---|---|
| Primaire | Vert profond | `#2D6A4F` |
| Accent | Orange vif | `#F4A261` |
| Fond principal | Crème/blanc cassé | `#FAFAF5` |
| Fond secondaire | Blanc | `#FFFFFF` |
| Texte principal | Gris foncé | `#1A1A2E` |
| Texte secondaire | Gris moyen | `#6B7280` |
| Succès/badge stock | Vert clair | `#52B788` |
| Danger/rupture | Rouge doux | `#E63946` |
| Bordures | Gris très clair | `#E5E7EB` |

---

## Typographie

- **Titres** : `Inter` semi-bold / bold (600–700)
- **Corps** : `Inter` regular (400)
- **Prix / badges** : `Inter` bold (700), taille augmentée
- Import via Google Fonts dans `index.html`

---

## Composants à retravailler

### ProductCard

- Fond blanc, border-radius `16px`, ombre légère (`shadow-md`)
- Image produit en haut, ratio 1:1, `object-fit: cover`
- Badge "Nouveau" ou "Promo" en overlay (coin supérieur gauche), fond orange
- Badge stock : vert si dispo, rouge si rupture
- Étoiles de notation visibles sous le nom
- Prix en gras, couleur primaire
- Bouton "Ajouter au panier" : pleine largeur, fond vert, hover orange
- Bouton désactivé (stock = 0) : fond gris, texte "Rupture de stock"

### Navbar

- Fond blanc, bordure bottom fine gris clair
- Logo à gauche
- Liens centrés (desktop)
- Icône panier à droite avec badge nombre d'articles (fond orange, texte blanc)
- Hauteur : `64px`

### Boutons

| Variant | Style |
|---|---|
| Primary | Fond vert `#2D6A4F`, texte blanc, border-radius `12px`, hover `#1B4332` |
| Secondary | Fond transparent, bordure verte, texte vert, hover fond vert clair |
| Danger | Fond rouge doux `#E63946`, texte blanc |
| Disabled | Fond gris `#D1D5DB`, texte gris `#9CA3AF`, cursor not-allowed |

### Inputs / Formulaires

- Border-radius `12px`
- Bordure `#E5E7EB`, focus bordure verte `#2D6A4F`
- Padding `12px 16px`
- Label au-dessus, texte gris foncé

---

## Pages

### Catalogue (`/`)

- Hero banner : fond vert foncé, texte blanc/orange, image produit vedette à droite
- Section catégories : icônes dans des carrés arrondis crème
- Grille produits : 2 colonnes mobile, 3 desktop, gap `24px`
- Barre recherche : fond blanc, icône loupe, border-radius `12px`
- Filtre catégorie : dropdown ou chips horizontaux

### Panier (`/panier`)

- Liste produits : ligne avec image miniature (60px), nom, prix unitaire, sélecteur quantité +/−, prix total ligne, icône poubelle
- Séparateur fin entre lignes
- Récapitulatif en bas ou sidebar : sous-total, livraison (gratuite ou €), **total** en gras
- Bouton "Passer la commande" : pleine largeur, vert

### Commande (`/commande`)

- Formulaire centré, max-width `480px`
- Récapitulatif commande en dessous ou en sidebar
- Bouton "Valider" : pleine largeur, vert, avec loader au submit

### Historique (`/historique`)

- Liste de cartes commandes : numéro, date, statut (badge coloré), montant
- Statut badges : `pending` → orange, `confirmed` → vert, `cancelled` → rouge

### Login Admin (`/admin`)

- Formulaire centré, fond crème, carte blanche avec shadow
- Champ clé admin, bouton "Connexion"

### Dashboard Admin (`/admin/dashboard`)

- Layout deux colonnes : sidebar navigation gauche + contenu principal
- Tableau produits : colonnes nom / prix / stock / catégorie / actions
- Actions inline : bouton "Modifier" (gris), "Stock" (orange), "Supprimer" (rouge)
- Formulaire ajout produit : carte distincte en haut ou modal

---

## Responsive (mobile-first)

- Approche **mobile-first** avec Tailwind : classes de base pour mobile, préfixes `md:` et `lg:` pour desktop
- Grille catalogue : `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`
- Navbar mobile : menu hamburger, panier visible en icône
- Dashboard admin mobile : sidebar en drawer/overlay
- Formulaires : pleine largeur sur mobile, max-width `480px` centré sur desktop
- Hero banner : stacked vertical sur mobile, côte à côte sur desktop

---

## Page Produit (`/produit/:id`) — à ajouter plus tard

- Grande image produit (carousel si plusieurs photos)
- Nom, prix, note étoiles
- Sélecteur quantité +/−
- Bouton "Ajouter au panier" pleine largeur
- Description complète
- Section "Produits similaires" (même catégorie)
- Breadcrumb : Accueil > Catégorie > Nom produit

---

## Espacement & Layout

- Max-width contenu : `1280px`, centré avec `mx-auto px-4`
- Sections : padding vertical `48px` desktop, `32px` mobile
- Cards : padding `16px`
- Gap grille : `24px`

---

## Animations (légères)

- Hover carte produit : `translateY(-4px)` + shadow plus prononcée, transition `200ms`
- Bouton "Ajouter au panier" : scale `0.97` au clic
- Toast (react-hot-toast existant) : conservé

---

## Fichiers à modifier

| Fichier | Modification |
|---|---|
| `frontend/src/index.css` | Import Inter, variables CSS couleurs |
| `frontend/index.html` | Lien Google Fonts Inter |
| `frontend/src/components/Navbar.jsx` | Refonte visuelle complète |
| `frontend/src/components/ProductCard.jsx` | Refonte visuelle complète |
| `frontend/src/pages/Catalogue.jsx` | Hero banner + layout grille |
| `frontend/src/pages/Panier.jsx` | Liste produits + récapitulatif |
| `frontend/src/pages/Commande.jsx` | Formulaire centré |
| `frontend/src/pages/Historique.jsx` | Cartes commandes avec badges |
| `frontend/src/pages/AdminLogin.jsx` | Carte centrée |
| `frontend/src/pages/AdminDashboard.jsx` | Layout sidebar + tableaux |
