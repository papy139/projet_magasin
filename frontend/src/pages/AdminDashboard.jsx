import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, updateProduct, updateStock, deleteProduct } from "../api/products";
import { getOrders, updateOrderStatus } from "../api/orders";
import { useProductFilters } from "../hooks/useProductFilters";
import { useOrderFilters } from "../hooks/useOrderFilters";
import { usePageTitle } from "../hooks/usePageTitle";
import ProductModal from "../components/admin/ProductModal";
import StatusBadge from "../components/StatusBadge";

function StatCard({ label, value, sub, color = "text-gray-900" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  usePageTitle("Dashboard Admin");
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null); // null = new, object = edit
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Stock inline
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [stockLoading, setStockLoading] = useState(false);

  // Suppression avec confirmation inline
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { search, setSearch, filterCategory, setFilterCategory, filterStock, setFilterStock,
    filterMinPrice, setFilterMinPrice, filterMaxPrice, setFilterMaxPrice,
    sortKey: pSortKey, sortDir: pSortDir, toggleSort: togglePSort,
    resetFilters: resetPFilters, filtered: filteredProducts,
  } = useProductFilters(products);

  const { filterStatus, setFilterStatus, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo,
    sortKey: oSortKey, sortDir: oSortDir, toggleSort: toggleOSort,
    resetFilters: resetOFilters, filtered: filteredOrders,
  } = useOrderFilters(orders);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  useEffect(() => {
    const key = sessionStorage.getItem("adminKey");
    if (!key) { navigate("/admin"); return; }
    setAdminKey(key);
    Promise.all([getProducts(), getOrders(key)])
      .then(([prods, ords]) => { setProducts(prods); setOrders(ords); })
      .catch((e) => setError(e.message || "Erreur chargement"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const reloadProducts = async () => {
    try { setProducts(await getProducts()); }
    catch (e) { setError(e.message); }
  };

  const handleLogout = () => { sessionStorage.removeItem("adminKey"); navigate("/admin"); };

  // Modal submit (add ou edit)
  const handleModalSubmit = async (data) => {
    setModalLoading(true); setModalError("");
    try {
      if (modalProduct) {
        await updateProduct(modalProduct.id, data, adminKey);
        if (data.stock !== undefined && data.stock !== modalProduct.stock) {
          await updateStock(modalProduct.id, data.stock, adminKey);
        }
      } else {
        await createProduct(data, adminKey);
      }
      setModalOpen(false);
      await reloadProducts();
    } catch (e) {
      setModalError(e.message || "Erreur");
    } finally {
      setModalLoading(false);
    }
  };

  // Stock inline
  const handleStockSubmit = async (id) => {
    setStockLoading(true);
    try {
      await updateStock(id, parseInt(newStock, 10), adminKey);
      setEditingStockId(null);
      await reloadProducts();
    } catch (e) { setError(e.message); }
    finally { setStockLoading(false); }
  };

  // Suppression
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id, adminKey);
      setDeleteConfirmId(null);
      await reloadProducts();
    } catch (e) { setError(e.message); }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus, adminKey);
      setOrders((prev) => prev.map((o) => o.id === updated.id ? { ...o, status: updated.status } : o));
    } catch (err) { setError(err.message); }
  };

  const outOfStock = products.filter((p) => p.stock === 0).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition border border-gray-200 hover:border-red-200 px-4 py-2 rounded-xl">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex justify-between">
            {error}
            <button onClick={() => setError("")} aria-label="Fermer l'erreur" className="text-red-400 hover:text-red-600 ml-4">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Produits" value={products.length} sub={`${categories.length} catégorie${categories.length !== 1 ? "s" : ""}`} />
          <StatCard label="Ruptures" value={outOfStock} color={outOfStock > 0 ? "text-red-500" : "text-gray-900"} sub="stocks à zéro" />
          <StatCard label="Commandes" value={orders.length} />
          <StatCard label="En attente" value={pendingOrders} color={pendingOrders > 0 ? "text-amber-500" : "text-gray-900"} sub="à traiter" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-2xl shadow-sm p-1.5 w-fit">
          {[["products","Produits"], ["orders","Commandes"]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === key ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {label} ({key === "products" ? products.length : orders.length})
            </button>
          ))}
        </div>

        {/* ===== PRODUITS ===== */}
        {activeTab === "products" && (
          <section className="space-y-4">
            {/* Barre filtres + bouton ajout */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-44">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none appearance-none bg-white">
                <option value="">Toutes catégories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none appearance-none bg-white">
                <option value="all">Tout stock</option>
                <option value="in">En stock</option>
                <option value="out">Rupture</option>
              </select>
              <input type="number" placeholder="Prix min" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-24 focus:outline-none" />
              <input type="number" placeholder="Prix max" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-24 focus:outline-none" />
              {(search || filterCategory || filterStock !== "all" || filterMinPrice || filterMaxPrice) && (
                <button onClick={resetPFilters} className="text-xs text-red-400 hover:text-red-600 underline">Réinitialiser</button>
              )}
              <span className="text-xs text-gray-400">{filteredProducts.length}/{products.length}</span>
              <button onClick={() => { setModalProduct(null); setModalError(""); setModalOpen(true); }}
                className="ml-auto flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un produit
              </button>
            </div>

            {/* Tableau */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-12"></th>
                    {[["name","Nom"],["category","Catégorie"],["price","Prix"],["stock","Stock"]].map(([key, label]) => (
                      <th key={key} onClick={() => togglePSort(key)} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                        {label} {pSortKey === key ? (pSortDir === "asc" ? "↑" : "↓") : ""}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-300 text-sm">Aucun produit</td></tr>
                  )}
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                      {/* Vignette */}
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {product.image_url
                            ? <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                              </div>
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                      <td className="px-4 py-3">
                        {product.category
                          ? <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">{product.category}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{Number(product.price).toFixed(2)} €</td>
                      <td className="px-4 py-3">
                        {editingStockId === product.id ? (
                          <div className="flex items-center gap-2">
                            <input type="number" min="0" value={newStock} onChange={(e) => setNewStock(e.target.value)}
                              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            <button onClick={() => handleStockSubmit(product.id)} disabled={stockLoading}
                              className="text-xs bg-primary hover:bg-primary-dark text-white px-2.5 py-1.5 rounded-lg disabled:opacity-50">OK</button>
                            <button onClick={() => setEditingStockId(null)} aria-label="Annuler la modification du stock" className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingStockId(product.id); setNewStock(String(product.stock)); setDeleteConfirmId(null); }}
                            className={`font-semibold text-sm hover:underline ${product.stock === 0 ? "text-red-400" : "text-gray-800"}`}>
                            {product.stock}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Supprimer ?</span>
                            <button onClick={() => handleDelete(product.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded-lg transition">Oui</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2.5 py-1.5 rounded-lg">Non</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setModalProduct(product); setModalError(""); setModalOpen(true); setDeleteConfirmId(null); setEditingStockId(null); }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition">Modifier</button>
                            <button onClick={() => { setDeleteConfirmId(product.id); setEditingStockId(null); }}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition">Supprimer</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ===== COMMANDES ===== */}
        {activeTab === "orders" && (
          <section className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none appearance-none bg-white">
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="cancelled">Annulée</option>
              </select>
              <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              {(filterStatus !== "all" || filterDateFrom || filterDateTo) && (
                <button onClick={resetOFilters} className="text-xs text-red-400 hover:text-red-600 underline">Réinitialiser</button>
              )}
              <span className="text-xs text-gray-400 ml-auto">{filteredOrders.length}/{orders.length}</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[["id","ID"],["created_at","Date"]].map(([key, label]) => (
                      <th key={key} onClick={() => toggleOSort(key)} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                        {label} {oSortKey === key ? (oSortDir === "asc" ? "↑" : "↓") : ""}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th onClick={() => toggleOSort("status")} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                      Statut {oSortKey === "status" ? (oSortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-300 text-sm">Aucune commande</td></tr>
                  )}
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{order.id}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{order.customer_name}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{order.customer_email}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3">
                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Modal produit */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalProduct}
        categories={categories}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
}
