import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Panier() {
  usePageTitle("Panier");
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  const handleQuantityChange = (productId, newQuantity, stock) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity > 0 && quantity <= stock) {
      updateQuantity(productId, quantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-10 h-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Votre panier est vide
          </h1>
          <p className="text-gray-500 mb-7">
            Explorez notre catalogue pour ajouter des produits.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl shadow-sm p-5 flex gap-4"
              >
                {/* Image */}
                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {formatPrice(item.product.price)} / unité
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    {/* Sélecteur quantité */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity - 1,
                            item.product.stock,
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Diminuer la quantité"
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-gray-800 border-x border-gray-200 min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1,
                            item.product.stock,
                          )
                        }
                        disabled={item.quantity >= item.product.stock}
                        aria-label="Augmenter la quantité"
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-300 hover:text-red-400 transition"
                      aria-label="Supprimer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Sous-total */}
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-400 transition underline"
            >
              Vider le panier
            </button>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Récapitulatif
              </h2>

              <div className="space-y-2 mb-5">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm text-gray-500"
                  >
                    <span className="truncate mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/commande")}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
                >
                  Passer la commande
                </button>
                <Link
                  to="/"
                  className="block text-center py-3 text-primary font-semibold border border-primary/30 rounded-xl hover:bg-primary/5 transition text-sm"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
