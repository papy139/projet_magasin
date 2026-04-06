import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { getOrdersByEmail } from "../api/orders";

const STATUS_CONFIG = {
  pending:   { label: "En attente",  classes: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmée",   classes: "bg-primary/10 text-primary-dark" },
  cancelled: { label: "Annulée",     classes: "bg-red-100 text-red-600" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.classes}`}>
      {config.label}
    </span>
  );
}

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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes commandes</h1>
        <p className="text-gray-400 text-sm mb-8">Entrez votre email pour retrouver vos commandes.</p>

        {/* Formulaire recherche */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm p-5 mb-8">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Email
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@example.com"
              required
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl transition text-sm"
            >
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        {/* Résultats */}
        {searched && !loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 font-medium">Aucune commande trouvée pour cet email.</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">{orders.length} commande{orders.length !== 1 ? "s" : ""} trouvée{orders.length !== 1 ? "s" : ""}</p>
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-500">#{order.id}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{order.customer_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
