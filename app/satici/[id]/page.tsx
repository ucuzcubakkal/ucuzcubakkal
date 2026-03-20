"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  MapPin, Star, MessageCircle, Package, ShoppingBag,
  Users, CheckCircle2, ShieldCheck, Globe, Calendar,
  Search, SlidersHorizontal, Heart, Share2, ChevronRight,
  TrendingUp, Award, Clock, Truck, BoxIcon, Sparkles,
  Tag, Copy, Twitter, Facebook, Link2, Gift, ChevronDown, ChevronUp,
  Headphones, BarChart3,
} from "lucide-react";
import { Header } from "@/components/header";
import { FollowButton } from "@/components/follow-button";
import { VerifiedBadge } from "@/components/verified-badge";
import { useCart } from "@/lib/cart-context";
import dynamic from "next/dynamic";
const ProductQA               = dynamic(() => import("@/components/product-qa").then(m => ({ default: m.ProductQA })), { ssr: false });
const SellerTransparencyCard  = dynamic(() => import("@/components/seller-trust").then(m => ({ default: m.SellerTransparencyCard })), { ssr: false });

// ── Mock veri ────────────────────────────────────────────────────────────────

const MOCK_ARTISANS: Record<string, any> = {
  "1": {
    id: "1",
    name: "Ayşe Hanım Atölyesi",
    specialty: "Tekstil & Dokuma",
    bio: "Geleneksel el dokuma tekniklerini modern tasarımlarla buluşturuyorum. 15 yıllık deneyimle özgün ürünler üretiyorum.",
    story: "Annemin bana öğrettiği el dokuma tekniklerini yaşatmak için bu yola girdim. Her ürün, geleneksel motiflerin modern yorumunu taşıyor. Menteşe'deki küçük atölyemde, her gün yeni tasarımlar üretiyorum. Ürünlerimde kullandığım iplikler, doğal boyalarla renklendirilmiş organik pamuk ve yündür.",
    location: "İstanbul, Türkiye",
    country: "TR",
    productCount: 24,
    rating: 4.9,
    reviewCount: 312,
    followerCount: 1847,
    completedOrders: 3240,
    color: "bg-amber-500",
    coverColor: "from-amber-800 to-amber-950",
    verified: true,
    memberSince: "2021",
    responseTime: "~2 saat",
    shipTime: "1-3 iş günü",
    coverImage: null,
    badges: ["Hızlı Teslimat", "Süper Satıcı"],
    products: [
      { id: "1", name: "El Dokuma Kilim Yastık", price: 125, rating: 4.9, reviews: 128, image: "/placeholder.svg?height=400&width=400", category: "Tekstil" },
      { id: "7", name: "Keten Kırlent Kılıfı", price: 55, rating: 4.5, reviews: 156, image: "/placeholder.svg?height=400&width=400", category: "Tekstil" },
      { id: "13", name: "El Dokuma Masa Örtüsü", price: 195, rating: 4.8, reviews: 67, image: "/placeholder.svg?height=400&width=400", category: "Tekstil" },
      { id: "14", name: "Organik Pamuk Battaniye", price: 340, rating: 5.0, reviews: 43, image: "/placeholder.svg?height=400&width=400", category: "Tekstil" },
      { id: "15", name: "Yün Bebek Battaniyesi", price: 280, rating: 4.9, reviews: 89, image: "/placeholder.svg?height=400&width=400", category: "Bebek" },
      { id: "16", name: "Renkli Halı Runner", price: 450, rating: 4.7, reviews: 34, image: "/placeholder.svg?height=400&width=400", category: "Tekstil" },
    ],
    reviews: [
      { id: "r1", user: "Mehmet K.", avatar: "M", product: "El Dokuma Kilim Yastık", rating: 5, comment: "Harika kalite! Çok hızlı geldi ve tam istediğim gibi. Kesinlikle tekrar alacağım.", date: "2024-01-10" },
      { id: "r2", user: "Zeynep A.", avatar: "Z", product: "Keten Kırlent Kılıfı", rating: 5, comment: "El işçiliği gerçekten muhteşem. Satıcı da çok yardımsever, teşekkürler.", date: "2024-01-05" },
      { id: "r3", user: "Fatma Y.", avatar: "F", product: "El Dokuma Kilim Yastık", rating: 4, comment: "Çok güzel bir ürün, beklentilerimi karşıladı. Tavsiye ederim.", date: "2023-12-28" },
      { id: "r4", user: "Hasan B.", avatar: "H", product: "Organik Pamuk Battaniye", rating: 5, comment: "Sipariş vermeden önce soru sordum, anında cevap verdi. Ürün de mükemmel.", date: "2023-12-15" },
    ],
  },
  "2": {
    id: "2",
    name: "Çömlek Sanatı",
    specialty: "Seramik & Kil",
    bio: "Toprak ve ateşi sanatla buluşturan özgün seramik ürünler tasarlıyorum.",
    story: "Çanakkale'nin zengin kil geleneğinden ilham alarak seramik dünyasına adım attım.",
    location: "Çanakkale, Türkiye",
    country: "TR",
    productCount: 18,
    rating: 4.8,
    reviewCount: 187,
    followerCount: 924,
    completedOrders: 1560,
    color: "bg-rose-500",
    coverColor: "from-rose-800 to-rose-950",
    verified: true,
    memberSince: "2022",
    responseTime: "~4 saat",
    shipTime: "2-4 iş günü",
    coverImage: null,
    badges: ["Süper Satıcı"],
    products: [
      { id: "2", name: "Seramik Vazo", price: 89, rating: 4.8, reviews: 95, image: "/placeholder.svg?height=400&width=400", category: "Dekorasyon" },
      { id: "8", name: "Porselen Çay Takımı", price: 320, rating: 4.9, reviews: 203, image: "/placeholder.svg?height=400&width=400", category: "Mutfak" },
      { id: "15", name: "Seramik Kupa", price: 45, rating: 4.8, reviews: 78, image: "/placeholder.svg?height=400&width=400", category: "Mutfak" },
    ],
    reviews: [
      { id: "r4", user: "Ali B.", avatar: "A", product: "Seramik Vazo", rating: 5, comment: "Görüntüsü muhteşem, çok kaliteli.", date: "2024-01-12" },
      { id: "r5", user: "Selin Ç.", avatar: "S", product: "Porselen Çay Takımı", rating: 5, comment: "Hediye olarak aldım, çok beğendiler!", date: "2024-01-08" },
    ],
  },
};

const FALLBACK: any = {
  id: "x", name: "Satıcı", specialty: "Genel", bio: "Özgün ürünler.",
  story: "", location: "Türkiye", country: "TR",
  productCount: 0, rating: 5.0, reviewCount: 0, followerCount: 0, completedOrders: 0,
  color: "bg-primary", coverColor: "from-primary to-primary/80",
  verified: false, memberSince: "2024", responseTime: "Bilinmiyor", shipTime: "Belirtilmemiş",
  coverImage: null, badges: [], products: [], reviews: [],
};

// ── Yardımcı bileşenler ───────────────────────────────────────────────────────

function StatCard({ value, label, icon: Icon, highlight = false }: {
  value: string; label: string; icon: React.ElementType; highlight?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl ${highlight ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}>
      <Icon className={`h-4 w-4 mb-1 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-xl font-bold leading-tight ${highlight ? "text-primary" : "text-foreground"}`}>{value}</span>
      <span className="text-xs text-muted-foreground text-center leading-tight mt-0.5">{label}</span>
    </div>
  );
}

function ProductCard({ product, onAddCart, onClick }: { product: any; onAddCart: () => void; onClick: () => void }) {
  const [wished, setWished] = useState(false);
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all border-border group cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <button
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
        </button>
        <Button
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onAddCart(); }}
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-3">
        <Badge variant="outline" className="text-xs mb-1 py-0">{product.category}</Badge>
        <h4 className="font-semibold text-sm mb-1 line-clamp-2 leading-snug">{product.name}</h4>
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <span className="text-base font-bold text-primary">{product.price}π</span>
      </CardContent>
    </Card>
  );
}

// ── Ana sayfa ─────────────────────────────────────────────────────────────────

export default function SaticiProfilPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const artisanId = (params?.id as string) ?? "1";
  const artisan = MOCK_ARTISANS[artisanId] ?? FALLBACK;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "price_asc" | "price_desc" | "rating">("default");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const storeUrl = typeof window !== "undefined" ? window.location.href : `https://ucuzcubakkal.pi/satici/${artisanId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinks = [
    { label: "Twitter / X", icon: Twitter, color: "hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${artisan.name} mağazasına göz atın! 🛍️`)}&url=${encodeURIComponent(storeUrl)}` },
    { label: "Facebook", icon: Facebook, color: "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}` },
    { label: "WhatsApp", icon: Share2, color: "hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950", url: `https://wa.me/?text=${encodeURIComponent(`${artisan.name} - ${storeUrl}`)}` },
  ];

  // Mağaza karnesi verisi — gerçek uygulamada API'den gelir
  const scorecard = {
    shippingSpeed: { score: 4.8, label: "Genelde 24 saat içinde kargoya veriyor" },
    packagingQuality: { score: 4.7, label: "Alıcıların paketleme puanı" },
    storeAge: (() => {
      const years = new Date().getFullYear() - parseInt(artisan.memberSince);
      return `${years} yıldır Pi ekosisteminde satış yapıyor`;
    })(),
    responseRate: 98,
  };

  // Mock kupon/kampanya — gerçek uygulamada satıcı panelinden gelir
  const campaigns = [
    { id: 1, text: "3 ürün alana %10 Pi indirimi", code: "PI10", icon: Gift, color: "from-primary/10 to-primary/5 border-primary/20 text-primary" },
    { id: 2, text: "İlk siparişe ücretsiz kargo", code: "UCUZ1", icon: Truck, color: "from-green-500/10 to-green-500/5 border-green-500/20 text-green-700 dark:text-green-400" },
  ];

  const filtered = artisan.products
    .filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a: any, b: any) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  function formatNumber(n: number) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "B";
    return n.toString();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack />

      {/* ── KAPAK BANNER ───────────────────────────────────────────── */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden">
        {artisan.coverImage ? (
          <img src={artisan.coverImage} alt="Kapak" className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${artisan.coverColor} flex items-center justify-center`}>
            <div className="text-white/10 font-serif text-8xl font-black select-none tracking-widest">
              {artisan.name.charAt(0)}
            </div>
          </div>
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Paylaş butonu */}
        <button
          onClick={() => setShareOpen(true)}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/60 backdrop-blur flex items-center justify-center border border-white/20 hover:bg-background/80 transition-colors"
          aria-label="Mağazayı paylaş"
        >
          <Share2 className="h-4 w-4 text-foreground" />
        </button>

        {/* Paylaş & Kazan — modal */}
        {shareOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShareOpen(false)}>
            <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Paylaş & Kazan</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Bu mağazayı arkadaşlarınla paylaş, Pi ödülü kazan!</p>
                </div>
                <button onClick={() => setShareOpen(false)} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Teşvik kutusu */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-3 flex items-center gap-3 border border-primary/20">
                <Gift className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-primary">Referans Ödülü</p>
                  <p className="text-xs text-muted-foreground">Paylaştığın bağlantıdan alışveriş yapılırsa <strong className="text-foreground">0.5π</strong> kazanırsın!</p>
                </div>
              </div>

              {/* Sosyal butonlar */}
              <div className="grid grid-cols-3 gap-2">
                {shareLinks.map(({ label, icon: Icon, color, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border transition-colors text-muted-foreground ${color}`}>
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{label}</span>
                  </a>
                ))}
              </div>

              {/* Link kopyala */}
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 border border-border">
                <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground truncate flex-1">{storeUrl}</p>
                <button
                  onClick={handleCopy}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${copied ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  {copied ? "Kopyalandı!" : "Kopyala"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MAĞAZA HEADER ──────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 mb-6 relative z-10">

          {/* Logo — kare 1:1, daire çerçeve */}
          <div className={`h-24 w-24 sm:h-28 sm:w-28 rounded-full ${artisan.color} border-4 border-background shadow-xl flex items-center justify-center flex-shrink-0 text-white font-black text-4xl select-none`}>
            {artisan.name.charAt(0)}
          </div>

          {/* Ad & künye */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-balance leading-tight">{artisan.name}</h1>
              <VerifiedBadge verified={artisan.verified} type="kyc" size="lg" showLabel />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
              <Badge variant="secondary" className="text-xs">{artisan.specialty}</Badge>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {artisan.location}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Global Satış
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {artisan.memberSince}'den beri
              </span>
            </div>

            {/* Rozet listesi */}
            {artisan.badges?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {artisan.badges.map((badge: string) => (
                  <span key={badge} className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    <Award className="h-3 w-3" />
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Aksiyon butonları */}
          <div className="flex gap-2 flex-shrink-0 pb-1">
            <Button size="sm" variant="outline" onClick={() => router.push("/mesajlar")}>
              <MessageCircle className="h-4 w-4 mr-1.5" />
              Mesaj
            </Button>
            <FollowButton artisanId={artisanId} artisanName={artisan.name} size="sm" />
          </div>
        </div>

        {/* ── BIO (maks 150 karakter) ─────────────────────────────── */}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-5 line-clamp-3">
          {artisan.bio.slice(0, 150)}{artisan.bio.length > 150 ? "…" : ""}
        </p>

        {/* Satici Seffaflik Karti */}
        <SellerTransparencyCard
          name={artisan.name}
          memberSince={artisan.memberSince}
          totalSales={artisan.completedOrders ?? 247}
          returnRate={2.1}
          responseTime={artisan.responseTime ?? "2 saat"}
          rating={artisan.rating ?? 4.7}
          reviewCount={artisan.reviewCount ?? 0}
          verified={artisan.verified}
        />

        {/* ── İSTATİSTİK PANELİ ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={Users}
            value={formatNumber(artisan.followerCount)}
            label="Takipçi"
          />
          <StatCard
            icon={CheckCircle2}
            value={formatNumber(artisan.completedOrders)}
            label={`Pi satışı tamamlandı`}
            highlight
          />
          <StatCard
            icon={Star}
            value={artisan.rating.toFixed(1)}
            label={`${artisan.reviewCount} değerlendirme`}
          />
          <StatCard
            icon={Package}
            value={artisan.products.length.toString()}
            label="Aktif ürün"
          />
        </div>

        {/* ── SATICI KARNESİ ────────────────────────────────────────── */}
        <div className="mb-6 rounded-2xl border border-border bg-card overflow-hidden">
          {/* Başlık */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Satıcı Karnesi</h3>
            <span className="ml-auto text-xs text-muted-foreground">Son 6 ay verisi</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y sm:divide-y-0 divide-border">

            {/* Kargolama Hızı */}
            <div className="p-3 sm:p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">Kargolama Hızı</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= Math.round(scorecard.shippingSpeed.score) ? "bg-green-500" : "bg-muted"}`} />
                ))}
                <span className="text-xs font-bold text-green-700 dark:text-green-400 ml-1">{scorecard.shippingSpeed.score}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">{scorecard.shippingSpeed.label}</p>
            </div>

            {/* Paketleme Kalitesi */}
            <div className="p-3 sm:p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <BoxIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Paketleme</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= Math.round(scorecard.packagingQuality.score) ? "bg-amber-500" : "bg-muted"}`} />
                ))}
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 ml-1">{scorecard.packagingQuality.score}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">{scorecard.packagingQuality.label}</p>
            </div>

            {/* Mağaza Yaşı */}
            <div className="p-3 sm:p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Deneyim</span>
              </div>
              <p className="text-base font-black text-primary">
                {new Date().getFullYear() - parseInt(artisan.memberSince)} yıl
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">{scorecard.storeAge}</p>
            </div>

            {/* Yanıt Oranı */}
            <div className="p-3 sm:p-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Yanıt Oranı</span>
              </div>
              <p className="text-base font-black text-blue-700 dark:text-blue-400">%{scorecard.responseRate}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Ort. {artisan.responseTime} içinde yanıt veriyor</p>
            </div>
          </div>
        </div>

        {/* ── TABS ────────────────────────────────────────────────── */}
        <Tabs defaultValue="urunler" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="urunler">
              Ürünler
              <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">{artisan.products.length}</span>
            </TabsTrigger>
            <TabsTrigger value="hakkinda">Mağaza Hakkında</TabsTrigger>
            <TabsTrigger value="sorular">Soru & Cevap</TabsTrigger>
            <TabsTrigger value="yorumlar">
              Yorumlar
              <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">{artisan.reviews.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* ÜRÜNLER */}
          <TabsContent value="urunler" className="mt-0">

            {/* Kupon & Kampanya Banner */}
            {campaigns.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {campaigns.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.id} className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r border ${c.color}`}>
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm font-medium flex-1">{c.text}</p>
                      <button
                        onClick={() => { navigator.clipboard.writeText(c.code); }}
                        className="flex items-center gap-1.5 text-xs font-bold border border-current rounded-lg px-2.5 py-1 hover:opacity-70 transition-opacity"
                        title="Kuponu kopyala"
                      >
                        <Tag className="h-3 w-3" />
                        {c.code}
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Arama & sıralama */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Bu mağazada ara..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <select
                  className="text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                >
                  <option value="default">Varsayılan Sıralama</option>
                  <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="rating">En Yüksek Puan</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Ürün bulunamadı.</p>
                {search && <p className="text-sm mt-1">"{search}" için sonuç yok.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                {filtered.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => router.push(`/urun/${product.id}`)}
                    onAddCart={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* HAKKINDA */}
          <TabsContent value="hakkinda" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 pb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold mb-3">Mağaza Hikayesi</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {artisan.story || artisan.bio}
                  </p>
                </CardContent>
              </Card>
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-5 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{formatNumber(artisan.completedOrders)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Tamamlanan Pi Satışı</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{artisan.rating}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Ortalama Puan</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{formatNumber(artisan.followerCount)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Takipçi</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Konum</span>
                      <span className="font-medium">{artisan.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Globe className="h-4 w-4" /> Satış Bölgesi</span>
                      <span className="font-medium">Global (Pi Network)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Üyelik</span>
                      <span className="font-medium">{artisan.memberSince}'den beri</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Yanıt Süresi</span>
                      <span className="font-medium">{artisan.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Kargolama</span>
                      <span className="font-medium">{artisan.shipTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SORU & CEVAP */}
          <TabsContent value="sorular" className="mt-0">
            <ProductQA sellerId={artisanId} sellerName={artisan.name} />
          </TabsContent>

          {/* YORUMLAR */}
          <TabsContent value="yorumlar" className="mt-0">
            {/* Özet */}
            <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-xl border border-border mb-5">
              <div className="text-center">
                <p className="text-4xl font-black text-primary">{artisan.rating}</p>
                <div className="flex items-center justify-center gap-0.5 my-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(artisan.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{artisan.reviewCount} değerlendirme</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5,4,3,2,1].map((star) => {
                  const count = artisan.reviews.filter((r: any) => r.rating === star).length;
                  const pct = artisan.reviews.length ? (count / artisan.reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-3 text-muted-foreground">{star}</span>
                      <Star className="h-3 w-3 fill-primary text-primary flex-shrink-0" />
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {artisan.reviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Henüz yorum yapılmamış.</p>
              </div>
            ) : (
              <div className="space-y-3 pb-8">
                {artisan.reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                          {review.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="font-semibold text-sm">{review.user}</p>
                              <p className="text-xs text-muted-foreground">{review.product}</p>
                            </div>
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(review.date).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
