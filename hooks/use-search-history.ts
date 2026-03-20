"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "search_history";
const MAX_HISTORY = 8;

const POPULAR_SEARCHES = [
  "El dokuma kilim", "Seramik vazo", "Ahşap tepsi", "Gümüş kolye",
  "Keten çanta", "Doğal taş bileklik", "Cam vazo", "El işlemesi",
];

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const addSearch = (query: string) => {
    if (!query.trim()) return;
    setHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, MAX_HISTORY);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const removeSearch = (query: string) => {
    setHistory((prev) => {
      const updated = prev.filter((q) => q !== query);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return { history, addSearch, removeSearch, clearHistory, popularSearches: POPULAR_SEARCHES };
}
