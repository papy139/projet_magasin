import { createContext, useContext, useState } from 'react';
const CartContext = createContext();
export function CartProvider({ children }) {
  return <CartContext.Provider value={{ items: [], itemCount: 0, total: 0, addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {} }}>{children}</CartContext.Provider>;
}
export function useCart() { return useContext(CartContext); }
