import { useCallback, useEffect, useMemo, useReducer } from "react";
import { CartContext, MAX_QTY, TAX_RATE } from "./cart.js";
import { useToast } from "./toast.js";
import { getProduct, productImage } from "../lib/catalog.js";
import { readJSON, writeJSON } from "../lib/storage.js";
import { roundMoney } from "../lib/format.js";

const STORAGE_KEY = "rbs.cart.v1";

// The cart only stores { id, qty }. Names, prices and images always come from
// the catalog, so a price change can never leave stale data in someone's cart.
function reducer(items, action) {
  switch (action.type) {
    case "add": {
      const existing = items.find((i) => i.id === action.id);
      if (existing) {
        return items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.qty) } : i));
      }
      return [...items, { id: action.id, qty: Math.min(MAX_QTY, action.qty) }];
    }
    case "setQty":
      if (action.qty <= 0) return items.filter((i) => i.id !== action.id);
      return items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i));
    case "remove":
      return items.filter((i) => i.id !== action.id);
    case "replace":
      return action.items;
    case "clear":
      return [];
    default:
      return items;
  }
}

function loadCart() {
  const saved = readJSON(STORAGE_KEY, []);
  return Array.isArray(saved) ? saved.filter((i) => getProduct(i.id) && i.qty > 0) : [];
}

export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadCart);
  const toast = useToast();

  useEffect(() => writeJSON(STORAGE_KEY, items), [items]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) dispatch({ type: "replace", items: loadCart() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback(
    (product, qty = 1, { silent = false } = {}) => {
      dispatch({ type: "add", id: product.id, qty });
      if (!silent) {
        toast.show({
          title: `${product.name} added to your cart`,
          message: qty > 1 ? `Quantity: ${qty}` : "Ready when you are.",
          image: productImage(product, "sm"),
          action: { label: "View cart", to: "/cart" },
        });
      }
    },
    [toast],
  );

  const setQty = useCallback((id, qty) => dispatch({ type: "setQty", id, qty }), []);
  const remove = useCallback((id) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const restore = useCallback((saved) => dispatch({ type: "replace", items: saved }), []);

  const value = useMemo(() => {
    const lines = items
      .map((i) => ({ ...i, product: getProduct(i.id) }))
      .filter((l) => l.product)
      .map((l) => ({ ...l, total: l.product.price * l.qty, compareTotal: l.product.compareAt * l.qty }));

    const subtotal = roundMoney(lines.reduce((s, l) => s + l.total, 0));
    const compareTotal = roundMoney(lines.reduce((s, l) => s + l.compareTotal, 0));
    const tax = roundMoney(subtotal * TAX_RATE);

    return {
      items,
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      compareTotal,
      savings: roundMoney(compareTotal - subtotal),
      tax,
      shipping: 0,
      total: roundMoney(subtotal + tax),
      add,
      setQty,
      remove,
      clear,
      restore,
    };
  }, [items, add, setQty, remove, clear, restore]);

  return <CartContext value={value}>{children}</CartContext>;
}
