import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} from "../api/products";
import { getOrders, updateOrderStatus } from "../api/orders";
import { useProductFilters } from "../hooks/useProductFilters";
import { useOrderFilters } from "../hooks/useOrderFilters";
import { usePageTitle } from "../hooks/usePageTitle";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  category: "",
  image_url: "",
};

const STATUS_CONFIG = {
  pending:   { label: "En attente", classes: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmée",  classes: "bg-primary/10 text-primary-dark" },
  cancelled: { label: "Annulée",    classes: "bg-red-100 text-red-600" },
};

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${c.classes}`}>{c.label}</span>;
}

function InputField({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />
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

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [editingStockId, setEditingStockId] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [stockError, setStockError] = useState("");
  const [stockLoading, setStockLoading] = useState(false);

  const [newForm, setNewForm] = useState(EMPTY_FORM);
  const [newError, setNewError] = useState("");
  const [newLoading, setNewLoading] = useState(false);

  const {
    search, setSearch,
    filterCategory, setFilterCategory,
    filterStock, setFilterStock,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
    sortKey: productSortKey, sortDir: productSortDir,
    toggleSort: toggleProductSort,
    resetFilters: resetProductFilters,
    filtered: filteredProducts,
  } = useProductFilters(products);

  const {
    filterStatus, setFilterStatus,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortKey: orderSortKey, sortDir: orderSortDir,
    toggleSort: toggleOrderSort,
    resetFilters: resetOrderFilters,
    filtered: filteredOrders,
  } = useOrderFilters(orders);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products],
  );

  useEffect(() => {
    const key = sessionStorage.getItem("adminKey");
    if (!key) { navigate("/admin"); return; }
    setAdminKey(key);
    Promise.all([getProducts(), getOrders(key)])
      .then(([prods, ords]) => { setProducts(prods); setOrders(ords); })
      .catch((e) => setError(e.message || "Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const reloadProducts = async () => {
    try { setProducts(await getProducts()); }
    catch (e) { setError(e.message || "Erreur rechargement"); }
  };

  const handleLogout = () => { sessionStorage.removeItem("adminKey"); navigate("/admin"); };

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditForm({ name: product.name || "", description: product.description || "", price: product.price != null ? String(product.price) : "", category: product.category || "", image_url: product.image_url || "" });
    setEditError("");
    setEditingStockId(null);
  };
  const cancelEditing = () => { setEditingId(null); setEditForm({}); setEditError(""); };

  const handleEditSubmit = async (id) => {
    setEditLoading(true); setEditError("");
    try {
      await updateProduct(id, { name: editForm.name, description: editForm.description, price: parseFloat(editForm.price), category: editForm.category, image_url: editForm.image_url }, adminKey);
      setEditingId(null); setEditForm({});
      await reloadProducts();
    } catch (e) { setEditError(e.message || "Erreur modification"); }
    finally { setEditLoading(false); }
  };

  const startEditingStock = (product) => { setEditingStockId(product.id); setNewStock(String(product.stock)); setStockError(""); setEditingId(null); };
  const cancelEditingStock = () => { setEditingStockId(null); setNewStock(""); setStockError(""); };

  const handleStockSubmit = async (id) => {
    setStockLoading(true); setStockError("");
    try {
      await updateStock(id, parseInt(newStock, 10), adminKey);
      setEditingStockId(null); setNewStock("");
      await reloadProducts();
    } catch (e) { setStockError(e.message || "Erreur stock"); }
    finally { setStockLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    setError("");
    try { await deleteProduct(id, adminKey); await reloadProducts(); }
    catch (e) { setError(e.message || "Erreur suppression"); }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus, adminKey);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o)));
    } catch (err) { alert(err.message); }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault(); setNewLoading(true); setNewError("");
    try {
      await createProduct({ name: newForm.name, description: newForm.description, price: parseFloat(newForm.price), stock: parseInt(newForm.stock, 10) || 0, category: newForm.category, image_url: newForm.image_url }, adminKey);
      setNewForm(EMPTY_FORM);
      await reloadProducts();
    } catch (e) { setNewError(e.message || "Erreur création"); }
    finally { setNewLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-xs text-gray-400 mt-0.5">{products.length} produits · {orders.length} commandes</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition border border-gray-200 hover:border-red-200 px-4 py-2 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl shadow-sm p-1.5 w-fit">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === "products" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Produits ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${activeTab === "orders" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Commandes ({orders.length})
          </button>
        </div>

        {/* ===== PRODUITS ===== */}
        {activeTab === "products" && (
          <section className="space-y-6">
            {/* Filtres */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                <option value="">Toutes catégories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                <option value="all">Tout le stock</option>
                <option value="in">En stock</option>
                <option value="out">Rupture</option>
              </select>
              <input type="number" placeholder="Prix min" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-24 focus:outline-none" />
              <input type="number" placeholder="Prix max" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-24 focus:outline-none" />
              {(search || filterCategory || filterStock !== "all" || filterMinPrice || filterMaxPrice) && (
                <button onClick={resetProductFilters} className="text-xs text-red-400 hover:text-red-600 underline">Réinitialiser</button>
              )}
              <span className="text-xs text-gray-400 ml-auto">{filteredProducts.length}/{products.length}</span>
            </div>

            {/* Tableau produits */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[["name","Nom"],["category","Catégorie"],["price","Prix"],["stock","Stock"]].map(([key, label]) => (
                      <th key={key} onClick={() => toggleProductSort(key)} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                        {label} {productSortKey === key ? (productSortDir === "asc" ? "↑" : "↓") : ""}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-300 text-sm">Aucun produit</td></tr>
                  )}
                  {filteredProducts.map((product) => (
                    <Fragment key={product.id}>
                      <tr className="hover:bg-gray-50/50 transition">
                        <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                        <td className="px-4 py-3">
                          {product.category ? (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">{product.category}</span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{Number(product.price).toFixed(2)} €</td>
                        <td className="px-4 py-3">
                          {editingStockId === product.id ? (
                            <div className="flex items-center gap-2">
                              <input type="number" min="0" value={newStock} onChange={(e) => setNewStock(e.target.value)} className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                              <button onClick={() => handleStockSubmit(product.id)} disabled={stockLoading} className="text-xs bg-primary hover:bg-primary-dark text-white px-2.5 py-1 rounded-lg disabled:opacity-50">OK</button>
                              <button onClick={cancelEditingStock} className="text-xs text-gray-400 hover:text-gray-600">Annuler</button>
                              {stockError && <span className="text-red-400 text-xs">{stockError}</span>}
                            </div>
                          ) : (
                            <span className={`font-semibold ${product.stock === 0 ? "text-red-400" : "text-gray-800"}`}>{product.stock}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => editingId === product.id ? cancelEditing() : startEditing(product)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition">
                              {editingId === product.id ? "Annuler" : "Modifier"}
                            </button>
                            <button onClick={() => editingStockId === product.id ? cancelEditingStock() : startEditingStock(product)} className="text-xs bg-accent/10 hover:bg-accent/20 text-accent-dark px-3 py-1.5 rounded-lg transition">
                              Stock
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg transition">
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>

                      {editingId === product.id && (
                        <tr className="bg-primary/5">
                          <td colSpan={5} className="px-4 py-5">
                            <div className="max-w-2xl">
                              <h3 className="font-semibold text-gray-700 mb-4 text-sm">Modifier le produit</h3>
                              {editError && <p className="text-red-500 text-xs mb-3">{editError}</p>}
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Nom" required type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                <InputField label="Prix" required type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                                <InputField label="Catégorie" type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                                <InputField label="URL image" type="text" value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} />
                                <div className="col-span-2">
                                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                                  <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" />
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <button onClick={() => handleEditSubmit(product.id)} disabled={editLoading} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 transition">
                                  {editLoading ? "Enregistrement..." : "Enregistrer"}
                                </button>
                                <button onClick={cancelEditing} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm transition">
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ajout produit */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-5">Ajouter un produit</h3>
              {newError && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{newError}</div>}
              <form onSubmit={handleNewSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Nom" required type="text" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} placeholder="Nom du produit" />
                  <InputField label="Prix" required type="number" step="0.01" min="0" value={newForm.price} onChange={(e) => setNewForm({ ...newForm, price: e.target.value })} placeholder="0.00" />
                  <InputField label="Stock" type="number" min="0" value={newForm.stock} onChange={(e) => setNewForm({ ...newForm, stock: e.target.value })} placeholder="0" />
                  <InputField label="Catégorie" type="text" value={newForm.category} onChange={(e) => setNewForm({ ...newForm, category: e.target.value })} placeholder="ex : électronique" />
                  <div className="md:col-span-2">
                    <InputField label="URL image" type="text" value={newForm.image_url} onChange={(e) => setNewForm({ ...newForm, image_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                    <textarea rows={3} value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} placeholder="Description du produit..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={newLoading} className="mt-5 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition">
                  {newLoading ? "Ajout en cours..." : "Ajouter le produit"}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* ===== COMMANDES ===== */}
        {activeTab === "orders" && (
          <section className="space-y-6">
            {/* Filtres commandes */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-wrap gap-3 items-center">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="cancelled">Annulée</option>
              </select>
              <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              {(filterStatus !== "all" || filterDateFrom || filterDateTo) && (
                <button onClick={resetOrderFilters} className="text-xs text-red-400 hover:text-red-600 underline">Réinitialiser</button>
              )}
              <span className="text-xs text-gray-400 ml-auto">{filteredOrders.length}/{orders.length}</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th onClick={() => toggleOrderSort("id")} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                      ID {orderSortKey === "id" ? (orderSortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th onClick={() => toggleOrderSort("status")} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                      Statut {orderSortKey === "status" ? (orderSortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                    <th onClick={() => toggleOrderSort("created_at")} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none">
                      Date {orderSortKey === "created_at" ? (orderSortDir === "asc" ? "↑" : "↓") : ""}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-300 text-sm">Aucune commande</td></tr>
                  )}
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{order.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{order.customer_name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{order.customer_email}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
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
    </div>
  );
}
