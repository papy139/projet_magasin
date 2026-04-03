import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} from '../api/products';
import { getOrders } from '../api/orders';
import { useProductFilters } from '../hooks/useProductFilters';
import { useOrderFilters } from '../hooks/useOrderFilters';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '0',
  category: '',
  image_url: '',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState('');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Product editing
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Stock editing
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [stockError, setStockError] = useState('');
  const [stockLoading, setStockLoading] = useState(false);

  // New product form
  const [newForm, setNewForm] = useState(EMPTY_FORM);
  const [newError, setNewError] = useState('');
  const [newLoading, setNewLoading] = useState(false);

  const {
    search, setSearch,
    filterCategory, setFilterCategory,
    filterStock, setFilterStock,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
    sortKey: productSortKey,
    sortDir: productSortDir,
    toggleSort: toggleProductSort,
    resetFilters: resetProductFilters,
    filtered: filteredProducts,
  } = useProductFilters(products);

  const {
    filterStatus, setFilterStatus,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortKey: orderSortKey,
    sortDir: orderSortDir,
    toggleSort: toggleOrderSort,
    resetFilters: resetOrderFilters,
    filtered: filteredOrders,
  } = useOrderFilters(orders);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  // Auth guard + chargement initial
  useEffect(() => {
    const key = sessionStorage.getItem('adminKey');
    if (!key) {
      navigate('/admin');
      return;
    }
    setAdminKey(key);
    setError('');
    Promise.all([getProducts(), getOrders(key)])
      .then(([prods, ords]) => {
        setProducts(prods);
        setOrders(ords);
      })
      .catch((e) => setError(e.message || 'Erreur lors du chargement des données'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const reloadProducts = async () => {
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (e) {
      setError(e.message || 'Erreur lors du rechargement des produits');
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    navigate('/admin');
  };

  // Edit product
  const startEditing = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price != null ? String(product.price) : '',
      category: product.category || '',
      image_url: product.image_url || '',
    });
    setEditError('');
    setEditingStockId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
    setEditError('');
  };

  const handleEditSubmit = async (id) => {
    setEditLoading(true);
    setEditError('');
    try {
      await updateProduct(id, {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        category: editForm.category,
        image_url: editForm.image_url,
      }, adminKey);
      setEditingId(null);
      setEditForm({});
      await reloadProducts();
    } catch (e) {
      setEditError(e.message || 'Erreur lors de la modification');
    } finally {
      setEditLoading(false);
    }
  };

  // Edit stock
  const startEditingStock = (product) => {
    setEditingStockId(product.id);
    setNewStock(String(product.stock));
    setStockError('');
    setEditingId(null);
  };

  const cancelEditingStock = () => {
    setEditingStockId(null);
    setNewStock('');
    setStockError('');
  };

  const handleStockSubmit = async (id) => {
    setStockLoading(true);
    setStockError('');
    try {
      await updateStock(id, parseInt(newStock, 10), adminKey);
      setEditingStockId(null);
      setNewStock('');
      await reloadProducts();
    } catch (e) {
      setStockError(e.message || 'Erreur lors de la modification du stock');
    } finally {
      setStockLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    setError('');
    try {
      await deleteProduct(id, adminKey);
      await reloadProducts();
    } catch (e) {
      setError(e.message || 'Erreur lors de la suppression');
    }
  };

  // Create product
  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setNewLoading(true);
    setNewError('');
    try {
      await createProduct({
        name: newForm.name,
        description: newForm.description,
        price: parseFloat(newForm.price),
        stock: parseInt(newForm.stock, 10) || 0,
        category: newForm.category,
        image_url: newForm.image_url,
      }, adminKey);
      setNewForm(EMPTY_FORM);
      await reloadProducts();
    } catch (e) {
      setNewError(e.message || 'Erreur lors de la création');
    } finally {
      setNewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ===== SECTION PRODUITS ===== */}
        <section>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Produits ({filteredProducts.length}/{products.length})
            </h2>
            <input
              type="text"
              placeholder="Rechercher par nom, catégorie, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-48"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">Tout le stock</option>
              <option value="in">En stock</option>
              <option value="out">Rupture</option>
            </select>
            <input
              type="number"
              placeholder="Prix min"
              value={filterMinPrice}
              onChange={(e) => setFilterMinPrice(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
            />
            <input
              type="number"
              placeholder="Prix max"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
            />
            {(search || filterCategory || filterStock !== 'all' || filterMinPrice || filterMaxPrice) && (
              <button
                onClick={resetProductFilters}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Tableau produits */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th
                    onClick={() => toggleProductSort('name')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Nom {productSortKey === 'name' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() => toggleProductSort('category')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Catégorie {productSortKey === 'category' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() => toggleProductSort('price')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Prix {productSortKey === 'price' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    onClick={() => toggleProductSort('stock')}
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200"
                  >
                    Stock {productSortKey === 'stock' ? (productSortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">Aucun produit</td>
                  </tr>
                )}
                {filteredProducts.map((product) => (
                  <Fragment key={product.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                      <td className="px-4 py-3 text-gray-500">{product.category || '—'}</td>
                      <td className="px-4 py-3 text-gray-800">{Number(product.price).toFixed(2)} €</td>
                      <td className="px-4 py-3">
                        {editingStockId === product.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={newStock}
                              onChange={(e) => setNewStock(e.target.value)}
                              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                              onClick={() => handleStockSubmit(product.id)}
                              disabled={stockLoading}
                              className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                            >
                              OK
                            </button>
                            <button
                              onClick={cancelEditingStock}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Annuler
                            </button>
                            {stockError && <span className="text-red-500 text-xs">{stockError}</span>}
                          </div>
                        ) : (
                          <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => editingId === product.id ? cancelEditing() : startEditing(product)}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                          >
                            {editingId === product.id ? 'Annuler' : 'Modifier'}
                          </button>
                          <button
                            onClick={() => editingStockId === product.id ? cancelEditingStock() : startEditingStock(product)}
                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                          >
                            Stock
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Edit form inline */}
                    {editingId === product.id && (
                      <tr className="bg-blue-50">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="max-w-2xl">
                            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Modifier le produit</h3>
                            {editError && (
                              <p className="text-red-600 text-xs mb-2">{editError}</p>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Nom *</label>
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Prix *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editForm.price}
                                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Categorie</label>
                                <input
                                  type="text"
                                  value={editForm.category}
                                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">URL image</label>
                                <input
                                  type="text"
                                  value={editForm.image_url}
                                  onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-600 mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  value={editForm.description}
                                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleEditSubmit(product.id)}
                                disabled={editLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50 transition-colors"
                              >
                                {editLoading ? 'Enregistrement...' : 'Enregistrer'}
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm transition-colors"
                              >
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

          {/* Formulaire ajout produit */}
          <div className="bg-white rounded-xl shadow mt-6 p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Ajouter un produit</h3>
            {newError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-4 text-sm">
                {newError}
              </div>
            )}
            <form onSubmit={handleNewSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nom <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nom du produit"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Prix <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={newForm.price}
                    onChange={(e) => setNewForm({ ...newForm, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newForm.stock}
                    onChange={(e) => setNewForm({ ...newForm, stock: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Categorie</label>
                  <input
                    type="text"
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="ex : electronique"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">URL image</label>
                  <input
                    type="text"
                    value={newForm.image_url}
                    onChange={(e) => setNewForm({ ...newForm, image_url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newForm.description}
                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Description du produit..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={newLoading}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {newLoading ? 'Ajout en cours...' : 'Ajouter le produit'}
              </button>
            </form>
          </div>
        </section>

        {/* ===== SECTION COMMANDES ===== */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes ({orders.length})</h2>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">Aucune commande</td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">#{order.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{order.customer_name}</td>
                    <td className="px-4 py-3 text-gray-500">{order.customer_email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
