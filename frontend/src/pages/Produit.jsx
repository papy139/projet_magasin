import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById, getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import ProductCard from "../components/ProductCard";

export default function Produit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageTitle(product ? product.name : "Produit");

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    getProductById(id)
      .then((p) => {
        setProduct(p);
        // Charger les produits similaires
        return getProducts().then((all) =>
          setRelated(
            all
              .filter((x) => x.id !== p.id && x.category === p.category)
              .slice(0, 3),
          ),
        );
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`"${product.name}" ajouté au panier (×${quantity})`);
  };

  const filledStars = product ? Math.round(Number(product.rating || 0)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-10">
        <div className="max-w-5xl mx-auto px-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-12 bg-gray-200 rounded-xl mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
          <h1 className="text-xl font-semibold text-gray-700 mb-2">Produit introuvable</h1>
          <p className="text-gray-400 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
          <Link to="/" className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-primary transition">Accueil</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition">
                {product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </nav>

        {/* Produit principal */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-gray-50 flex items-center justify-center min-h-72 md:min-h-96">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-24 h-24 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {product.is_featured && (
                <span className="absolute top-4 left-4 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Coup de coeur
                </span>
              )}
            </div>

            {/* Infos */}
            <div className="p-8 flex flex-col">
              {product.category && (
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  {product.category}
                </span>
              )}

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              {Number(product.rating) > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < filledStars ? "text-accent" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {Number(product.rating).toFixed(1)} ({product.rating_count} avis)
                  </span>
                </div>
              )}

              {/* Prix */}
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {Number(product.price).toFixed(2)}
                </span>
                <span className="text-lg text-gray-400">€</span>
              </div>

              {/* Stock badge */}
              <span className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold mb-5 ${
                isOutOfStock ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary-dark"
              }`}>
                {isOutOfStock ? "Rupture de stock" : `En stock : ${product.stock}`}
              </span>

              {/* Description */}
              {product.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Sélecteur quantité */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-600">Quantité</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition text-lg"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-semibold text-gray-800 border-x border-gray-200 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 rounded-xl font-semibold transition active:scale-95 ${
                    isOutOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark text-white"
                  }`}
                >
                  {isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 rounded-xl font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition text-sm"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={(prod) => {
                    addToCart(prod);
                    toast.success(`"${prod.name}" ajouté au panier`);
                  }}
                  rating={Number(p.rating)}
                  ratingCount={p.rating_count}
                  isFeatured={p.is_featured}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
