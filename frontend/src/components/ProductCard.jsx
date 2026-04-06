export default function ProductCard({ product, onAddToCart, rating = 0, ratingCount = 0, isFeatured = false }) {
  const isOutOfStock = product.stock === 0;
  const filledStars = Math.round(rating);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

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
              : "bg-primary-light/20 text-primary-dark"
          }`}
        >
          {isOutOfStock ? "Rupture" : `Stock : ${product.stock}`}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug">
          {product.name}
        </h3>

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

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {product.description || "Pas de description disponible"}
        </p>

        {/* Price + Button */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {Number(product.price).toFixed(2)}
            <span className="text-base font-medium text-gray-500">€</span>
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          {isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
