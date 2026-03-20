"use client";

import { useState, useEffect } from "react";

type ViewedProduct = {
  id: string;
  name: string;
  artisan_name: string;
  price: number;
  images: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  stock: number;
};

const STORAGE_KEY = "recently_viewed";
const MAX_ITEMS = 6;

export function useRecentlyViewed() {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const addProduct = (product: ViewedProduct) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAll = () => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return { items, addProduct, clearAll };
}
