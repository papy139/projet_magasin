const BASE = import.meta.env.VITE_API_URL;

export async function createOrder(data) {
  const res = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.error);
  }
  return res.json();
}

export async function getOrders(adminKey) {
  const res = await fetch(`${BASE}/api/orders`, {
    headers: { "x-admin-key": adminKey },
  });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.error);
  }
  return res.json();
}

export async function getOrdersByEmail(email) {
  const res = await fetch(`${BASE}/api/orders/by-email?email=${encodeURIComponent(email)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erreur lors de la récupération des commandes');
  }
  return res.json();
}

export async function updateOrderStatus(orderId, status, adminKey) {
  const res = await fetch(`${BASE}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erreur lors de la mise à jour du statut');
  }
  return res.json();
}
