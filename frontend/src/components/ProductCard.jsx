import { Link } from "react-router-dom";

export default function ProductCard({
  product,
  onAddToCart,
  rating = 0,
  ratingCount = 0,
  isFeatured = false,
  viewMode = "grid",
}) {
  const isOutOfStock = product.stock === 0;
  const filledStars = Math.round(rating);

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-row">
        {/* Image */}
        <Link
          to={`/produit/${product.id}`}
          className="block relative w-36 shrink-0 bg-gray-100 overflow-hidden group"
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {isFeatured && (
            <span className="absolute top-2 left-2 bg-accent text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
              ⭐
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-1 items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Link to={`/produit/${product.id}`} className="hover:text-primary transition-colors">
              <h3 className="text-base font-semibold text-gray-900 leading-snug truncate">
                {product.name}
              </h3>
            </Link>
            {rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < filledStars ? "text-accent text-sm" : "text-gray-200 text-sm"}>★</span>
                ))}
                <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
              </div>
            )}
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">
              {product.description || "Pas de description disponible"}
            </p>
            <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${isOutOfStock ? "bg-red-100 text-red-600" : "bg-green-50 text-primary"}`}>
              {isOutOfStock ? "Rupture" : `Stock : ${product.stock}`}
            </span>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xl font-extrabold text-primary">
              {Number(product.price).toFixed(2)}<span className="text-sm font-medium text-gray-400"> €</span>
            </span>
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {!isOutOfStock && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              {isOutOfStock ? "Rupture" : "Ajouter"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === Vue grille (défaut) ===
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden flex flex-col group">
      {/* Image cliquable */}
      <Link
        to={`/produit/${product.id}`}
        className="block relative h-52 bg-gray-100 overflow-hidden"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

        {/* Badge featured */}
        {isFeatured && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Coup de coeur
          </span>
        )}

        {/* Badge stock */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
            isOutOfStock
              ? "bg-red-100 text-red-700"
              : "bg-white/90 text-primary"
          }`}
        >
          {isOutOfStock ? "Rupture" : `Stock : ${product.stock}`}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/produit/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < filledStars ? "text-accent" : "text-gray-200"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {rating.toFixed(1)} ({ratingCount})
            </span>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {product.description || "Pas de description disponible"}
        </p>

        {/* Prix */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-extrabold text-primary">
            {Number(product.price).toFixed(2)}
            <span className="text-base font-medium text-gray-400"> €</span>
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          {!isOutOfStock && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
          {isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
