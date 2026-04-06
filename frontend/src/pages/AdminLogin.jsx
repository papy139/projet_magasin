import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/orders";
import { usePageTitle } from "../hooks/usePageTitle";

export default function AdminLogin() {
  usePageTitle("Admin");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("adminKey")) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await getOrders(key);
      sessionStorage.setItem("adminKey", key);
      navigate("/admin/dashboard");
    } catch {
      setError("Clé incorrecte. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / icône */}
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Accès admin</h1>
        <p className="text-sm text-gray-400 text-center mb-7">Entrez votre clé pour accéder au dashboard.</p>

        <div className="bg-white rounded-2xl shadow-sm p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="key" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Clé admin
              </label>
              <input
                id="key"
                type="password"
                value={key}
                onChange={(e) => { setError(""); setKey(e.target.value); }}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Vérification..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
