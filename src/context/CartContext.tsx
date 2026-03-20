import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  material: string;
  price: number;
  qty: number;
  size: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (id: number, size: string, delta: number) => void;
  removeItem: (id: number, size: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id && i.size === newItem.size);
      if (existing) return prev.map((i) => i.id === newItem.id && i.size === newItem.size ? { ...i, qty: i.qty + newItem.qty } : i);
      return [...prev, newItem];
    });
  };

  const updateQty = (id: number, size: string, delta: number) => {
    setItems((prev) => prev.map((i) => i.id === id && i.size === size ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (id: number, size: string) => setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totalItems, subtotal }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
