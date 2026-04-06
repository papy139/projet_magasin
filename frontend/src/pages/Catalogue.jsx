import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { usePageTitle } from "../hooks/usePageTitle";
import SkeletonCard from "../components/SkeletonCard";

const PAGE_SIZE = 12;

const CATEGORY_CONFIG = {
  Toutes: { emoji: "🛍️", activeBg: "bg-gray-800", activeText: "text-white", idleBg: "bg-gray-100", idleText: "text-gray-700", idleBorder: "border-gray-200" },
  Électronique: { emoji: "📱", activeBg: "bg-blue-600", activeText: "text-white", idleBg: "bg-blue-50", idleText: "text-blue-700", idleBorder: "border-blue-200" },
  Vêtements: { emoji: "👕", activeBg: "bg-purple-600", activeText: "text-white", idleBg: "bg-purple-50", idleText: "text-purple-700", idleBorder: "border-purple-200" },
  Maison: { emoji: "🏠", activeBg: "bg-amber-500", activeText: "text-white", idleBg: "bg-amber-50", idleText: "text-amber-700", idleBorder: "border-amber-200" },
  Sport: { emoji: "🏃", activeBg: "bg-green-600", activeText: "text-white", idleBg: "bg-green-50", idleText: "text-green-700", idleBorder: "border-green-200" },
  Livres: { emoji: "📚", activeBg: "bg-yellow-500", activeText: "text-white", idleBg: "bg-yellow-50", idleText: "text-yellow-700", idleBorder: "border-yellow-200" },
  Jardin: { emoji: "🌱", activeBg: "bg-lime-600", activeText: "text-white", idleBg: "bg-lime-50", idleText: "text-lime-700", idleBorder: "border-lime-200" },
  Beauté: { emoji: "✨", activeBg: "bg-pink-500", activeText: "text-white", idleBg: "bg-pink-50", idleText: "text-pink-700", idleBorder: "border-pink-200" },
};
const DEFAULT_CAT = { emoji: "📦", activeBg: "bg-gray-600", activeText: "text-white", idleBg: "bg-gray-100", idleText: "text-gray-600", idleBorder: "border-gray-200" };

export default function Catalogue() {
  usePageTitle("Catalogue");
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState("newest");
  const sentinelRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) =>
        toast.error(err.message || "Impossible de charger les produits"),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category, sortBy]);

  const categories = [
    "Toutes",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesCategory =
        category === "" ||
        category === "Toutes" ||
        product.category === category;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];
    if (sortBy === "price_asc")
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_desc")
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortBy === "stock_desc")
      sorted.sort((a, b) => Number(b.stock) - Number(a.stock));
    else if (sortBy === "popular")
      sorted.sort((a, b) => Number(b.total_sold) - Number(a.total_sold));

    return sorted;
  }, [products, search, category, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleSentinel = useCallback((entries) => {
    if (entries[0].isIntersecting) {
      setVisibleCount((n) => n + PAGE_SIZE);
    }
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(handleSentinel, {
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, handleSentinel]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`"${product.name}" ajouté au panier`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Banner */}
      <div className="bg-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-block bg-accent/20 text-accent text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Offre du moment
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Votre boutique en ligne,{" "}
              <span className="text-accent">simple et rapide</span>
            </h1>
            <p className="text-green-100 text-base md:text-lg mb-6">
              Découvrez notre sélection de produits soigneusement choisis.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("catalogue-grid")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-150"
            >
              Explorer le catalogue
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center justify-center w-64 h-64 rounded-2xl bg-primary/40 shrink-0">
            <svg
              className="w-32 h-32 text-primary-light/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Rechercher
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Nom ou description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition appearance-none bg-white"
              >
                <option value="newest">Nouveautés</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="stock_desc">Stock disponible</option>
                <option value="popular">Les plus achetés</option>
              </select>
            </div>
          </div>

          {/* Pills catégories */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Catégorie
            </label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => {
                const conf = CATEGORY_CONFIG[cat] || DEFAULT_CAT;
                const isActive =
                  (cat === "Toutes" && category === "") || cat === category;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === "Toutes" ? "" : cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? `${conf.activeBg} ${conf.activeText} border-transparent shadow-sm scale-105`
                        : `${conf.idleBg} ${conf.idleText} ${conf.idleBorder} hover:scale-105 hover:shadow-sm`
                    }`}
                  >
                    <span>{conf.emoji}</span>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Résultat count */}
        {!loading && (
          <p className="text-sm text-gray-400 mb-4">
            {filteredProducts.length} produit
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Grille */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg
              className="w-12 h-12 text-gray-200 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div
              id="catalogue-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  rating={Number(product.rating)}
                  ratingCount={product.rating_count}
                  isFeatured={product.is_featured}
                />
              ))}
            </div>
            {hasMore && <div ref={sentinelRef} className="h-10 mt-6" />}
          </>
        )}
      </div>
    </div>
  );
}
