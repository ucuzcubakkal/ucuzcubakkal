"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Baby,
  Gem,
  UtensilsCrossed,
  ChevronRight,
  ChevronLeft,
  Zap,
  Store,
  Clock,
  Loader2,
  HandMetal,
  Leaf,
  Sparkles,
  ArrowRight,
  Flame,
  BadgeCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";

const QuickViewModal = dynamic(() => import("@/components/quick-view-modal").then(m => ({ default: m.QuickViewModal })), { ssr: false });
const RecentlyViewed = dynamic(() => import("@/components/recently-viewed").then(m => ({ default: m.RecentlyViewed })), { ssr: false });

/* ─────────────────────── MOCK DATA ─────────────────────── */

const CATEGORIES = [
  { name: "El Sanatları", icon: HandMetal, slug: "el-sanatlari",   color: "bg-amber-50  dark:bg-amber-950/40",  iconColor: "text-amber-600  dark:text-amber-400",  ring: "ring-amber-200  dark:ring-amber-800" },
  { name: "Giyim",        icon: Shirt,     slug: "giyim-aksesuar", color: "bg-rose-50   dark:bg-rose-950/40",   iconColor: "text-rose-600   dark:text-rose-400",   ring: "ring-rose-200   dark:ring-rose-800"  },
  { name: "Elektronik",   icon: Smartphone,slug: "elektronik",     color: "bg-blue-50   dark:bg-blue-950/40",   iconColor: "text-blue-600   dark:text-blue-400",   ring: "ring-blue-200   dark:ring-blue-800"  },
  { name: "Ev & Yaşam",  icon: Home,      slug: "ev-dekorasyonu", color: "bg-orange-50 dark:bg-orange-950/40", iconColor: "text-orange-600 dark:text-orange-400", ring: "ring-orange-200 dark:ring-orange-800"},
  { name: "Organik",      icon: Leaf,      slug: "dogal-organik",  color: "bg-green-50  dark:bg-green-950/40",  iconColor: "text-green-600  dark:text-green-400",  ring: "ring-green-200  dark:ring-green-800" },
  { name: "Mücevher",    icon: Gem,       slug: "mucevher",       color: "bg-yellow-50 dark:bg-yellow-950/40", iconColor: "text-yellow-600 dark:text-yellow-400", ring: "ring-yellow-200 dark:ring-yellow-800"},
  { name: "Spor",         icon: Dumbbell,  slug: "spor",           color: "bg-cyan-50   dark:bg-cyan-950/40",   iconColor: "text-cyan-600   dark:text-cyan-400",   ring: "ring-cyan-200   dark:ring-cyan-800"  },
  { name: "Kitap",        icon: BookOpen,  slug: "kitap",          color: "bg-violet-50 dark:bg-violet-950/40", iconColor: "text-violet-600 dark:text-violet-400", ring: "ring-violet-200 dark:ring-violet-800"},
  { name: "Özel Tasarım",icon: Sparkles,  slug: "ozel-tasarim",   color: "bg-fuchsia-50 dark:bg-fuchsia-950/40",iconColor: "text-fuchsia-600 dark:text-fuchsia-400",ring: "ring-fuchsia-200 dark:ring-fuchsia-800"},
  { name: "Anne & Bebek", icon: Baby,      slug: "bebek",          color: "bg-pink-50   dark:bg-pink-950/40",   iconColor: "text-pink-600   dark:text-pink-400",   ring: "ring-pink-200   dark:ring-pink-800"  },
  { name: "Süpermarket", icon: UtensilsCrossed, slug: "market",   color: "bg-teal-50   dark:bg-teal-950/40",   iconColor: "text-teal-600   dark:text-teal-400",   ring: "ring-teal-200   dark:ring-teal-800"  },
];

const HERO_BANNERS = [
  {
    id: 1,
    badge:    "Yeni Koleksiyon",
    title:    "Handmade Seramik",
    subtitle: "El emeği, göz nuru — Her parça biricik",
    cta:      "Koleksiyonu Keşfet",
    href:     "/kategori/el-sanatlari",
    from:     "#b45309", to: "#92400e",
    img:      "/placeholder.svg?height=480&width=800&text=Seramik+Koleksiyonu",
  },
  {
    id: 2,
    badge:    "2025 Sezonu",
    title:    "Doğal & Organik",
    subtitle: "Sertifikalı üreticilerden taze ürünler",
    cta:      "Hemen Sipariş Ver",
    href:     "/kategori/dogal-organik",
    from:     "#15803d", to: "#166534",
    img:      "/placeholder.svg?height=480&width=800&text=Organik+Ürünler",
  },
  {
    id: 3,
    badge:    "Geleneksel Sanat",
    title:    "El Dokuma Kilimler",
    subtitle: "Anadolu'nun renkleri evinize taşıyor",
    cta:      "Keşfet",
    href:     "/kategori/ev-dekorasyonu",
    from:     "#0369a1", to: "#1e3a5f",
    img:      "/placeholder.svg?height=480&width=800&text=El+Dokuma",
  },
];

const FLASH_SALE_PRODUCTS = [
  { id:"f1", name:"Wireless Kulaklık Pro",   seller:"TechStore",  price:89,  originalPrice:189, discount:53, rating:4.7, reviews:2341, image:"/placeholder.svg?height=300&width=300&text=Kulaklık",  badge:"flash" },
  { id:"f2", name:"Spor Koşu Ayakkabısı",    seller:"SportZone",  price:125, originalPrice:249, discount:50, rating:4.8, reviews:1876, image:"/placeholder.svg?height=300&width=300&text=Ayakkabı",  badge:"flash" },
  { id:"f3", name:"Erkek Slim Fit Takım",    seller:"ModaHouse",  price:210, originalPrice:399, discount:47, rating:4.6, reviews:943,  image:"/placeholder.svg?height=300&width=300&text=Takım",     badge:"flash" },
  { id:"f4", name:"Akıllı Saat Fitness",     seller:"SmartGear",  price:175, originalPrice:320, discount:45, rating:4.9, reviews:3102, image:"/placeholder.svg?height=300&width=300&text=Saat",      badge:"flash" },
  { id:"f5", name:"Deri Çanta Kadın",        seller:"LeatherCo",  price:149, originalPrice:280, discount:47, rating:4.8, reviews:1254, image:"/placeholder.svg?height=300&width=300&text=Çanta",     badge:"flash" },
  { id:"f6", name:"Robot Süpürge",           seller:"HomeBot",    price:299, originalPrice:599, discount:50, rating:4.7, reviews:4210, image:"/placeholder.svg?height=300&width=300&text=Süpürge",   badge:"flash" },
];

const FEATURED_PRODUCTS = [
  { id:"1",  name:"iPhone 15 Pro Max Kılıf",   seller:"CasePro",       price:45,  originalPrice:45,  discount:0,  rating:4.9, reviews:5621, image:"/placeholder.svg?height=300&width=300&text=Kılıf",    badge:"yeni",      freeShip:true  },
  { id:"2",  name:"Kadın Yazlık Elbise",        seller:"FashionHub",    price:89,  originalPrice:120, discount:26, rating:4.7, reviews:3287, image:"/placeholder.svg?height=300&width=300&text=Elbise",   badge:"indirim",   freeShip:true  },
  { id:"3",  name:"Yoga Matı Kaymaz",           seller:"YogaWorld",     price:55,  originalPrice:75,  discount:27, rating:4.8, reviews:2109, image:"/placeholder.svg?height=300&width=300&text=Yoga",     badge:"indirim",   freeShip:false },
  { id:"4",  name:"Kahve Makinesi Otomatik",    seller:"KahveDünyası", price:420, originalPrice:599, discount:30, rating:4.9, reviews:8743, image:"/placeholder.svg?height=300&width=300&text=Kahve",    badge:"cok-satan", freeShip:true  },
  { id:"5",  name:"Erkek Deri Mont",            seller:"LeatherCo",     price:350, originalPrice:499, discount:30, rating:4.6, reviews:1432, image:"/placeholder.svg?height=300&width=300&text=Mont",     badge:"indirim",   freeShip:true  },
  { id:"6",  name:"Oyuncu Kulaklığı RGB",       seller:"GamerZone",     price:199, originalPrice:299, discount:33, rating:4.8, reviews:2876, image:"/placeholder.svg?height=300&width=300&text=Gaming",   badge:"cok-satan", freeShip:false },
  { id:"7",  name:"Çocuk Puzzle 500 Parça",    seller:"KidsToys",      price:35,  originalPrice:55,  discount:36, rating:4.9, reviews:4521, image:"/placeholder.svg?height=300&width=300&text=Puzzle",   badge:"yeni",      freeShip:true  },
  { id:"8",  name:"Güneş Gözlüğü UV400",      seller:"OpticPlus",     price:75,  originalPrice:120, discount:38, rating:4.7, reviews:1876, image:"/placeholder.svg?height=300&width=300&text=Gözlük",  badge:"indirim",   freeShip:false },
];

const SELLERS = [
  { id:"s1", name:"TechStore",  rating:4.9, products:1243, verified:true, color:"bg-blue-500"  },
  { id:"s2", name:"FashionHub", rating:4.8, products:876,  verified:true, color:"bg-rose-500"  },
  { id:"s3", name:"HomeBot",    rating:4.7, products:432,  verified:true, color:"bg-amber-500" },
  { id:"s4", name:"SportZone",  rating:4.9, products:654,  verified:true, color:"bg-green-600" },
];

const ALL_PRODUCTS = [
  ...FEATURED_PRODUCTS,
  ...FLASH_SALE_PRODUCTS,
  { id:"9",  name:"El Yapımı Seramik Kupa",   seller:"SeramikAtölye", price:25,  originalPrice:35,  discount:29, rating:4.9, reviews:812,  image:"/placeholder.svg?height=300&width=300&text=Seramik", badge:"yeni",      freeShip:true  },
  { id:"10", name:"Organik Zeytinyağı Sabunu", seller:"DoğalSabun",   price:12,  originalPrice:18,  discount:33, rating:4.8, reviews:1540, image:"/placeholder.svg?height=300&width=300&text=Sabun",   badge:"cok-satan", freeShip:true  },
  { id:"11", name:"El Dokuma Kilim 80x150",   seller:"HalıDükkânı",  price:280, originalPrice:380, discount:26, rating:4.7, reviews:320,  image:"/placeholder.svg?height=300&width=300&text=Kilim",   badge:"indirim",   freeShip:false },
  { id:"12", name:"Bakır Telkari Küpe",       seller:"TelkariUsta",  price:45,  originalPrice:65,  discount:31, rating:4.9, reviews:670,  image:"/placeholder.svg?height=300&width=300&text=Küpe",    badge:"yeni",      freeShip:true  },
];

const PAGE_SIZE = 8;
type Product = (typeof ALL_PRODUCTS)[0];

/* ──────────────────── HeroCarousel ──────────────────── */
function HeroCarousel() {
  const [active, setActive] = useState(0);
  const touchStartX         = useRef(0);
  const intervalRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const total               = HERO_BANNERS.length;

  const goTo = useCallback((idx: number) => setActive(((idx % total) + total) % total), [total]);

  useEffect(() => {
    intervalRef.current = setInterval(() => setActive((a) => (a + 1) % total), 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? active + 1 : active - 1);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ minHeight: "220px" }}
    >
      {HERO_BANNERS.map((b, i) => (
        <div
          key={b.id}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-500 ${i === active ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
        >
          {/* Background image */}
          <img
            src={b.img}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
          />

          {/* Subtle bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Content — bottom aligned for thumb reach */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 z-10">
            <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 backdrop-blur-sm">
              {b.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight text-balance mb-1">
              {b.title}
            </h2>
            <p className="text-sm text-white/80 mb-4 text-balance">{b.subtitle}</p>
            <Link href={b.href}>
              <Button
                size="sm"
                className="bg-white text-foreground font-bold hover:bg-white/90 rounded-xl h-10 px-5 text-sm gap-1.5"
              >
                {b.cta} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-5 z-20 flex gap-1.5">
        {HERO_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Banner ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === active ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
          />
        ))}
      </div>

      {/* Arrows — sm+ */}
      <button
        onClick={() => goTo(active - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-9 w-9 rounded-full bg-black/30 hover:bg-black/50 items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Onceki banner"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        onClick={() => goTo(active + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-9 w-9 rounded-full bg-black/30 hover:bg-black/50 items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Sonraki banner"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}

/* ──────────────────── FlashCountdown ──────────────────── */
function FlashCountdown() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-0.5 font-mono text-xs font-bold">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center">
          <span className="bg-white/20 text-white rounded px-1.5 py-0.5">{v}</span>
          {i < 2 && <span className="text-white/70 mx-0.5">:</span>}
        </span>
      ))}
    </div>
  );
}

/* ──────────────────── ProductCard ──────────────────── */
function ProductCard({ product }: { product: Product }) {
  const [fav,   setFav]   = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem }       = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ productId: Number(product.id), name: product.name, artisan: product.seller, price: product.price, quantity: 1, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const badgeMap: Record<string, { label: string; cls: string }> = {
    flash:      { label: "Flash",    cls: "bg-destructive text-destructive-foreground" },
    indirim:    { label: `%${product.discount}`, cls: "bg-destructive text-destructive-foreground" },
    "cok-satan":{ label: "Çok Satan",cls: "bg-primary text-primary-foreground" },
    yeni:       { label: "Yeni",     cls: "bg-green-600 text-white" },
  };
  const badge = product.badge ? badgeMap[product.badge] : null;

  return (
    <Link href={`/urun/${product.id}`}>
      <Card className="overflow-hidden group cursor-pointer border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <Badge className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 font-bold rounded-md ${badge.cls}`}>
              {badge.label}
            </Badge>
          )}
          {"freeShip" in product && product.freeShip && (
            <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm text-[10px] font-semibold text-foreground px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <Truck className="h-3 w-3 text-primary" />
              Ücretsiz
            </div>
          )}
          {/* Fav button — always visible on touch for mobile */}
          <button
            className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-full p-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.preventDefault(); setFav(!fav); }}
            aria-label={fav ? "Favorilerden cikar" : "Favorilere ekle"}
          >
            <Heart className={`h-3.5 w-3.5 ${fav ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
        </div>

        <CardContent className="p-2.5 flex flex-col gap-1 flex-1">
          <p className="text-[11px] text-muted-foreground truncate">{product.seller}</p>
          <h4 className="text-sm font-medium line-clamp-2 leading-snug text-balance flex-1">{product.name}</h4>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="text-xs font-semibold">{product.rating}</span>
            <span className="text-[10px] text-muted-foreground">({product.reviews.toLocaleString("tr-TR")})</span>
          </div>
          <div className="flex items-center justify-between gap-1 mt-auto pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-primary">{product.price}π</span>
              {product.discount > 0 && (
                <span className="text-[11px] text-muted-foreground line-through">{product.originalPrice}π</span>
              )}
            </div>
            <Button
              size="sm"
              className={`h-7 text-xs px-2.5 flex-shrink-0 rounded-lg font-semibold ${added ? "bg-green-600 hover:bg-green-700" : ""}`}
              onClick={handleAdd}
            >
              {added ? "Eklendi" : "Ekle"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ──────────────────── Page ──────────────────── */
export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount]         = useState(PAGE_SIZE);
  const [loadingMore,  setLoadingMore]          = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();

  // IntersectionObserver — infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < ALL_PRODUCTS.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, ALL_PRODUCTS.length));
            setLoadingMore(false);
          }, 800);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header — bileşen kendi sticky mantığını yönetiyor */}
      <Header />

      <main className="pb-20">

        {/* ── Hero Carousel ── */}
        <section className="px-3 pt-3 pb-0">
          <HeroCarousel />
        </section>

        {/* ── Hızlı Kategori İkonları ── */}
        <section className="pt-5 pb-1">
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="font-bold text-sm sm:text-base tracking-tight">Kategoriler</h2>
            <Link href="/kategori/tumu" className="text-xs text-primary font-semibold flex items-center gap-0.5">
              Tümü <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Yatay kaydırılabilir — snap ile başparmak dostu */}
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.slug} href={`/kategori/${cat.slug}`} className="flex-shrink-0 snap-start group">
                  <div className="flex flex-col items-center gap-2 w-[72px]">
                    <div
                      className={`${cat.color} ${cat.ring} ring-1 h-[56px] w-[56px] rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-sm group-hover:ring-2`}
                    >
                      <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-semibold text-center leading-tight text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Hizmet Çubuğu ── */}
        <section className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { icon: Truck,     title: "Ücretsiz Kargo", sub: "150π üzeri" },
              { icon: RefreshCw, title: "Kolay İade",     sub: "14 gün"     },
              { icon: Shield,    title: "Güvenli Ödeme",  sub: "Pi Network"  },
              { icon: Clock,     title: "Hızlı Teslimat", sub: "Aynı gün"   },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2.5 flex-shrink-0 hover:border-primary/30 transition-colors">
                <div className="bg-primary/10 p-1.5 rounded-lg flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold whitespace-nowrap text-foreground">{title}</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Flash İndirim ── */}
        <section className="px-4 py-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-destructive">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-white fill-white" />
                <span className="font-black text-white text-sm">Flash İndirim</span>
              </div>
              <div className="flex items-center gap-3">
                <FlashCountdown />
                <Link href="/kampanyalar" className="text-[11px] text-white/90 underline underline-offset-2 font-semibold whitespace-nowrap">
                  Tümünü Gör
                </Link>
              </div>
            </div>

            {/* Yatay kaydırılabilir ürün şeridi */}
            <div className="flex gap-0 overflow-x-auto scrollbar-hide divide-x divide-border">
              {FLASH_SALE_PRODUCTS.map((product) => (
                <Link key={product.id} href={`/urun/${product.id}`} className="flex-shrink-0 w-[130px] sm:w-[160px]">
                  <div className="p-3 hover:bg-muted/40 transition-colors group h-full">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-destructive text-destructive-foreground text-[10px] font-black px-1.5 py-0.5 rounded-md">
                        %{product.discount}
                      </div>
                    </div>
                    <p className="text-xs font-medium line-clamp-2 text-balance mb-1 leading-snug">{product.name}</p>
                    <p className="text-sm font-black text-primary">{product.price}π</p>
                    <p className="text-[10px] text-muted-foreground line-through">{product.originalPrice}π</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sonsuz Kaydırma — Tüm Ürünler ── */}
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-base md:text-lg flex items-center gap-2 tracking-tight">
              <Sparkles className="h-4 w-4 text-primary" />
              Senin İçin Seçilenler
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-medium">
              {ALL_PRODUCTS.length} ürün
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_PRODUCTS.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Sentinel */}
          <div ref={sentinelRef} className="flex justify-center items-center py-8 min-h-[48px]">
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Yükleniyor...
              </div>
            )}
            {!loadingMore && visibleCount >= ALL_PRODUCTS.length && (
              <p className="text-xs text-muted-foreground bg-muted px-4 py-2 rounded-full">
                Tüm ürünler gösterildi
              </p>
            )}
          </div>
        </section>

        {/* ── Öne Çıkan Satıcılar ── */}
        <section className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-base md:text-lg flex items-center gap-2 tracking-tight">
              <Store className="h-4 w-4 text-primary" />
              Güvenilir Satıcılar
            </h2>
            <Link href="/saticilar" className="text-xs text-primary font-semibold flex items-center gap-0.5">
              Tümü <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SELLERS.map((seller) => (
              <Link key={seller.id} href={`/satici/${seller.id}`}>
                <Card className="hover:shadow-md transition-all border-border hover:border-primary/30 group">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className={`h-12 w-12 rounded-2xl ${seller.color} flex items-center justify-center text-white font-black text-lg shadow-sm`}>
                      {seller.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 justify-center">
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{seller.name}</p>
                        {seller.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 justify-center mt-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold">{seller.rating}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{seller.products.toLocaleString("tr-TR")} ürün</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Satıcı Ol CTA ── */}
        <section className="px-4 py-4">
          <div
            className="relative overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #ea580c)" }}
          >
            {/* Dekoratif daire */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/5" />

            <div className="relative">
              <p className="text-sm font-medium text-white/80 mb-1">Ucuzcubakkal'da Satıcı Ol</p>
              <h3 className="text-xl md:text-2xl font-black text-white text-balance leading-tight">
                Milyonlarca alıcıya ulaş
              </h3>
              <p className="text-sm text-white/75 mt-1 max-w-sm">
                Ürünlerini listele, Pi Network ile tahsil et. İlk 3 ay komisyonsuz!
              </p>
            </div>
            <Link href="/basvuru" className="relative flex-shrink-0">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 font-black rounded-xl px-6 gap-1.5">
                Hemen Başla <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ── Bülten ── */}
        <section className="px-4 py-2">
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-base mb-0.5">Kampanyalardan ilk sen haberdar ol</h3>
              <p className="text-sm text-muted-foreground">Kişiselleştirilmiş teklifler ve flash indirim bildirimleri</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input type="email" placeholder="E-posta adresiniz" className="md:w-64 h-10 rounded-xl" />
              <Button className="h-10 px-5 flex-shrink-0 rounded-xl font-bold">Abone Ol</Button>
            </div>
          </div>
        </section>

        {/* ── Son Görüntülenenler ── */}
        <div className="px-4 pb-2">
          <RecentlyViewed />
        </div>
      </main>

      {/* Quick view modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct as Parameters<typeof QuickViewModal>[0]["product"]}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
