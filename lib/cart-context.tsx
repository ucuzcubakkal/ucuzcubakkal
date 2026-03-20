"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  id: string;
  productId: number;
  name: string;
  artisan: string;
  price: number;
  quantity: number;
  image: string;
  customizationNote?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ucuzcubakkal_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // localStorage erişim hatası
    }
  }, []);

  const saveToStorage = (newItems: CartItem[]) => {
    try {
      localStorage.setItem("ucuzcubakkal_cart", JSON.stringify(newItems));
    } catch {
      // localStorage erişim hatası
    }
  };

  const addItem = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        updated = [...prev, { ...item, id: String(Date.now()) }];
      }
      saveToStorage(updated);
      return updated;
    });
    toast({
      title: "Sepete Eklendi",
      description: `${item.name} sepetinize eklendi.`,
      duration: 2500,
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
      saveToStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem("ucuzcubakkal_cart");
    } catch {
      // localStorage erişim hatası
    }
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalıdır");
  return ctx;
}
