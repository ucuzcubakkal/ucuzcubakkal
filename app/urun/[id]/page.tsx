import type { Metadata } from "next";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateSEO,
  toSlug,
} from "@/lib/seo";

// ── SSR Metadata — Google botları bu fonksiyonu okur ────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = CATALOG[id] ?? CATALOG["1"];
  return generateSEO({
    title: product.name,
    description: product.description.slice(0, 160),
    path: `/urun/${id}/${toSlug(product.name)}`,
    image: product.images[0],
  });
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { SwipeGallery } from "@/components/swipe-gallery";
import { ImageLightbox } from "@/components/image-lightbox";
import { RelatedProducts } from "@/components/related-products";
import { ProductRecommendations } from "@/components/product-recommendations";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import {
  Heart, ShoppingBag, Star, MessageCircle, Truck, Shield, CheckCircle2,
  Minus, Plus, Share2, Store, ChevronRight, Package,
  MapPin, Zap, Languages, ThumbsUp, BadgeCheck, RotateCcw,
  Headphones, Camera,
} from "lucide-react";
import { VerifiedBadge } from "@/components/verified-badge";

const CATALOG: Record<string, {
  id: string;
  name: string;
  seller: { id: string; name: string; rating: number; products: number; responseTime: string; verified: boolean };
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  features: string[];
  category: string;
  brand: string;
  freeShip: boolean;
  deliveryDays: string;
}> = {
  "1": {
    id: "1", name: 'iPhone 15 Pro Max Şeffaf Kılıf — MagSafe Uyumlu',
    seller: { id: "s1", name: "TechStore", rating: 4.9, products: 1243, responseTime: "2 saat", verified: true },
    price: 45, originalPrice: 89, discount: 49,
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    rating: 4.9, reviews: 5621, stock: 148,
    description: "iPhone 15 Pro Max ile tam uyumlu, MagSafe şarjı destekleyen, sararmaya karşı dayanıklı şeffaf silikon kılıf. 4 köşe hava yastığı koruması ile düşme darbelerine karşı maksimum koruma sağlar.",
    features: ["MagSafe uyumlu", "Sararmaz teknoloji", "4 köşe hava yastığı", "1.5mm yükseltilmiş kenarlar", "Wireless şarj uyumlu", "Anti-gres kaplama"],
    category: "Elektronik", brand: "CasePro",
    freeShip: true, deliveryDays: "Bugün sipariş ver, yarın kargoda",
  },
  "2": {
    id: "2", name: "Kadın Yazlık Çiçek Desenli Midi Elbise",
    seller: { id: "s2", name: "FashionHub", rating: 4.8, products: 876, responseTime: "4 saat", verified: true },
    price: 89, originalPrice: 175, discount: 49,
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    rating: 4.7, reviews: 3287, stock: 52,
    description: "Hafif viskon kumaştan üretilmiş, geniş kesim midi boy yaz elbisesi. Elastik bel detayı ve dökümlü kumaşı ile hem şık hem konforlu bir görünüm sağlar.",
    features: ["%100 Viskon", "El yıkama önerilir", "Elastik bel", "Midi boy (110 cm)", "Regular fit", "2 cep"],
    category: "Giyim & Moda", brand: "FashionHub",
    freeShip: true, deliveryDays: "1-3 iş günü",
  },
};

const REVIEWS = [
  {
    id: 1, user: "Mehmet K.", country: "TR", flag: "🇹🇷", rating: 5,
    comment: "Harika ürün, açıklamayla birebir uyuşuyor. Çok memnun kaldım, herkese tavsiye ederim.",
    date: "2 gün önce", helpful: 24, verified: true,
    photos: ["/placeholder.svg?height=120&width=120", "/placeholder.svg?height=120&width=120"],
    sellerReply: "Teşekkür ederiz! Memnuniyetiniz bizim için çok değerli.",
  },
  {
    id: 2, user: "Lucas M.", country: "BR", flag: "🇧🇷", rating: 4,
    comment: "Excellent quality, very happy with my purchase. Fast shipping to Brazil!",
    date: "1 hafta önce", helpful: 17, verified: true,
    photos: ["/placeholder.svg?height=120&width=120"],
    sellerReply: null,
  },
  {
    id: 3, user: "Ali R.", country: "TR", flag: "🇹🇷", rating: 5,
    comment: "Arkadaşıma tavsiye ettim o da aldı. İkimiz de çok beğendik. Kesinlikle tekrar alırım.",
    date: "2 hafta önce", helpful: 31, verified: false,
    photos: [],
    sellerReply: null,
  },
  {
    id: 4, user: "Sarah K.", country: "US", flag: "🇺🇸", rating: 5,
    comment: "Absolutely love it! The craftsmanship is amazing. Will definitely order again.",
    date: "3 hafta önce", helpful: 42, verified: true,
    photos: ["/placeholder.svg?height=120&width=120", "/placeholder.svg?height=120&width=120", "/placeholder.svg?height=120&width=120"],
    sellerReply: "Thank you Sarah! We're so glad you love it.",
  },
];

const VARIANTS_CONFIG = [
  {
    name: "Renk",
    type: "color" as const,
    options: [
      { label: "Şeffaf", value: "seffaf", available: true, colorCode: "#E8E8E8" },
      { label: "Siyah", value: "siyah", available: true, colorCode: "#1A1A1A" },
      { label: "Lacivert", value: "lacivert", available: true, colorCode: "#1B3A6B" },
      { label: "Kırmızı", value: "kirmizi", available: false, colorCode: "#C0392B" },
    ],
  },
  {
    name: "Model",
    type: "text" as const,
    options: [
      { label: "iPhone 15 Pro Max", value: "15promax", available: true },
      { label: "iPhone 15 Pro", value: "15pro", available: true },
      { label: "iPhone 15", value: "15", available: true },
      { label: "iPhone 14 Pro Max", value: "14promax", available: false },
    ],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, totalItems } = useCart();
  const { isLoggedIn } = useAuth();
  const { addProduct } = useRecentlyViewed();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState("");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});
  const [reviewPhotoIndex, setReviewPhotoIndex] = useState<{ reviewId: number; photoIdx: number } | null>(null);

  const productId = String(params.id);
  const product = CATALOG[productId] || CATALOG["1"];

  useEffect(() => {
    if (product) {
      addProduct({
        id: product.id, name: product.name,
        artisan_name: product.seller.name,
        price: product.price, images: product.images,
        rating: product.rating, review_count: product.reviews,
        is_featured: product.discount > 30, stock: product.stock,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const handleAddToCart = () => {
    addItem({ productId: Number(product.id), name: product.name, artisan: product.seller.name, price: product.price, quantity, image: product.images[0] });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/sepet");
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: product.name, url: window.location.href });
  };

  const selectVariant = (name: string, val: string) =>
    setSelectedVariants((prev) => ({ ...prev, [name]: val }));

  // Basit simüle çeviri — gerçek uygulamada Google Translate API / DeepL kullanılır
  const handleTranslate = async () => {
    if (translated) { setTranslated(false); return; }
    setTranslating(true);
    await new Promise((r) => setTimeout(r, 900));
    const userLang = navigator.language?.slice(0, 2) ?? "en";
    const translations: Record<string, string> = {
      en: "High quality product compatible with iPhone 15 Pro Max. Supports MagSafe charging, anti-yellowing technology with 4-corner air cushion protection for maximum drop protection.",
      es: "Producto de alta calidad compatible con iPhone 15 Pro Max. Admite carga MagSafe, tecnología anti-amarillamiento con protección de cojín de aire en 4 esquinas.",
      pt: "Produto de alta qualidade compatível com iPhone 15 Pro Max. Suporta carregamento MagSafe, tecnologia anti-amarelamento com proteção de almofada de ar de 4 cantos.",
      de: "Hochwertiges Produkt kompatibel mit iPhone 15 Pro Max. Unterstützt MagSafe-Laden, Anti-Vergilbungs-Technologie mit 4-Ecken-Luftkissenschutz.",
      fr: "Produit de haute qualité compatible avec iPhone 15 Pro Max. Prend en charge la charge MagSafe, technologie anti-jaunissement avec protection par coussin d'air à 4 coins.",
      ar: "منتج عالي الجودة متوافق مع iPhone 15 Pro Max. يدعم شحن MagSafe وتقنية مضادة للاصفرار مع حماية وسادة هوائية بأربع زوايا.",
      zh: "高品质产品，与iPhone 15 Pro Max完全兼容。支持MagSafe充电，防黄变技术，四角气囊防护最大限度地防摔。",
      ja: "iPhone 15 Pro Maxに完全対応した高品質製品。MagSafe充電対応、黄変防止技術、4コーナーエアクッション保護で最大限の落下保護を実現。",
      ru: "Высококачественный продукт, совместимый с iPhone 15 Pro Max. Поддерживает зарядку MagSafe, технологию защиты от пожелтения с защитой воздушной подушкой в 4 углах.",
      ko: "iPhone 15 Pro Max와 완벽하게 호환되는 고품질 제품. MagSafe 충전 지원, 황변 방지 기술, 4코너 에어쿠션 보호로 최대한 낙하 보호.",
    };
    setTranslatedDesc(translations[userLang] ?? translations["en"]);
    setTranslated(true);
    setTranslating(false);
  };

  const stockStatus =
    product.stock === 0 ? "Tükendi" :
    product.stock <= 5 ? `Son ${product.stock} adet!` :
    product.stock <= 20 ? "Az stok" : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org JSON-LD — Product + Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateProductSchema({
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              rating: product.rating,
              reviewCount: product.reviews,
              images: product.images,
              brand: product.brand,
              category: product.category,
              stock: product.stock,
              sellerName: product.seller.name,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: product.category, href: `/kategori/${toSlug(product.category)}` },
              { name: product.name, href: `/urun/${product.id}/${toSlug(product.name)}` },
            ])
          ),
        }}
      />

      <Header showBack title={product.name} />
      <ImageLightbox images={product.images} currentIndex={selectedImage} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} onNavigate={setSelectedImage} productName={product.name} />

      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Breadcrumb — semantic nav, Google dostu hiyerarsi */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-4 overflow-x-auto scrollbar-none">
          <ol className="flex items-center gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-primary whitespace-nowrap" itemProp="item">
                <span itemProp="name">Ana Sayfa</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href={`/kategori/${toSlug(product.category)}`} className="hover:text-primary whitespace-nowrap" itemProp="item">
                <span itemProp="name">{product.category}</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="truncate">
              <span itemProp="name" className="truncate">{product.name}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        <article
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6"
          itemScope
          itemType="https://schema.org/Product"
        >
          <meta itemProp="name" content={product.name} />
          <meta itemProp="description" content={product.description} />
          <meta itemProp="sku" content={product.id} />
          {/* Left: images */}
          <SwipeGallery images={product.images} productName={product.name} onImageClick={(i) => { setSelectedImage(i); setLightboxOpen(true); }} />

          {/* Right: product info */}
          <div className="space-y-4">
            {/* Title & badges */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                <span className="text-xs text-muted-foreground">Marka: <span className="font-medium text-foreground">{product.brand}</span></span>
              </div>
              <h1 className="text-lg md:text-xl font-bold leading-snug text-balance mb-3">{product.name}</h1>

              {/* Rating row */}
              <div className="flex items-center flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                  <span className="font-bold text-sm ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{product.reviews.toLocaleString("tr-TR")} değerlendirme</span>
                <span className="text-sm text-muted-foreground">{product.stock} stok</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{product.price}π</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{product.originalPrice}π</span>
                    <Badge className="bg-destructive text-destructive-foreground text-xs font-bold">%{product.discount} İndirim</Badge>
                  </>
                )}
              </div>
              {product.discount > 0 && (
                <p className="text-xs text-green-600 font-medium mt-1">{product.originalPrice - product.price}π tasarruf ettiniz</p>
              )}
            </div>

            {/* Variants */}
            <div className="space-y-3">
              {VARIANTS_CONFIG.map((group) => (
                <div key={group.name}>
                  <p className="text-sm font-semibold mb-2">
                    {group.name}
                    {selectedVariants[group.name] && (
                      <span className="font-normal text-muted-foreground ml-2">— {selectedVariants[group.name]}</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const isSelected = selectedVariants[group.name] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          disabled={!opt.available}
                          onClick={() => selectVariant(group.name, opt.value)}
                          className={`
                            relative border-2 rounded-lg text-xs font-medium transition-all
                            ${group.type === "color" ? "h-8 w-8 p-0" : "px-3 py-1.5"}
                            ${!opt.available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                            ${isSelected ? "border-primary" : "border-border hover:border-muted-foreground"}
                          `}
                          style={group.type === "color" ? { backgroundColor: (opt as { colorCode?: string }).colorCode } : {}}
                          title={opt.label}
                        >
                          {group.type !== "color" && opt.label}
                          {isSelected && group.type !== "color" && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Stock status — canli sayac */}
            {product.stock > 0 && product.stock <= 20 && (
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold w-fit
                ${product.stock <= 5
                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                }`}>
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${product.stock <= 5 ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                {product.stock <= 5
                  ? `Son ${product.stock} adet kaldi! Hemen al.`
                  : `Sinirli stok — ${product.stock} adet`}
              </div>
            )}
            {product.stock === 0 && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold w-fit bg-muted text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground flex-shrink-0" />
                Stokta yok
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold mb-2">Adet</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="text-base font-bold w-10 text-center">{quantity}</span>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button className="flex-1 h-11 font-semibold" size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
                {addedToCart ? <><CheckCircle2 className="h-4 w-4 mr-2" />Eklendi!</> : <><ShoppingBag className="h-4 w-4 mr-2" />{product.stock === 0 ? "Tükendi" : "Sepete Ekle"}</>}
              </Button>
              <Button variant="outline" className="flex-1 h-11 font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground" size="lg" onClick={handleBuyNow} disabled={product.stock === 0}>
                Hemen Al
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0" onClick={() => setIsFavorite(!isFavorite)} aria-label="Favorilere ekle">
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0" onClick={handleShare} aria-label="Paylaş">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {addedToCart && (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Sepetinizde {totalItems} ürün var</p>
                <Link href="/sepet"><Button size="sm" className="h-8">Sepete Git</Button></Link>
              </div>
            )}

            {/* Güven rozetleri — 3'lü kart */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <RotateCcw className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-[10px] font-bold text-green-700 dark:text-green-400 text-center leading-tight">14 Gün İade</span>
                <span className="text-[10px] text-green-600 dark:text-green-500 text-center">Ücretsiz</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 text-center leading-tight">Alıcı</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-500 text-center">Güvencesi</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 text-center leading-tight">{product.freeShip ? "Ücretsiz" : "Standart"}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-500 text-center">Kargo</span>
              </div>
            </div>

            {/* Teslimat bilgisi */}
            <Card className="border-border">
              <CardContent className="p-3 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{product.deliveryDays}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Pi Network güvenli ödeme altyapısı</p>
                </div>
              </CardContent>
            </Card>

            {/* Seller card */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Link href={`/satici/${product.seller.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {product.seller.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm">{product.seller.name}</p>
                        <VerifiedBadge verified={product.seller.verified} type="kyc" size="sm" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-primary text-primary" />{product.seller.rating}</span>
                        <span>·</span>
                        <span>{product.seller.products.toLocaleString("tr-TR")} ürün</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex gap-2">
                    <Link href={`/satici/${product.seller.id}`}>
                      <Button variant="outline" size="sm" className="text-xs"><Store className="h-3.5 w-3.5 mr-1" />Mağaza</Button>
                    </Link>
                    <Link href="/mesajlar">
                      <Button variant="outline" size="sm" className="text-xs"><MessageCircle className="h-3.5 w-3.5 mr-1" />Mesaj</Button>
                    </Link>
                  </div>
                </div>
                {/* Yanıt oranı rozeti */}
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Headphones className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Sorulara ort. {product.seller.responseTime} içinde yanıt veriyor
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs text-muted-foreground">%98 yanıt oranı</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs: Description / Features / Reviews */}
        <div className="mt-8">
          <Tabs defaultValue="description">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="description">Açıklama</TabsTrigger>
              <TabsTrigger value="features">Özellikler</TabsTrigger>
              <TabsTrigger value="reviews">Yorumlar ({product.reviews.toLocaleString("tr-TR")})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-5 space-y-3">
              {/* Translate button */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Türkiye &nbsp;·&nbsp;
                  <Package className="h-3.5 w-3.5" /> UCB-{product.id}-{product.brand?.toUpperCase().slice(0, 3)}
                </p>
                <button
                  onClick={handleTranslate}
                  disabled={translating}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-60 transition-opacity"
                >
                  <Languages className="h-3.5 w-3.5" />
                  {translating ? "Çevriliyor..." : translated ? "Orijinal Göster" : "Otomatik Çevir"}
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {translated ? translatedDesc : product.description}
              </p>
              {translated && (
                <p className="text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <Languages className="h-3 w-3" />
                  Tarayıcı dilinize otomatik çevrildi. Hatalar içerebilir.
                </p>
              )}
            </TabsContent>

            <TabsContent value="features" className="mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-5 space-y-4">
              {/* Summary */}
              <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-xl">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary">{product.rating}</div>
                  <div className="flex items-center gap-0.5 justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{product.reviews.toLocaleString("tr-TR")} yorum</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-2">{star}</span>
                      <Star className="h-3 w-3 fill-primary text-primary flex-shrink-0" />
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 2}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{star === 5 ? "70%" : star === 4 ? "20%" : star === 3 ? "7%" : "2%"}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Review list */}
              {REVIEWS.map((review) => (
                <Card key={review.id} className="border-border">
                  <CardContent className="p-4 space-y-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs bg-accent font-semibold">{review.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-sm">{review.user}</p>
                            <span className="text-sm" title={review.country}>{review.flag}</span>
                            {review.verified && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-green-600 text-white gap-0.5">
                                <CheckCircle2 className="h-2.5 w-2.5" /> Dogrulanmis Alim
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                    {/* Review photos */}
                    {review.photos.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {review.photos.map((photo, idx) => (
                          <button
                            key={idx}
                            onClick={() => setReviewPhotoIndex({ reviewId: review.id, photoIdx: idx })}
                            className="relative rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                          >
                            <img
                              src={photo}
                              alt={`Müşteri fotoğrafı ${idx + 1}`}
                              className="h-20 w-20 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                              <Camera className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                        <span className="self-end text-xs text-muted-foreground flex items-center gap-1">
                          <Camera className="h-3 w-3" />{review.photos.length} fotoğraf
                        </span>
                      </div>
                    )}

                    {/* Lightbox for review photo */}
                    {reviewPhotoIndex?.reviewId === review.id && (
                      <div
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                        onClick={() => setReviewPhotoIndex(null)}
                      >
                        <img
                          src={review.photos[reviewPhotoIndex.photoIdx]}
                          alt="Müşteri fotoğrafı"
                          className="max-h-[80vh] max-w-full rounded-xl object-contain"
                        />
                      </div>
                    )}

                    {/* Seller reply */}
                    {review.sellerReply && (
                      <div className="bg-muted/50 rounded-lg px-3 py-2.5 border-l-2 border-primary">
                        <p className="text-xs font-semibold text-primary mb-0.5 flex items-center gap-1">
                          <Store className="h-3 w-3" /> Satıcı Yanıtı
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{review.sellerReply}</p>
                      </div>
                    )}

                    {/* Helpful */}
                    <div className="flex items-center gap-3 pt-1 border-t border-border/50">
                      <button
                        onClick={() => setHelpfulVotes((prev) => ({ ...prev, [review.id]: !prev[review.id] }))}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${helpfulVotes[review.id] ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${helpfulVotes[review.id] ? "fill-primary" : ""}`} />
                        Yararlı ({review.helpful + (helpfulVotes[review.id] ? 1 : 0)})
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {isLoggedIn && (
                <Card className="border-dashed border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Bu ürünü satın aldınız mı? Yorum yapın.</p>
                    <Button variant="outline" size="sm">Yorum Yaz</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </article>

        {/* Related products */}
        <RelatedProducts currentId={product.id} category={product.category} />

        {/* Bunu alanlar bunu da aldi */}
        <ProductRecommendations currentId={product.id} category={product.category} />
      </div>
    </div>
  );
}
