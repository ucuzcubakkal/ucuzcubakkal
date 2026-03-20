"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, X, ArrowRight, Tag } from "lucide-react";

// ── Arama havuzu — tüm kategori alt öğelerinden oluşur ───────────────────────
const SEARCH_INDEX: { label: string; type: "category" | "product" | "tag"; href: string }[] = [
  // Kategoriler
  { label: "El Sanatlari",        type: "category", href: "/kategori/el-sanatlari" },
  { label: "Dijital & RWA",       type: "category", href: "/kategori/dijital-rwa" },
  { label: "Teknoloji & Mining",  type: "category", href: "/kategori/teknoloji-mining" },
  { label: "Giyim & Moda",        type: "category", href: "/kategori/giyim-aksesuar" },
  { label: "Ev & Yasam",          type: "category", href: "/kategori/ev-dekorasyonu" },
  { label: "Dogal & Organik",     type: "category", href: "/kategori/dogal-organik" },
  { label: "Elektronik",          type: "category", href: "/kategori/elektronik" },
  { label: "Spor & Outdoor",      type: "category", href: "/kategori/spor" },
  { label: "Kitap & Hobi",        type: "category", href: "/kategori/kitap" },
  { label: "Anne & Bebek",        type: "category", href: "/kategori/bebek" },
  { label: "Mucevher & Saat",     type: "category", href: "/kategori/mucevher" },
  // Popüler ürün önerileri
  { label: "El yapımı seramik kupa",      type: "product", href: "/ara?q=seramik+kupa" },
  { label: "Organik zeytinyağı sabunu",   type: "product", href: "/ara?q=zeytinyagi+sabun" },
  { label: "El dokuma kilim",             type: "product", href: "/ara?q=el+dokuma+kilim" },
  { label: "Bakır telkari küpe",          type: "product", href: "/ara?q=telkari+kupe" },
  { label: "Raspberry Pi node kiti",      type: "product", href: "/ara?q=raspberry+pi+kit" },
  { label: "Online kurs Pi development",  type: "product", href: "/ara?q=online+kurs+pi" },
  { label: "Ledger hardware wallet",      type: "product", href: "/ara?q=ledger+wallet" },
  { label: "Güneş paneli ev sistemi",     type: "product", href: "/ara?q=gunes+paneli" },
  { label: "Makramé duvar süsü",          type: "product", href: "/ara?q=makrame" },
  { label: "Doğal balmumu mum seti",      type: "product", href: "/ara?q=balmumu+mum" },
  { label: "Spor ayakkabı",              type: "product", href: "/ara?q=spor+ayakkabi" },
  { label: "Akıllı saat",                type: "product", href: "/ara?q=akilli+saat" },
  // Etiketler
  { label: "handmade",    type: "tag", href: "/ara?tag=handmade" },
  { label: "pi ekosistemi", type: "tag", href: "/ara?tag=pi-ekosistemi" },
  { label: "organik",     type: "tag", href: "/ara?tag=organik" },
  { label: "indirim",     type: "tag", href: "/ara?tag=indirim" },
];

const TRENDING: string[] = [
  "El yapımı seramik",
  "Pi node ekipmanı",
  "Organik sabun",
  "Kilim",
  "Online kurs",
  "Telkari takı",
  "Güneş paneli",
  "Makramé",
];

// ── Türkçe karakterleri normalize eder ──────────────────────────────────────
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
}

// ── Levenshtein edit distance (fuzzy match) ──────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── Fuzzy score: substring match > starts-with > low edit distance ───────────
function fuzzyScore(query: string, candidate: string): number {
  const q = normalize(query.trim());
  const c = normalize(candidate);
  if (!q) return 0;
  if (c.includes(q)) return 100 - c.indexOf(q); // substring: higher = earlier match
  // word-level: any word starts with query?
  if (c.split(" ").some((w) => w.startsWith(q))) return 60;
  // edit distance on first word
  const firstWord = c.split(" ")[0];
  const dist = levenshtein(q, firstWord.slice(0, q.length + 2));
  if (dist <= 2) return 40 - dist * 10;
  return 0;
}

type SmartSearchProps = {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SmartSearch({ className = "", placeholder = "Ürün, marka veya kategori ara...", autoFocus = false }: SmartSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Suggestions: fuzzy-filtered and sorted
  const suggestions = query.trim().length >= 1
    ? SEARCH_INDEX
        .map((item) => ({ ...item, score: fuzzyScore(query, item.label) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
    : [];

  const showTrending = query.trim().length === 0 && open;
  const showSuggestions = suggestions.length > 0 && open;

  const handleSubmit = useCallback(
    (value?: string) => {
      const q = (value ?? query).trim();
      if (!q) return;
      setOpen(false);
      router.push(`/ara?q=${encodeURIComponent(q)}`);
    },
    [query, router]
  );

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard navigation
  const listLength = showTrending ? TRENDING.length : suggestions.length;
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((p) => Math.min(p + 1, listLength - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0) {
        if (showTrending) handleSubmit(TRENDING[activeIdx]);
        else handleSelect(suggestions[activeIdx].href);
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const typeIcon = (type: string) => {
    if (type === "category") return <Tag className="h-3.5 w-3.5 text-primary flex-shrink-0" />;
    if (type === "tag")      return <Tag className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />;
    return <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />;
  };

  const typeLabel = (type: string) => {
    if (type === "category") return "Kategori";
    if (type === "tag")      return "Etiket";
    return "Ürün";
  };

  // Highlight matched portion in suggestion label
  function highlight(label: string, q: string) {
    if (!q.trim()) return <span>{label}</span>;
    const norm = normalize(label);
    const idx = norm.indexOf(normalize(q.trim()));
    if (idx === -1) return <span>{label}</span>;
    return (
      <span>
        {label.slice(0, idx)}
        <mark className="bg-primary/20 text-primary font-semibold rounded-sm px-0.5">
          {label.slice(idx, idx + q.length)}
        </mark>
        {label.slice(idx + q.length)}
      </span>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="relative flex"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="search"
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-24 h-10 bg-muted border-muted focus-visible:ring-primary focus-visible:border-primary"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-[72px] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Temizle"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <Button type="submit" size="sm" className="absolute right-0 top-0 h-10 rounded-l-none px-4">
          <Search className="h-4 w-4" />
          <span className="sr-only">Ara</span>
        </Button>
      </form>

      {/* Dropdown */}
      {(showTrending || showSuggestions) && (
        <div
          className="absolute top-full mt-1 left-0 right-0 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-fade-in"
          role="listbox"
        >
          {/* Trending terms — shown when input is empty */}
          {showTrending && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  En Çok Arananlar
                </span>
              </div>
              <ul>
                {TRENDING.map((term, i) => (
                  <li key={term}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={activeIdx === i}
                      onClick={() => handleSubmit(term)}
                      onMouseEnter={() => setActiveIdx(i)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                        activeIdx === i ? "bg-accent text-accent-foreground" : "hover:bg-muted/60"
                      }`}
                    >
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1">{term}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fuzzy autocomplete suggestions */}
          {showSuggestions && (
            <div>
              <div className="flex items-center justify-between gap-1.5 px-3 py-2 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Öneriler
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{suggestions.length} sonuç</span>
              </div>
              <ul>
                {suggestions.map((item, i) => (
                  <li key={item.href + i}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={activeIdx === i}
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setActiveIdx(i)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                        activeIdx === i ? "bg-accent text-accent-foreground" : "hover:bg-muted/60"
                      }`}
                    >
                      {typeIcon(item.type)}
                      <span className="flex-1 truncate">{highlight(item.label, query)}</span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{typeLabel(item.type)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {/* Tam arama bağlantısı */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary border-t border-border hover:bg-muted/50 transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">
                  &ldquo;<strong>{query}</strong>&rdquo; için tüm sonuçları gör
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Fuzzy düzeltme bildirimi */}
          {query.trim().length >= 3 && suggestions.length > 0 && (() => {
            const topScore = suggestions[0].score;
            // Eğer sadece edit-distance ile bulduysa (score < 60) → yazım düzeltme bildirimi
            if (topScore < 60 && topScore > 0) {
              return (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border-t border-border text-xs text-amber-700 dark:text-amber-400">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  Yazım hatası mı? Benzer sonuçlar gösteriliyor.
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
}
