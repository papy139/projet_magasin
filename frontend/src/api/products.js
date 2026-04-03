const BASE = import.meta.env.VITE_API_URL;

export async function getProducts(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  const res = await fetch(`${BASE}/api/products?${params}`);
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Erreur chargement produits'); }
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${BASE}/api/products/${id}`);
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Produit introuvable'); }
  return res.json();
}

export async function createProduct(data, adminKey) {
  const res = await fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function updateProduct(id, data, adminKey) {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function updateStock(id, stock, adminKey) {
  const res = await fetch(`${BASE}/api/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ stock }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function deleteProduct(id, adminKey) {
  const res = await fetch(`${BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey },
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Erreur suppression'); }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
