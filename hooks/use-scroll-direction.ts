"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const update = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      setScrolled(currentY > 10);

      // Aşağı gidince gizle, yukarı gelince göster
      if (Math.abs(diff) > 5) {
        setVisible(diff < 0 || currentY < 60);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return { scrolled, visible };
}
