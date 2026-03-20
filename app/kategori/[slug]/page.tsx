import type { Metadata } from "next";
import {
  generateSEO,
  generateCategorySchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

// ── SSR Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_MAP[slug] ?? CATEGORY_MAP["tumu"];
  return generateSEO({
    title: cat.name,
    description: cat.description,
    path: `/kategori/${slug}`,
  });
}

"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Star,
  SlidersHorizontal,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Baby,
  Gem,
  UtensilsCrossed,
  Package,
  Truck,
  X,
  ChevronRight,
  Car,
} from "lucide-react";
import { Header } from "@/components/header";
import { useCart } from "@/lib/cart-context";

const CATEGORY_MAP: Record<string, {
  name: string;
  description: string;
  gradient: string;
  icon: React.ElementType;
  count: number;
  subcategories: string[];
}> = {
  "elektronik": {
    name: "Elektronik",
    description: "Telefon, bilgisayar, TV ve daha fazlası — en uygun fiyatlarla",
    gradient: "from-blue-500 to-blue-700",
    icon: Smartphone,
    count: 48320,
    subcategories: ["Cep Telefonu", "Kılıf & Koruyucu", "Şarj Aleti", "Kulaklık", "Powerbank", "Akıllı Saat", "Laptop", "Masaüstü PC", "Tablet", "Monitör", "Klavye & Mouse", "SSD & Bellek", "Akıllı TV", "Soundbar", "Bluetooth Hoparlör", "Projeksiyon", "PlayStation", "Xbox", "Nintendo Switch", "Oyun Kolu", "Oyuncu Monitörü", "VR Gözlük"],
  },
  "giyim-aksesuar": {
    name: "Giyim & Moda",
    description: "Kadın, erkek, çocuk giyim ve aksesuar koleksiyonları",
    gradient: "from-rose-500 to-rose-700",
    icon: Shirt,
    count: 91240,
    subcategories: ["Elbise", "Bluz & Gömlek", "Pantolon & Tayt", "Etek", "Mont & Kaban", "Pijama & İç Giyim", "Erkek T-shirt & Polo", "Erkek Gömlek", "Erkek Pantolon", "Erkek Sweatshirt", "Takım Elbise", "Kız Çocuk", "Erkek Çocuk", "Bebek Kıyafeti", "Spor Ayakkabı", "Topuklu Ayakkabı", "Bot & Çizme", "El Çantası", "Sırt Çantası", "Cüzdan"],
  },
  "ev-dekorasyonu": {
    name: "Ev & Yaşam",
    description: "Mobilya, dekorasyon, mutfak ve bahçe ürünleri",
    gradient: "from-amber-500 to-amber-700",
    icon: Home,
    count: 34180,
    subcategories: ["Koltuk & Kanepe", "Yatak Odası", "Yemek Odası", "Çalışma Masası", "Gardırop", "Raf & Kitaplık", "Tablo & Duvar Sanatı", "Vazo & Saksı", "Mum & Mumluk", "Ayna", "Halı & Kilim", "Yastık & Örtü", "Tencere & Tava", "Kahve Makinesi", "Blender", "Banyo Seti", "Avize", "LED Aydınlatma", "Bahçe Mobilyası"],
  },
  "spor": {
    name: "Spor & Outdoor",
    description: "Spor giyim, fitness ekipmanları ve outdoor malzemeleri",
    gradient: "from-green-500 to-green-700",
    icon: Dumbbell,
    count: 22560,
    subcategories: ["Koşu Ayakkabısı", "Spor Tayt", "Spor Sütyeni", "Forma & Şort", "Spor Çantası", "Dambıl & Halter", "Yoga Matı", "Protein Tozu", "Pilates Aleti", "İp Atlama", "Egzersiz Bandı", "Çadır", "Uyku Tulumu", "Trekking Ayakkabısı", "Su Matarası", "Kamp Ocağı", "Bisiklet", "Bisiklet Kaskı", "Yüzme Gözlüğü", "Mayo", "Kayak"],
  },
  "kitap": {
    name: "Kitap & Hobi",
    description: "Kitap, müzik, sanat malzemeleri ve oyuncaklar",
    gradient: "from-violet-500 to-violet-700",
    icon: BookOpen,
    count: 15890,
    subcategories: ["Roman", "Kişisel Gelişim", "Çocuk Kitabı", "Ders Kitabı", "Biyografi", "Bilim & Teknoloji", "Gitar", "Piyano & Org", "Davul & Perküsyon", "Keman", "Ukulele", "Boyama Seti", "Tuval & Fırça", "Dikiş & Örgü", "Seramik Malzeme", "Kutu Oyunu", "Puzzle", "Satranç", "Lego & Yapboz", "Koleksiyon"],
  },
  "bebek": {
    name: "Anne & Bebek",
    description: "Bebek giyim, arabası, beslenme ve oyuncaklar",
    gradient: "from-pink-500 to-pink-700",
    icon: Baby,
    count: 18720,
    subcategories: ["Yenidoğan (0-3 Ay)", "3-6 Ay", "6-12 Ay", "1-2 Yaş", "Pijama & Tulum", "Çorap & Bere", "Bebek Arabası", "Ana Kucağı", "Bebek Karyolası", "Oto Koltuğu", "Mama Sandalyesi", "Biberon & Emzik", "Mama & Maması", "Bebek Şampuanı", "Islak Mendil", "Bez & Ped", "Eğitici Oyuncak", "Ahşap Oyuncak", "Bebek Yürüteci", "Aktivite Minderi"],
  },
  "mucevher": {
    name: "Mücevher",
    description: "Altın, gümüş, kolye, yüzük ve bilezik koleksiyonları",
    gradient: "from-yellow-500 to-yellow-700",
    icon: Gem,
    count: 9840,
    subcategories: ["Altın Kolye", "Altın Bilezik", "Altın Yüzük", "Altın Küpe", "Altın Kelepçe", "Gümüş Kolye", "Gümüş Bileklik", "Gümüş Yüzük", "Gümüş Küpe", "Pırlanta Yüzük", "Swarovski", "İnci Kolye", "Zirkon Takı", "El Yapımı Takı", "Erkek Saati", "Kadın Saati", "Akıllı Saat", "Saat Kordonu"],
  },
  "market": {
    name: "Süpermarket",
    description: "Gıda, içecek, temizlik ve kişisel bakım ürünleri",
    gradient: "from-teal-500 to-teal-700",
    icon: UtensilsCrossed,
    count: 27430,
    subcategories: ["Bakliyat & Tahıl", "Makarna & Pirinç", "Atıştırmalık", "Çay & Kahve", "Meyve Suyu", "Doğal & Organik", "Şampuan & Saç", "Cilt Bakımı", "Diş Bakımı", "Parfüm", "Deodorant", "Deterjan", "Yüzey Temizleyici", "Çamaşır Ürünleri", "Kağıt Ürünler", "Kedi Maması", "Köpek Maması", "Kedi Kumu", "Evcil Hayvan Oyuncağı"],
  },
  "otomotiv": {
    name: "Otomotiv",
    description: "Araç aksesuarı, yedek parça ve bakım ürünleri",
    gradient: "from-slate-500 to-slate-700",
    icon: Car,
    count: 11540,
    subcategories: ["Araç Tutucu", "Dash Cam", "Araç Şarj Aleti", "Oto Koku", "Araç Minderi", "Güneşlik", "Yaz Lastiği", "Kış Lastiği", "Jant", "Lastik Basınç Ölçer", "Motor Yağı", "Fren Balata", "Hava Filtresi", "Far & Stop", "Silecek", "Akü", "Motosiklet Kaskı", "Motosiklet Eldiveni", "Motosiklet Montu"],
  },
  "el-sanatlari": {
    name: "El Sanatları",
    description: "Seramik, dokuma, ahşap oyma, telkari ve daha fazlası — gerçek el emeği ürünler",
    gradient: "from-amber-400 to-orange-600",
    icon: Package,
    count: 12840,
    subcategories: ["Seramik & Çömlek", "El Dokuma Kilim", "Makramé", "Ahşap Oyma", "Telkari Takı", "Bakır İşleme", "Ebru Sanatı", "Hat Sanatı", "El Nakışı", "Kanaviçe", "Deri İşleme", "Cam Mozaik"],
  },
  "dogal-organik": {
    name: "Doğal & Organik",
    description: "Sertifikalı organik ürünler, bitkisel bakım ve doğal gıda",
    gradient: "from-green-400 to-emerald-700",
    icon: Package,
    count: 8320,
    subcategories: ["Zeytinyağı Sabun", "Bitkisel Şampuan", "Ham Bal", "Organik Çay", "Balmumu Mum", "Uçucu Yağ", "Organik Baharat", "Soğuk Sıkım Yağ", "Kristal & Taş", "Organik Tohum", "Kurutulmuş Meyve"],
  },
  "dijital-rwa": {
    name: "Dijital & RWA",
    description: "Yazılım, dijital içerik, tokenize varlıklar ve freelance hizmetler",
    gradient: "from-indigo-500 to-indigo-700",
    icon: Package,
    count: 5640,
    subcategories: ["Mobil Uygulama", "Online Kurs", "E-Kitap", "Logo & Tasarım", "Web Geliştirme", "SEO Hizmeti", "Tokenize Sanat", "NFT Koleksiyon", "Video İçerik", "Müzik & Ses", "Şablon & Grafik", "Danışmanlık"],
  },
  "teknoloji-mining": {
    name: "Teknoloji & Mining",
    description: "Pi Node ekipmanları, kripto aksesuarlar ve ağ çözümleri",
    gradient: "from-sky-500 to-sky-700",
    icon: Package,
    count: 3180,
    subcategories: ["Raspberry Pi Kit", "SSD & NVMe", "Mini PC", "Hardware Wallet", "VPN Router", "Mesh Wi-Fi", "Güneş Paneli", "LiFePO4 Batarya", "UPS Güç Kaynağı", "NAS Cihazı", "Network Switch", "Seed Phrase Levhası"],
  },
  "ozel-tasarim": {
    name: "Özel Tasarım",
    description: "Kişiye özel, sınırlı üretim ve sanatsal tasarım ürünleri",
    gradient: "from-fuchsia-500 to-fuchsia-700",
    icon: Package,
    count: 4290,
    subcategories: ["Kişiye Özel Takı", "Özel Baskı Kıyafet", "İsme Özel Tablo", "Özel Seramik", "Kişisel Ajanda", "Fotoğraf Ürünleri", "Lazer Kazıma", "3D Baskı", "El Yazısı Hizmet", "Özel Ambalaj"],
  },
  "tumu": {
    name: "Tüm Ürünler",
    description: "Platformumuzdaki tüm ürünleri keşfedin",
    gradient: "from-primary to-orange-600",
    icon: Package,
    count: 314000,
    subcategories: [],
  },
};

const SEED_PRODUCTS = [
  { id: "1",  name: "Wireless Bluetooth Kulaklık Pro",    seller: "TechStore",     price: 89,  originalPrice: 189, discount: 53, rating: 4.9, reviews: 2341, freeShip: true,  tag: "cok-satan" },
  { id: "2",  name: "Kadın Yazlık Çiçek Elbise",          seller: "FashionHub",    price: 75,  originalPrice: 120, discount: 38, rating: 4.7, reviews: 1876, freeShip: true,  tag: "indirim"   },
  { id: "3",  name: "Robot Süpürge Akıllı Haritalama",     seller: "HomeBot",       price: 299, originalPrice: 599, discount: 50, rating: 4.8, reviews: 4210, freeShip: true,  tag: "flash"     },
  { id: "4",  name: "Erkek Spor Koşu Ayakkabısı",         seller: "SportZone",     price: 125, originalPrice: 249, discount: 50, rating: 4.8, reviews: 1543, freeShip: false, tag: "indirim"   },
  { id: "5",  name: "Hakiki Deri Kadın El Çantası",        seller: "LeatherCo",     price: 149, originalPrice: 280, discount: 47, rating: 4.8, reviews: 1254, freeShip: true,  tag: "cok-satan" },
  { id: "6",  name: "Akıllı Saat Fitness GPS",             seller: "SmartGear",     price: 175, originalPrice: 320, discount: 45, rating: 4.9, reviews: 3102, freeShip: true,  tag: "yeni"      },
  { id: "7",  name: "Yoga Matı Anti-Kayma",                seller: "SportZone",     price: 55,  originalPrice: 75,  discount: 27, rating: 4.7, reviews: 2109, freeShip: false, tag: "indirim"   },
  { id: "8",  name: "Kahve Makinesi Tam Otomatik",         seller: "KahveDünyası",  price: 420, originalPrice: 599, discount: 30, rating: 4.9, reviews: 8743, freeShip: true,  tag: "cok-satan" },
  { id: "9",  name: "Erkek Slim Fit Takım Elbise",         seller: "FashionHub",    price: 210, originalPrice: 399, discount: 47, rating: 4.6, reviews: 943,  freeShip: true,  tag: "indirim"   },
  { id: "10", name: "Oyuncu Kulaklığı RGB 7.1",            seller: "GamerZone",     price: 199, originalPrice: 299, discount: 33, rating: 4.8, reviews: 2876, freeShip: false, tag: "yeni"      },
  { id: "11", name: "Çocuk Ahşap Puzzle 500 Parça",        seller: "KidsToys",      price: 35,  originalPrice: 55,  discount: 36, rating: 4.9, reviews: 4521, freeShip: true,  tag: "yeni"      },
  { id: "12", name: "Güneş Gözlüğü UV400 Polarize",        seller: "OpticPlus",     price: 75,  originalPrice: 120, discount: 38, rating: 4.7, reviews: 1876, freeShip: false, tag: "indirim"   },
  { id: "13", name: "Bluetooth Hoparlör Suya Dayanıklı",   seller: "TechStore",     price: 129, originalPrice: 199, discount: 35, rating: 4.8, reviews: 3240, freeShip: true,  tag: "cok-satan" },
  { id: "14", name: "Bebek Arabası 3'ü 1 Arada",           seller: "KidsToys",      price: 499, originalPrice: 799, discount: 38, rating: 4.9, reviews: 1240, freeShip: true,  tag: "yeni"      },
  { id: "15", name: "Mutfak Robot Çok Fonksiyonlu",        seller: "HomeBot",       price: 350, originalPrice: 550, discount: 36, rating: 4.7, reviews: 2870, freeShip: true,  tag: "cok-satan" },
  { id: "16", name: "Dağ Bisikleti 21 Vites",              seller: "SportZone",     price: 750, originalPrice: 1200,discount: 38, rating: 4.8, reviews: 654,  freeShip: false, tag: "indirim"   },
];

const TAG_LABELS: Record<string, { label: string; cls: string }> = {
  flash:      { label: "Flash",     cls: "bg-destructive text-destructive-foreground" },
  indirim:    { label: "İndirim",   cls: "bg-destructive/90 text-white" },
  "cok-satan":{ label: "Çok Satan", cls: "bg-primary text-primary-foreground" },
  yeni:       { label: "Yeni",      cls: "bg-green-600 text-white" },
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const slug = (params?.slug as string) || "tumu";
  const category = CATEGORY_MAP[slug] ?? CATEGORY_MAP["tumu"];

  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 1200]);
  const [onlyFreeShip, setOnlyFreeShip] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);

  const activeFilterCount =
    (priceRange[0] > 0 || priceRange[1] < 1200 ? 1 : 0) +
    (onlyFreeShip ? 1 : 0) +
    (onlyDiscount ? 1 : 0) +
    (activeSubcat ? 1 : 0);

  const clearFilters = () => {
    setPriceRange([0, 1200]);
    setOnlyFreeShip(false);
    setOnlyDiscount(false);
    setActiveSubcat(null);
  };

  const filtered = useMemo(() => {
    let result = SEED_PRODUCTS.filter((p) => {
      const matchPrice   = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchShip    = !onlyFreeShip || p.freeShip;
      const matchDisc    = !onlyDiscount || p.discount > 0;
      return matchPrice && matchShip && matchDisc;
    });

    switch (sortBy) {
      case "newest":     return result.sort((a, b) => (a.tag === "yeni" ? -1 : 1));
      case "price-low":  return result.sort((a, b) => a.price - b.price);
      case "price-high": return result.sort((a, b) => b.price - a.price);
      case "rating":     return result.sort((a, b) => b.rating - a.rating);
      case "discount":   return result.sort((a, b) => b.discount - a.discount);
      default:           return result.sort((a, b) => b.reviews - a.reviews);
    }
  }, [priceRange, onlyFreeShip, onlyDiscount, sortBy]);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const IconComponent = category.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org JSON-LD — CollectionPage + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateCategorySchema({
              name: category.name,
              description: category.description,
              slug,
              productCount: category.count,
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
              { name: category.name, href: `/kategori/${slug}` },
            ])
          ),
        }}
      />

      <Header showBack title={category.name} />

      {/* Category Hero */}
      <div className={`bg-gradient-to-r ${category.gradient} text-white`}>
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{category.name}</h1>
              <p className="text-sm opacity-80">{category.count.toLocaleString("tr-TR")}+ ürün · {category.description}</p>
            </div>
          </div>

          {/* Subcategory chips */}
          {category.subcategories.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-none pb-1">
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcat(activeSubcat === sub ? null : sub)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeSubcat === sub
                      ? "bg-white text-foreground border-white"
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/kategori/tumu" className="hover:text-primary">Kategoriler</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">{category.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-4">

          {/* Sidebar filters — desktop */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-52 flex-shrink-0`}>
            <div className="sticky top-24 bg-card border border-border rounded-xl p-4 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Filtreler</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-primary font-medium">
                    Temizle ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Fiyat Aralığı (π)</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{priceRange[0]}π</span>
                  <span>{priceRange[1]}π</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1200}
                  step={10}
                />
                <div className="flex gap-2 mt-3">
                  {[[0,100],[100,300],[300,1200]].map(([min, max]) => (
                    <button
                      key={`${min}-${max}`}
                      onClick={() => setPriceRange([min, max])}
                      className={`flex-1 text-[11px] py-1 border rounded text-center transition-all ${
                        priceRange[0] === min && priceRange[1] === max
                          ? "border-primary bg-accent text-primary font-semibold"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {min === 0 ? `0–${max}π` : `${min}π+`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Quick options */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Seçenekler</p>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={onlyFreeShip} onCheckedChange={(c) => setOnlyFreeShip(!!c)} />
                    <span className="text-sm flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-primary" />
                      Ücretsiz Kargo
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={onlyDiscount} onCheckedChange={(c) => setOnlyDiscount(!!c)} />
                    <span className="text-sm">Sadece İndirimli</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden relative"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  Filtreler
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1.5 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-primary">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filtered.length}</span> ürün
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">En Popüler</SelectItem>
                  <SelectItem value="newest">En Yeni</SelectItem>
                  <SelectItem value="rating">En Yüksek Puan</SelectItem>
                  <SelectItem value="discount">En Çok İndirimli</SelectItem>
                  <SelectItem value="price-low">Fiyat: Düşükten Yükseğe</SelectItem>
                  <SelectItem value="price-high">Fiyat: Yüksekten Düşüğe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {onlyFreeShip && (
                  <button onClick={() => setOnlyFreeShip(false)} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                    <X className="h-3 w-3" /> Ücretsiz Kargo
                  </button>
                )}
                {onlyDiscount && (
                  <button onClick={() => setOnlyDiscount(false)} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                    <X className="h-3 w-3" /> Sadece İndirimli
                  </button>
                )}
                {activeSubcat && (
                  <button onClick={() => setActiveSubcat(null)} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                    <X className="h-3 w-3" /> {activeSubcat}
                  </button>
                )}
              </div>
            )}

            {/* Products grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Ürün bulunamadı</h3>
                <p className="text-muted-foreground text-sm mb-4">Filtrelerinizi değiştirmeyi deneyin</p>
                <Button onClick={clearFilters} variant="outline">Filtreleri Temizle</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((product) => {
                  const tagInfo = TAG_LABELS[product.tag];
                  return (
                    <Link key={product.id} href={`/urun/${product.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-border group hover:-translate-y-0.5 h-full flex flex-col">
                        <div className="relative aspect-square overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={`/placeholder.svg?height=400&width=400`}
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          {tagInfo && (
                            <Badge className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 font-bold ${tagInfo.cls}`}>
                              {tagInfo.label}
                            </Badge>
                          )}
                          {product.freeShip && (
                            <div className="absolute bottom-2 left-2 bg-card/90 text-[10px] font-semibold text-foreground px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Truck className="h-3 w-3 text-primary" /> Ücretsiz
                            </div>
                          )}
                          <button
                            className="absolute top-2 right-2 bg-card/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => toggleFav(product.id, e)}
                            aria-label="Favorilere ekle"
                          >
                            <Heart className={`h-3.5 w-3.5 ${favorites.includes(product.id) ? "fill-destructive text-destructive" : "text-foreground"}`} />
                          </button>
                        </div>
                        <CardContent className="p-3 flex flex-col gap-1 flex-1">
                          <p className="text-[11px] text-muted-foreground truncate">{product.seller}</p>
                          <h2 className="text-sm font-medium line-clamp-2 leading-snug text-balance flex-1">{product.name}</h2>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary flex-shrink-0" />
                            <span className="text-xs font-semibold">{product.rating}</span>
                            <span className="text-[11px] text-muted-foreground">({product.reviews.toLocaleString("tr-TR")})</span>
                          </div>
                          <div className="flex items-end justify-between gap-1 mt-auto pt-1">
                            <div>
                              <span className="text-sm font-bold text-primary">{product.price}π</span>
                              {product.discount > 0 && (
                                <span className="text-[11px] text-muted-foreground line-through ml-1.5">{product.originalPrice}π</span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="h-7 text-xs px-2.5 flex-shrink-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem({ productId: Number(product.id), name: product.name, artisan: product.seller, price: product.price, quantity: 1, image: `/placeholder.svg?height=400&width=400` });
                              }}
                            >
                              Ekle
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
