import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { getOrdersByEmail } from "../api/orders";

export default function Historique() {
  usePageTitle("Historique");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await getOrdersByEmail(email.trim());
      setOrders(data);
      setSearched(true);
    } catch (err) {
      setError(err.message || "Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
            En attente
          </span>
        );
      case "confirmed":
        return (
          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
            Confirmée
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
            Annulée
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Historique des commandes
        </h1>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email..."
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {searched && orders.length === 0 && !loading && (
          <p className="text-gray-600 text-lg">
            Aucune commande trouvée pour cet email.
          </p>
        )}

        {orders.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
