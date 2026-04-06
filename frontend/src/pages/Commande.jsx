import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import toast from "react-hot-toast";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Commande() {
  usePageTitle("Commande");
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [customer_name, setCustomerName] = useState("");
  const [customer_email, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  useEffect(() => {
    if (items.length === 0 && !orderConfirmed) {
      navigate("/panier");
    }
  }, [items, orderConfirmed, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const orderData = {
        customer_name,
        customer_email,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      };

      const response = await createOrder(orderData);
      clearCart();
      const history = JSON.parse(localStorage.getItem("order_history") || "[]");
      history.push({
        id: response.id,
        date: new Date().toISOString(),
        status: response.status || "pending",
        customer_name,
        customer_email,
      });
      localStorage.setItem("order_history", JSON.stringify(history));
      setOrderConfirmed(response);
      toast.success(`Commande #${response.id} confirmée !`);
    } catch (err) {
      setError(err.message || "Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Commande confirmée !
          </h2>
          <p className="text-gray-500 mb-5">
            Merci pour votre achat,{" "}
            <span className="font-semibold text-gray-700">
              {orderConfirmed.customer_name}
            </span>
            .
          </p>
          <div className="bg-cream rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">Numéro de commande</p>
            <p className="text-3xl font-bold text-gray-900 font-mono">
              #{orderConfirmed.id}
            </p>
          </div>
          <p className="text-sm text-gray-400 mb-7">
            Un récapitulatif a été envoyé à{" "}
            <span className="font-medium text-gray-600">
              {orderConfirmed.customer_email}
            </span>
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Passage de commande
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Formulaire */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">
                Vos informations
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customer_name}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={customer_email}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    placeholder="jean@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Traitement...
                    </>
                  ) : (
                    "Confirmer la commande"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Résumé */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Résumé
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <div className="min-w-0 mr-2">
                      <p className="font-medium text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-gray-400 text-xs">× {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 shrink-0">
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {total.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
