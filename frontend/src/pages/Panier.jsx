import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Panier() {
  usePageTitle("Panier");
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 mb-8">
              Explorez notre catalogue pour ajouter des produits à votre panier.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles du panier */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-6 p-6 border-b border-gray-200 last:border-b-0"
                >
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Image</span>
                      </div>
                    )}
                  </div>

                  {/* Détails du produit */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Prix unitaire : {formatPrice(item.product.price)}
                    </p>

                    {/* Quantité */}
                    <div className="flex items-center gap-4 mb-4">
                      <label
                        htmlFor={`qty-${item.product.id}`}
                        className="text-sm text-gray-600"
                      >
                        Quantité :
                      </label>
                      <input
                        id={`qty-${item.product.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.product.id, e.target.value)
                        }
                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Sous-total et bouton supprimer */}
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-900">
                        Sous-total :{" "}
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Résumé et actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé</h2>

              {/* Total */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">Total :</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(total)}
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/commande")}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Passer la commande
                </button>
                <button
                  onClick={clearCart}
                  className="w-full px-4 py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition"
                >
                  Vider le panier
                </button>
                <Link
                  to="/"
                  className="block text-center px-4 py-3 text-blue-600 font-semibold border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Continuer vos achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
