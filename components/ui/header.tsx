"use client";

import { useState, useRef } from "react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  ShoppingBag,
  Heart,
  User,
  Bell,
  Search,
  ChevronDown,
  ArrowLeft,
  LogOut,
  Shield,
  Package,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Baby,
  Car,
  Gem,
  UtensilsCrossed,
  X,
  Wallet,
  HandMetal,
  Leaf,
  Sparkles,
  LayoutGrid,
  MonitorSmartphone,
  Cpu,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { SmartSearch } from "@/components/smart-search";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { ThemeToggle } from "@/components/theme-toggle";
import { UcbLogo } from "@/components/ucb-logo";

type HeaderProps = {
  showBack?: boolean;
  title?: string;
};

type SubGroup = { title: string; items: string[] };

const MEGA_CATEGORIES: {
  label: string;
  icon: React.ElementType;
  href: string;
  featured?: string;
  badge?: string;
  groups: SubGroup[];
}[] = [
  {
    label: "El Sanatlari",
    icon: HandMetal,
    href: "/kategori/el-sanatlari",
    featured: "Handmade Koleksiyon",
    badge: "Yeni",
    groups: [
      { title: "Seramik & Cam", items: ["El Yapımı Kupa", "Seramik Tabak", "Cam Vazo", "Mozaik", "Vitray", "Çömlek"] },
      { title: "Dokuma & Tekstil", items: ["El Dokuma Halı", "Kilim", "Makramé", "El Nakışı", "Kanaviçe", "Örgü"] },
      { title: "Ahsap & Metal", items: ["Ahşap Oyma", "Telkari Takı", "Bakır İşleme", "Kazıma Sanatı", "Ahşap Tablo", "Demir Forje"] },
      { title: "Kagıt & Diger", items: ["Ebru Sanatı", "Minyatür", "Hat Sanatı", "Origami", "Deri İşleme", "Boncuk İşi"] },
    ],
  },
  {
    label: "Dogal & Organik",
    icon: Leaf,
    href: "/kategori/dogal-organik",
    featured: "Sertifikalı Organik",
    groups: [
      { title: "Kisisel Bakim", items: ["Zeytinyağı Sabun", "Doğal Şampuan", "Bitkisel Krem", "Organik Yüz Maskesi", "Bal Bazlı Ürünler", "Argan Yağı"] },
      { title: "Gıda & Takviye", items: ["Ham Bal", "Bitkisel Çay", "Kurutulmuş Meyve", "Soğuk Sıkım Yağ", "Organik Baharat", "Üzüm Pekmezi"] },
      { title: "Ev & Aromaterapi", items: ["Uçucu Yağ", "Balmumu Mum", "Lavanta Kesesi", "Doğal Temizlik", "Kristal & Taş", "Difüzör"] },
      { title: "Bahce & Tohum", items: ["Organik Tohum", "Saksı Toprak", "Fide", "Gübre", "Bahçe Seti", "Solucan Gübre"] },
    ],
  },
  {
    label: "Dijital & RWA",
    icon: MonitorSmartphone,
    href: "/kategori/dijital-rwa",
    featured: "Pi Ekosistemi Ürünleri",
    badge: "Pi",
    groups: [
      { title: "Yazılım & Uygulama", items: ["Mobil Uygulama", "Web Uygulaması", "SaaS Abonelik", "API Erişimi", "Browser Eklentisi", "Masaüstü Yazılımı"] },
      { title: "Dijital İçerik", items: ["Online Kurs", "E-Kitap", "Müzik & Ses", "Fotoğraf & Vektör", "Video İçerik", "Şablon & Tasarım"] },
      { title: "RWA & Token", items: ["Tokenize Sanat Eseri", "Gayrimenkul Payı", "İş Ortaklığı Payı", "NFT Koleksiyon", "Pi Vadeli Sözleşme", "DeFi Ürün"] },
      { title: "Freelance & Hizmet", items: ["Logo & Grafik Tasarım", "Web Geliştirme", "SEO & Pazarlama", "Çeviri & Metin", "Video Montaj", "Danışmanlık"] },
    ],
  },
  {
    label: "Teknoloji & Mining",
    icon: Cpu,
    href: "/kategori/teknoloji-mining",
    featured: "Pi Node & Ekipman",
    badge: "Yeni",
    groups: [
      { title: "Pi Node Ekipmanı", items: ["Raspberry Pi Kit", "SSD & NVMe", "Mini PC", "Network Switch", "PoE Adaptör", "UPS Güç Kaynağı"] },
      { title: "Kripto Aksesuar", items: ["Ledger Hardware Wallet", "Soğuk Cüzdan Kasası", "Seed Phrase Levhası", "Güvenlik Anahtarı", "RFID Koruyucu Kılıf"] },
      { title: "Ağ & Güvenlik", items: ["VPN Router", "Firewall Cihazı", "Mesh Wi-Fi", "Ethernet Kablo", "Fiber Ağ Ekipmanı", "NAS Cihazı"] },
      { title: "Yenilenebilir Enerji", items: ["Güneş Paneli", "Şarj Kontrolcüsü", "LiFePO4 Batarya", "DC-DC Dönüştürücü", "Enerji Monitörü", "Akıllı Priz"] },
    ],
  },
  {
    label: "Elektronik",
    icon: Smartphone,
    href: "/kategori/elektronik",
    featured: "Telefon Modelleri",
    groups: [
      { title: "Telefon & Aksesuar", items: ["Cep Telefonu", "Kılıf & Koruyucu", "Şarj Aleti", "Kulaklık", "Powerbank", "Akıllı Saat"] },
      { title: "Bilgisayar", items: ["Laptop", "Masaüstü PC", "Tablet", "Monitör", "Klavye & Mouse", "SSD & Bellek"] },
      { title: "TV & Ses", items: ["Akıllı TV", "Soundbar", "Bluetooth Hoparlör", "Projeksiyon", "Ev Sinema"] },
      { title: "Oyun & Konsol", items: ["PlayStation", "Xbox", "Nintendo Switch", "Oyun Kolu", "Oyuncu Monitörü", "VR Gözlük"] },
    ],
  },
  {
    label: "Giyim & Moda",
    icon: Shirt,
    href: "/kategori/giyim-aksesuar",
    featured: "Sezon Trendleri",
    groups: [
      { title: "Kadın Giyim", items: ["Elbise", "Bluz & Gömlek", "Pantolon & Tayt", "Etek", "Mont & Kaban", "Pijama & İç Giyim"] },
      { title: "Erkek Giyim", items: ["T-shirt & Polo", "Gömlek", "Pantolon & Jean", "Sweatshirt", "Takım Elbise", "Mont & Yelek"] },
      { title: "Çocuk Giyim", items: ["Kız Çocuk", "Erkek Çocuk", "Bebek Kıyafeti", "Okul Üniforması", "Pijama Takımı"] },
      { title: "Ayakkabı & Çanta", items: ["Spor Ayakkabı", "Topuklu Ayakkabı", "Bot & Çizme", "El Çantası", "Sırt Çantası", "Cüzdan"] },
    ],
  },
  {
    label: "Ev & Yaşam",
    icon: Home,
    href: "/kategori/ev-dekorasyonu",
    featured: "Ev Dekorasyonu",
    groups: [
      { title: "Mobilya", items: ["Koltuk & Kanepe", "Yatak Odası", "Yemek Odası", "Çalışma Masası", "Gardırop", "Raf & Kitaplık"] },
      { title: "Dekorasyon", items: ["Tablo & Duvar Sanatı", "Vazo & Saksı", "Mum & Mumluk", "Ayna", "Halı & Kilim", "Yastık & Örtü"] },
      { title: "Mutfak & Banyo", items: ["Tencere & Tava", "Kahve Makinesi", "Blender", "Fırın Eldiveni", "Banyo Seti", "Havlu"] },
      { title: "Bahçe & Aydınlatma", items: ["Bahçe Mobilyası", "Saksı & Toprak", "Avize", "LED Aydınlatma", "Masa Lambası", "Şerit LED"] },
    ],
  },
  {
    label: "Spor & Outdoor",
    icon: Dumbbell,
    href: "/kategori/spor",
    featured: "Fitness Ürünleri",
    groups: [
      { title: "Spor Giyim", items: ["Koşu Ayakkabısı", "Spor Tayt", "Spor Sütyeni", "Forma & Şort", "Spor Çantası", "Terlik"] },
      { title: "Fitness & Gym", items: ["Dambıl & Halter", "Yoga Matı", "Protein Tozu", "Pilates Aleti", "İp Atlama", "Egzersiz Bandı"] },
      { title: "Outdoor & Kamp", items: ["Çadır", "Uyku Tulumu", "Trekking Ayakkabısı", "Su Matarası", "Kamp Ocağı", "El Feneri"] },
      { title: "Bisiklet & Su Sporları", items: ["Bisiklet", "Bisiklet Kaskı", "Yüzme Gözlüğü", "Mayo", "Sörf Tahtası", "Kayak"] },
    ],
  },
  {
    label: "Kitap & Hobi",
    icon: BookOpen,
    href: "/kategori/kitap",
    featured: "En Çok Satanlar",
    groups: [
      { title: "Kitap", items: ["Roman", "Kişisel Gelişim", "Çocuk Kitabı", "Ders Kitabı", "Biyografi", "Bilim & Teknoloji"] },
      { title: "Müzik & Enstrüman", items: ["Gitar", "Piyano & Org", "Davul & Perküsyon", "Keman", "Ukulele", "Nota & Aksesuar"] },
      { title: "Sanat & El İşi", items: ["Boyama Seti", "Tuval & Fırça", "Dikiş & Örgü", "Maket Yapımı", "Seramik Malzeme", "Kolaj"] },
      { title: "Oyun & Puzzle", items: ["Kutu Oyunu", "Puzzle", "Satranç", "Lego & Yapboz", "Aksiyon Figürü", "Koleksiyon"] },
    ],
  },
  {
    label: "Anne & Bebek",
    icon: Baby,
    href: "/kategori/bebek",
    featured: "Bebek Bakım",
    groups: [
      { title: "Bebek Giyim", items: ["Yenidoğan (0-3 Ay)", "3-6 Ay", "6-12 Ay", "1-2 Yaş", "Pijama & Tulum", "Çorap & Bere"] },
      { title: "Bebek Araç Gereçleri", items: ["Bebek Arabası", "Ana Kucağı", "Bebek Karyolası", "Oto Koltuğu", "Mama Sandalyesi", "Bebek Monitörü"] },
      { title: "Beslenme & Bakım", items: ["Biberon & Emzik", "Mama & Maması", "Bebek Şampuanı", "Islak Mendil", "Bez & Ped", "Buhar Sterilizatörü"] },
      { title: "Oyun & Gelişim", items: ["Eğitici Oyuncak", "Ahşap Oyuncak", "Bebek Yürüteci", "Aktivite Minderi", "Çıngırak", "Müzikli Oyuncak"] },
    ],
  },
  {
    label: "Otomotiv",
    icon: Car,
    href: "/kategori/otomotiv",
    featured: "Araç Bakım",
    groups: [
      { title: "Araç Aksesuar", items: ["Araç Tutucu", "Dash Cam (Araç Kamerası)", "Araç Şarj Aleti", "Oto Koku", "Araç Minderi", "Güneşlik"] },
      { title: "Lastik & Jant", items: ["Yaz Lastiği", "Kış Lastiği", "4 Mevsim Lastik", "Jant", "Lastik Basınç Ölçer"] },
      { title: "Yedek Parça & Bakım", items: ["Motor Yağı", "Fren Balata", "Hava Filtresi", "Far & Stop", "Silecek", "Akü"] },
      { title: "Motosiklet & Bisiklet", items: ["Motosiklet Kaskı", "Motosiklet Eldiveni", "Motosiklet Montu", "Motor Kilidi", "Bisiklet Kilidi"] },
    ],
  },
  {
    label: "Mücevher",
    icon: Gem,
    href: "/kategori/mucevher",
    featured: "Özel Tasarım",
    groups: [
      { title: "Altın Takı", items: ["Altın Kolye", "Altın Bilezik", "Altın Yüzük", "Altın Küpe", "Altın Kelepçe"] },
      { title: "Gümüş Takı", items: ["Gümüş Kolye", "Gümüş Bileklik", "Gümüş Yüzük", "Gümüş Küpe", "Gümüş Broş"] },
      { title: "Taşlı & Özel Tasarım", items: ["Pırlanta Yüzük", "Swarovski", "İnci Kolye", "Zirkon Takı", "El Yapımı Takı"] },
      { title: "Saat", items: ["Erkek Saati", "Kadın Saati", "Akıllı Saat", "Cep Saati", "Saat Kordonu"] },
    ],
  },
  {
    label: "Süpermarket",
    icon: UtensilsCrossed,
    href: "/kategori/market",
    featured: "Günlük İhtiyaçlar",
    groups: [
      { title: "Gıda & İçecek", items: ["Bakliyat & Tahıl", "Makarna & Pirinç", "Atıştırmalık", "Çay & Kahve", "Meyve Suyu", "Doğal & Organik"] },
      { title: "Kişisel Bakım", items: ["Şampuan & Saç", "Cilt Bakımı", "Diş Bakımı", "Parfüm", "Deodorant", "Tıraş"] },
      { title: "Temizlik", items: ["Deterjan", "Yüzey Temizleyici", "Çamaşır Ürünleri", "Bulaşık Ürünleri", "Kağıt Ürünler", "Çöp Poşeti"] },
      { title: "Evcil Hayvan", items: ["Kedi Maması", "Köpek Maması", "Kedi Kumu", "Oyuncak", "Tasma & Kayış", "Kafes & Akvaryum"] },
    ],
  },
];

function MobileCategoryItem({ cat }: { cat: typeof MEGA_CATEGORIES[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = cat.icon;
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
      >
        <span className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-primary flex-shrink-0" />
          {cat.label}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="ml-7 mb-1 space-y-3">
          {cat.groups.map((group) => (
            <div key={group.title}>
              <Link
                href={`${cat.href}?alt=${encodeURIComponent(group.title)}`}
                className="block text-xs font-bold text-primary uppercase tracking-wider py-1"
              >
                {group.title}
              </Link>
              <div className="grid grid-cols-2 gap-x-2">
                {group.items.map((item) => (
                  <Link
                    key={item}
                    href={`${cat.href}?alt=${encodeURIComponent(item)}`}
                    className="text-xs text-muted-foreground hover:text-primary py-0.5 truncate"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href={cat.href} className="block text-xs font-semibold text-primary py-1">
            Tümünü Gör →
          </Link>
        </div>
      )}
    </div>
  );
}

export function Header({ showBack = false, title }: HeaderProps) {
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const { scrolled, visible } = useScrollDirection();
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = (label: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(label);
  };

  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(null), 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top bar — promo strip */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 font-medium hidden md:block">
        Pi Network ile ode, %5 ekstra indirim kazan! &nbsp;·&nbsp; Ucretsiz kargo 150π ustu siparisler
      </div>

      {/* Main header */}
      <div className={`bg-card border-b border-border ${scrolled ? "shadow-sm" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-14 md:h-16 items-center gap-3">
            {/* Mobile: back or menu */}
            {showBack ? (
              <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <UcbLogo size="sm" />
                  </div>
                  <nav className="overflow-y-auto h-full pb-20">
                    <div className="p-4">
                      {isLoggedIn && user ? (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-accent rounded-lg">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            {user.piUsername?.charAt(0)?.toUpperCase() ?? "π"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{user.piUsername}</p>
                            <p className="text-xs text-muted-foreground">Hesabıma Git</p>
                          </div>
                        </div>
                      ) : (
                        <Link href="/giris" className="block mb-4">
                          <div className="flex items-center gap-3 p-3 bg-primary text-primary-foreground rounded-lg">
                            <User className="h-5 w-5" />
                            <span className="font-semibold">Giriş Yap / Kayıt Ol</span>
                          </div>
                        </Link>
                      )}
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Kategoriler</p>
                      {MEGA_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <MobileCategoryItem key={cat.label} cat={cat} />
                        );
                      })}
                      <div className="border-t border-border my-3" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hesabım</p>
                      {isLoggedIn ? (
                        <>
                          <Link href="/profil" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"><User className="h-4 w-4" /> Profilim</Link>
                          <Link href="/profil?tab=orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"><Package className="h-4 w-4" /> Siparişlerim</Link>
                          <Link href="/favoriler" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"><Heart className="h-4 w-4" /> Favorilerim</Link>
                          <Link href="/panel" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"><Package className="h-4 w-4" /> Satıcı Paneli</Link>
                          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"><Shield className="h-4 w-4" /> Yönetim</Link>
                          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm font-medium w-full text-left">
                            <LogOut className="h-4 w-4" /> Çıkış Yap
                          </button>
                        </>
                      ) : null}
                      <div className="border-t border-border my-3" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tercihler</p>
                      <ThemeToggle variant="full" />
                      <div className="border-t border-border my-3" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Kurumsal</p>
                      <Link href="/hakkimizda" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">Hakkımızda</Link>
                      <Link href="/iletisim" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">İletişim</Link>
                      <Link href="/yardim" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">Yardım Merkezi</Link>
                      <Link href="/gizlilik" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">Gizlilik Politikası</Link>
                      <Link href="/kullanim-kosullari" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">Kullanım Koşulları</Link>
                      <Link href="/kvkk" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">KVKK</Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            )}

            {/* Logo */}
            <div className="flex-shrink-0">
              {title && showBack ? (
                <span className="font-bold text-base text-foreground line-clamp-1 max-w-[140px]">{title}</span>
              ) : (
                <UcbLogo size="sm" className="md:hidden" />
              )}
              {!showBack && <UcbLogo size="md" className="hidden md:flex" />}
            </div>

            {/* Smart Search — desktop */}
            <SmartSearch className="flex-1 hidden sm:block" />

            {/* Right icons */}
            <div className="flex items-center gap-0.5 ml-auto sm:ml-0 flex-shrink-0">
              {/* Mobile search */}
              <Link href="/ara" className="sm:hidden">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>

              <span className="hidden md:flex">
                <ThemeToggle variant="icon" />
              </span>
              <Link href="/bildirimler" className="hidden md:flex">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
              {/* Pi Wallet — always visible */}
              <Link href={isLoggedIn ? "/profil" : "/giris"}>
                <Button variant="ghost" size="icon" className="relative" title="Pi Cüzdanım">
                  <Wallet className="h-5 w-5" />
                  {isLoggedIn && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500" />
                  )}
                </Button>
              </Link>

              <Link href="/favoriler">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sepet">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href={isLoggedIn ? "/profil" : "/giris"} className="hidden md:flex">
                {isLoggedIn && user ? (
                  <div className="flex items-center gap-1.5 h-9 px-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-foreground">
                        {user.piUsername?.charAt(0)?.toUpperCase() ?? "π"}
                      </span>
                    </div>
                    <span className="text-xs font-medium hidden lg:block max-w-[80px] truncate">
                      {user.piUsername}
                    </span>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-medium">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Giriş Yap</span>
                  </Button>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category nav bar — desktop */}
      <div className="hidden md:block bg-card border-b border-border relative z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {MEGA_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isOpen = megaOpen === cat.label;
              return (
                <div
                  key={cat.label}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => openMega(cat.label)}
                  onMouseLeave={closeMega}
                >
                  <Link
                    href={cat.href}
                    className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                      isOpen
                        ? "text-primary border-primary bg-primary/5"
                        : "text-foreground/70 hover:text-primary border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {cat.label}
                    {cat.badge && (
                      <span className="ml-0.5 px-1 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded leading-none">
                        {cat.badge}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-3 w-3 flex-shrink-0 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </Link>

                  {/* Mega dropdown — tam genislik, cok sutunlu panel */}
                  {isOpen && (
                    <div
                      className="fixed left-0 right-0 z-50 bg-card border-b border-border shadow-2xl animate-fade-in"
                      style={{ top: "inherit" }}
                      onMouseEnter={() => openMega(cat.label)}
                      onMouseLeave={closeMega}
                    >
                      <div className="container mx-auto px-4 py-5">
                        <div className="flex gap-6">
                          {/* Sol: kategori kimlik paneli */}
                          <div className="flex-shrink-0 w-44 flex flex-col gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{cat.label}</p>
                                {cat.featured && (
                                  <p className="text-[11px] text-muted-foreground">{cat.featured}</p>
                                )}
                              </div>
                            </div>
                            <Link
                              href={cat.href}
                              className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                              Tümünü Gör <ChevronDown className="h-3 w-3 -rotate-90" />
                            </Link>
                            {/* Alt kategoriler kısa listesi */}
                            <ul className="space-y-0.5">
                              {cat.groups.map((g) => (
                                <li key={g.title}>
                                  <Link
                                    href={`${cat.href}?alt=${encodeURIComponent(g.title)}`}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors py-0.5 block truncate"
                                  >
                                    {g.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Ayırıcı */}
                          <div className="w-px bg-border flex-shrink-0" />

                          {/* Sag: çok sutunlu alt kategoriler */}
                          <div
                            className="flex-1 grid gap-x-6 gap-y-4"
                            style={{ gridTemplateColumns: `repeat(${Math.min(cat.groups.length, 4)}, 1fr)` }}
                          >
                            {cat.groups.map((group) => (
                              <div key={group.title}>
                                <Link
                                  href={`${cat.href}?alt=${encodeURIComponent(group.title)}`}
                                  className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 hover:text-primary transition-colors pb-1 border-b border-border"
                                >
                                  {group.title}
                                </Link>
                                <ul className="space-y-1.5">
                                  {group.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        href={`${cat.href}?alt=${encodeURIComponent(item)}`}
                                        className="text-sm text-muted-foreground hover:text-primary hover:pl-1 transition-all py-0.5 block leading-tight"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Satıcı ol */}
            <div className="ml-auto flex-shrink-0">
              <Link
                href="/basvuru"
                className="flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-primary whitespace-nowrap hover:text-primary/80 transition-colors"
              >
                Satici Ol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
