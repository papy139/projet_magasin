export default function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="h-48 bg-gray-300 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || 'Pas de description disponible'}
        </p>

        {/* Price and Stock Badge */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-gray-900">
            {Number(product.price).toFixed(2)}€
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              isOutOfStock
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isOutOfStock ? 'Rupture' : `En stock : ${product.stock}`}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded font-medium transition ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
