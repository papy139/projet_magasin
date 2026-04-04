import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts } from "../api/products";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Vérification stock au mount
  useEffect(() => {
    if (items.length === 0) return;

    getProducts()
      .then((products) => {
        setItems((prev) => {
          const updated = prev.filter((item) => {
            const fresh = products.find((p) => p.id === item.product.id);
            if (!fresh || fresh.stock === 0) {
              toast.error(`"${item.product.name}" retiré : rupture de stock`);
              return false;
            }
            return true;
          });
          return updated;
        });
      })
      .catch(() => {
        // Fail silently — on garde les items sans vérification
      });
  }, []);

  const addToCart = (product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prevItems;
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const value = {
    items,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
