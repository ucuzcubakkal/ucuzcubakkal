"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  /** "icon" = yalnızca ikon buton (header), "full" = ikon + etiket (mobil menü) */
  variant?: "icon" | "full";
}

export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration uyuşmazlığını önle
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Button variant="ghost" size={variant === "icon" ? "icon" : "default"} disabled className="opacity-0" />;

  const isDark = resolvedTheme === "dark";

  if (variant === "full") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Açık moda geç" : "Karanlık moda geç"}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium w-full text-left"
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Açık Mod</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-primary" />
            <span>Gece Modu</span>
          </>
        )}
        {/* Durum göstergesi */}
        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isDark ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          {isDark ? "Açık" : "Karanlık"}
        </span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Açık moda geç" : "Karanlık moda geç"}
      title={isDark ? "Açık moda geç" : "Karanlık moda geç"}
    >
      {isDark
        ? <Sun className="h-5 w-5 text-amber-500 transition-transform rotate-0" />
        : <Moon className="h-5 w-5 transition-transform rotate-0" />
      }
    </Button>
  );
}
