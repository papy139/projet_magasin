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
