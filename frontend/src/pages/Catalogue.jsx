import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { usePageTitle } from "../hooks/usePageTitle";
import SkeletonCard from "../components/SkeletonCard";

const PAGE_SIZE = 12;

export default function Catalogue() {
  usePageTitle("Catalogue");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
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

  // Reset visibleCount quand les filtres changent
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
        (product.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "" || category === "Toutes" || product.category === category;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];
    if (sortBy === "price_asc") sorted.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_desc") sorted.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortBy === "stock_desc") sorted.sort((a, b) => Number(b.stock) - Number(a.stock));
    else if (sortBy === "popular") sorted.sort((a, b) => Number(b.total_sold) - Number(a.total_sold));

    return sorted;
  }, [products, search, category, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // IntersectionObserver pour le scroll infini
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Catalogue</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Catalogue</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom ou description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === "Toutes" ? "" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Nouveautés</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="stock_desc">Stock disponible</option>
                <option value="popular">Les plus achetés</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
