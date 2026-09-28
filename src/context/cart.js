import { createContext, useContext } from "react";

export const CartContext = createContext(null);

export const TAX_RATE = 0.1; // GST 10%, same as the original site
export const MAX_QTY = 10;

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
