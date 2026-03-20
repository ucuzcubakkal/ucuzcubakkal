"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Star,
  SlidersHorizontal,
  X,
  Clock,
  TrendingUp,
  Truck,
  Shield,
  Heart,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronDown,
  Store,
} from "lucide-react";
import { Header } from "@/components/header";
import { SmartSearch } from "@/components/smart-search";
import { useCart } from "@/lib/cart-context";
import { useSearchHistory } from "@/hooks/use-search-history";

const SEED_PRODUCTS = [
  { id: "1", name: "Wireless Bluetooth Kulaklık Pro", seller: "TechStore", price: 89, originalPrice: 189, discount: 53, rating: 4.9, reviews: 2341, category: "elektronik", brand: "TechStore", freeShip: true, tag: "cok-satan" },
  { id: "2", name: "Kadın Yazlık Çiçek Elbise", seller: "FashionHub", price: 75, originalPrice: 120, discount: 38, rating: 4.7, reviews: 1876, category: "giyim-aksesuar", brand: "FashionHub", freeShip: true, tag: "indirim" },
  { id: "3", name: "Robot Süpürge Akıllı Haritalama", seller: "HomeBot", price: 299, originalPrice: 599, discount: 50, rating: 4.8, reviews: 4210, category: "ev-dekorasyonu", brand: "HomeBot", freeShip: true, tag: "flash" },
  { id: "4", name: "Erkek Spor Koşu Ayakkabısı", seller: "SportZone", price: 125, originalPrice: 249, discount: 50, rating: 4.8, reviews: 1543, category: "spor", brand: "SportZone", freeShip: false, tag: "indirim" },
  { id: "5", name: "Hakiki Deri Kadın El Çantası", seller: "LeatherCo", price: 149, originalPrice: 280, discount: 47, rating: 4.8, reviews: 1254, category: "giyim-aksesuar", brand: "LeatherCo", freeShip: true, tag: "cok-satan" },
  { id: "6", name: "Akıllı Saat Fitness GPS", seller: "SmartGear", price: 175, originalPrice: 320, discount: 45, rating: 4.9, reviews: 3102, category: "elektronik", brand: "SmartGear", freeShip: true, tag: "yeni" },
  { id: "7", name: "Yoga Matı Anti-Kayma", seller: "SportZone", price: 55, originalPrice: 75, discount: 27, rating: 4.7, reviews: 2109, category: "spor", brand: "SportZone", freeShip: false, tag: "indirim" },
  { id: "8", name: "Kahve Makinesi Tam Otomatik", seller: "KahveDünyası", price: 420, originalPrice: 599, discount: 30, rating: 4.9, reviews: 8743, category: "ev-dekorasyonu", brand: "KahveDünyası", freeShip: true, tag: "cok-satan" },
  { id: "9", name: "Erkek Slim Fit Takım Elbise", seller: "FashionHub", price: 210, originalPrice: 399, discount: 47, rating: 4.6, reviews: 943, category: "giyim-aksesuar", brand: "FashionHub", freeShip: true, tag: "indirim" },
  { id: "10", name: "Oyuncu Kulaklığı RGB 7.1", seller: "GamerZone", price: 199, originalPrice: 299, discount: 33, rating: 4.8, reviews: 2876, category: "elektronik", brand: "GamerZone", freeShip: false, tag: "yeni" },
  { id: "11", name: "Çocuk Ahşap Puzzle 500 Parça", seller: "KidsToys", price: 35, originalPrice: 55, discount: 36, rating: 4.9, reviews: 4521, category: "kitap", brand: "KidsToys", freeShip: true, tag: "yeni" },
  { id: "12", name: "Güneş Gözlüğü UV400 Polarize", seller: "OpticPlus", price: 75, originalPrice: 120, discount: 38, rating: 4.7, reviews: 1876, category: "giyim-aksesuar", brand: "OpticPlus", freeShip: false, tag: "indirim" },
  { id: "13", name: "Bluetooth Hoparlör Suya Dayanıklı", seller: "TechStore", price: 129, originalPrice: 199, discount: 35, rating: 4.8, reviews: 3240, category: "elektronik", brand: "TechStore", freeShip: true, tag: "cok-satan" },
  { id: "14", name: "Bebek Arabası 3'ü 1 Arada", seller: "KidsToys", price: 499, originalPrice: 799, discount: 38, rating: 4.9, reviews: 1240, category: "bebek", brand: "KidsToys", freeShip: true, tag: "yeni" },
  { id: "15", name: "Mutfak Robot Çok Fonksiyonlu", seller: "HomeBot", price: 350, originalPrice: 550, discount: 36, rating: 4.7, reviews: 2870, category: "ev-dekorasyonu", brand: "HomeBot", freeShip: true, tag: "cok-satan" },
  { id: "16", name: "Dağ Bisikleti 21 Vites", seller: "SportZone", price: 750, originalPrice: 1200, discount: 38, rating: 4.8, reviews: 654, category: "spor", brand: "SportZone", freeShip: false, tag: "indirim" },
];

const CATEGORIES = [
  { value: "tumu", label: "Tüm Kategoriler" },
  { value: "elektronik", label: "Elektronik" },
  { value: "giyim-aksesuar", label: "Giyim & Moda" },
  { value: "ev-dekorasyonu", label: "Ev & Yaşam" },
  { value: "spor", label: "Spor & Outdoor" },
  { value: "kitap", label: "Kitap & Hobi" },
  { value: "bebek", label: "Anne & Bebek" },
];

const BRANDS = ["TechStore", "FashionHub", "HomeBot", "SportZone", "LeatherCo", "GamerZone", "KidsToys"];

const TAG_LABELS: Record<string, { label: string; cls: string }> = {
  flash: { label: "Flash İndirim", cls: "bg-destructive text-destructive-foreground" },
  indirim: { label: "İndirimli", cls: "bg-destructive/90 text-white" },
  "cok-satan": { label: "Çok Satan", cls: "bg-primary text-primary-foreground" },
  yeni: { label: "Yeni", cls: "bg-green-600 text-white" },
};

export default function AramaPage() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { history, addSearch, removeSearch, clearHistory, popularSearches } = useSearchHistory();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [showHistory, setShowHistory] = useState(false);
  const [category, setCategory] = useState(searchParams?.get("kategori") || "tumu");
  const [priceRange, setPriceRange] = useState([0, 1200]);
  const [sortBy, setSortBy] = useState("populer");
  const [showFilters, setShowFilters] = useState(false);
  const [onlyFreeShip, setOnlyFreeShip] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = SEED_PRODUCTS.filter((p) => {
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.seller.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = category === "tumu" || p.category === category;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchShip = !onlyFreeShip || p.freeShip;
      const matchDiscount = !onlyDiscount || p.discount > 0;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchRating = p.rating >= minRating;
      return matchSearch && matchCategory && matchPrice && matchShip && matchDiscount && matchBrand && matchRating;
    });

    switch (sortBy) {
      case "yeni": return result.sort((a, b) => (a.tag === "yeni" ? -1 : 1));
      case "ucuz": return result.sort((a, b) => a.price - b.price);
      case "pahali": return result.sort((a, b) => b.price - a.price);
      case "puan": return result.sort((a, b) => b.rating - a.rating);
      case "indirim": return result.sort((a, b) => b.discount - a.discount);
      default: return result.sort((a, b) => b.reviews - a.reviews);
    }
  }, [searchQuery, category, priceRange, sortBy, onlyFreeShip, onlyDiscount, selectedBrands, minRating]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("tumu");
    setPriceRange([0, 1200]);
    setSortBy("populer");
    setOnlyFreeShip(false);
    setOnlyDiscount(false);
    setSelectedBrands([]);
    setMinRating(0);
  };

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);

  const toggleFav = (id: string) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const activeFilterCount = (category !== "tumu" ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 1200 ? 1 : 0) + (onlyFreeShip ? 1 : 0) + (onlyDiscount ? 1 : 0) + selectedBrands.length + (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4">
        {/* Smart Search */}
        <SmartSearch className="mb-4 max-w-2xl" autoFocus placeholder="Ürün, marka veya satıcı ara..." />

        <div className="flex gap-5">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-56 flex-shrink-0`}>
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Filtreler</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-primary font-medium">
                      Temizle ({activeFilterCount})
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Category */}
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Kategori</Label>
                    <div className="space-y-1">
                      {CATEGORIES.map((cat) => (
                        <button key={cat.value} onClick={() => setCategory(cat.value)} className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between transition-colors ${category === cat.value ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-muted"}`}>
                          <span>{cat.label}</span>
                          {category === cat.value && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Price */}
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      Fiyat (π)
                    </Label>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Input
                        type="number"
                        className="h-8 text-xs px-2"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        placeholder="Min"
                      />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input
                        type="number"
                        className="h-8 text-xs px-2"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        placeholder="Max"
                      />
                    </div>
                    <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1200} step={10} />
                  </div>

                  <div className="border-t border-border" />

                  {/* Quick filters */}
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Seçenekler</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={onlyFreeShip} onCheckedChange={(c) => setOnlyFreeShip(!!c)} />
                        <span className="text-sm flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-primary" />Ücretsiz Kargo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={onlyDiscount} onCheckedChange={(c) => setOnlyDiscount(!!c)} />
                        <span className="text-sm">Sadece İndirimli</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Min rating */}
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Minimum Puan</Label>
                    <div className="flex gap-1.5 flex-wrap">
                      {[0, 3, 4, 4.5].map((r) => (
                        <button key={r} onClick={() => setMinRating(r)} className={`flex items-center gap-0.5 px-2 py-1 rounded-md text-xs border transition-all ${minRating === r ? "border-primary bg-accent text-accent-foreground font-semibold" : "border-border hover:border-muted-foreground"}`}>
                          {r === 0 ? "Tümü" : <><Star className="h-3 w-3 fill-primary text-primary" />{r}+</>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Brands */}
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Mağaza</Label>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {BRANDS.map((b) => (
                        <label key={b} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox checked={selectedBrands.includes(b)} onCheckedChange={() => toggleBrand(b)} />
                          <span className="text-sm">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="md:hidden relative" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  Filtreler
                  {activeFilterCount > 0 && <Badge className="ml-1.5 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-primary">{activeFilterCount}</Badge>}
                </Button>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filtered.length}</span> ürün bulundu
                  {searchQuery && <span> — "<span className="text-primary">{searchQuery}</span>"</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="populer">En Popüler</SelectItem>
                    <SelectItem value="yeni">En Yeni</SelectItem>
                    <SelectItem value="puan">En Yüksek Puan</SelectItem>
                    <SelectItem value="indirim">En Çok İndirimli</SelectItem>
                    <SelectItem value="ucuz">En Ucuz</SelectItem>
                    <SelectItem value="pahali">En Pahalı</SelectItem>
                  </SelectContent>
                </Select>
                <div className="hidden md:flex border border-border rounded-md overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><LayoutGrid className="h-4 w-4" /></button>
                  <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {category !== "tumu" && <button onClick={() => setCategory("tumu")} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium"><X className="h-3 w-3" />{CATEGORIES.find((c) => c.value === category)?.label}</button>}
                {onlyFreeShip && <button onClick={() => setOnlyFreeShip(false)} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium"><X className="h-3 w-3" />Ücretsiz Kargo</button>}
                {onlyDiscount && <button onClick={() => setOnlyDiscount(false)} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium"><X className="h-3 w-3" />İndirimli</button>}
                {selectedBrands.map((b) => <button key={b} onClick={() => toggleBrand(b)} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium"><X className="h-3 w-3" />{b}</button>)}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Sonuç bulunamadı</h3>
                <p className="text-muted-foreground mb-6 text-sm">Farklı anahtar kelimeler veya daha az filtre deneyin</p>
                <Button onClick={clearFilters}>Filtreleri Temizle</Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((product) => {
                  const badgeInfo = TAG_LABELS[product.tag];
                  return (
                    <Card key={product.id} className="overflow-hidden group cursor-pointer border-border hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => window.location.href = `/urun/${product.id}`}>
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img src="/placeholder.svg?height=300&width=300" alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                        {badgeInfo && <Badge className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 font-bold ${badgeInfo.cls}`}>{badgeInfo.label}</Badge>}
                        {product.freeShip && <div className="absolute bottom-2 left-2 bg-card/90 text-[10px] font-semibold text-foreground px-1.5 py-0.5 rounded flex items-center gap-1"><Truck className="h-3 w-3 text-primary" />Ücretsiz</div>}
                        <button className="absolute top-2 right-2 bg-card/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }} aria-label="Favorilere ekle">
                          <Heart className={`h-3.5 w-3.5 ${favorites.includes(product.id) ? "fill-destructive text-destructive" : ""}`} />
                        </button>
                      </div>
                      <CardContent className="p-2.5">
                        <p className="text-[11px] text-muted-foreground truncate">{product.seller}</p>
                        <h4 className="font-medium text-sm mb-1 line-clamp-2 text-balance leading-snug">{product.name}</h4>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="font-semibold text-xs">{product.rating}</span>
                          <span className="text-muted-foreground text-[11px]">({product.reviews.toLocaleString("tr-TR")})</span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <div>
                            <span className="text-base font-bold text-primary">{product.price}π</span>
                            {product.discount > 0 && <span className="text-[11px] text-muted-foreground line-through ml-1.5">{product.originalPrice}π</span>}
                          </div>
                          <Button size="sm" className="h-7 text-xs px-2.5 flex-shrink-0" onClick={(e) => { e.stopPropagation(); addItem({ productId: Number(product.id), name: product.name, artisan: product.seller, price: product.price, quantity: 1, image: "/placeholder.svg?height=300&width=300" }); }}>
                            Ekle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((product) => {
                  const badgeInfo = TAG_LABELS[product.tag];
                  return (
                    <Card key={product.id} className="overflow-hidden group cursor-pointer border-border hover:shadow-md transition-all" onClick={() => window.location.href = `/urun/${product.id}`}>
                      <CardContent className="p-0 flex gap-0">
                        <div className="relative w-32 h-32 overflow-hidden bg-muted flex-shrink-0">
                          <img src="/placeholder.svg?height=200&width=200" alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                          {badgeInfo && <Badge className={`absolute top-1.5 left-1.5 text-[9px] px-1 py-0 font-bold ${badgeInfo.cls}`}>{badgeInfo.label}</Badge>}
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Store className="h-3 w-3" />{product.seller}</p>
                                <h4 className="font-semibold text-sm mt-0.5 line-clamp-2 text-balance">{product.name}</h4>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }} aria-label="Favorilere ekle" className="flex-shrink-0">
                                <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                              </button>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                              <span className="font-semibold text-xs">{product.rating}</span>
                              <span className="text-[11px] text-muted-foreground">({product.reviews.toLocaleString("tr-TR")})</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <span className="text-base font-bold text-primary">{product.price}π</span>
                                {product.discount > 0 && <span className="text-xs text-muted-foreground line-through ml-1.5">{product.originalPrice}π</span>}
                              </div>
                              {product.freeShip && <span className="text-[11px] text-primary font-medium flex items-center gap-0.5"><Truck className="h-3 w-3" />Ücretsiz Kargo</span>}
                            </div>
                            <Button size="sm" className="h-8 text-xs" onClick={(e) => { e.stopPropagation(); addItem({ productId: Number(product.id), name: product.name, artisan: product.seller, price: product.price, quantity: 1, image: "/placeholder.svg" }); }}>
                              Sepete Ekle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
