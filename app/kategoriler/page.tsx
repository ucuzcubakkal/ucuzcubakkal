"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, HandMetal, Leaf, Smartphone, Shirt, Home, Dumbbell, BookOpen, Baby, Car, Gem, UtensilsCrossed, Sparkles, MonitorSmartphone, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

type SubGroup = { title: string; items: string[] };
type Category = {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
  iconColor: string;
  groups: SubGroup[];
};

const CATEGORIES: Category[] = [
  {
    label: "El Sanatlari", icon: HandMetal, href: "/kategori/el-sanatlari",
    color: "bg-amber-100 dark:bg-amber-950/40", iconColor: "text-amber-600",
    groups: [
      { title: "Seramik & Cam", items: ["El Yapımı Kupa", "Seramik Tabak", "Cam Vazo", "Mozaik", "Vitray", "Çömlek"] },
      { title: "Dokuma & Tekstil", items: ["El Dokuma Halı", "Kilim", "Makramé", "El Nakışı", "Kanaviçe", "Örgü"] },
      { title: "Ahsap & Metal", items: ["Ahşap Oyma", "Telkari Takı", "Bakır İşleme", "Kazıma Sanatı", "Ahşap Tablo", "Demir Forje"] },
      { title: "Kagıt & Diger", items: ["Ebru Sanatı", "Minyatür", "Hat Sanatı", "Origami", "Deri İşleme", "Boncuk İşi"] },
    ],
  },
  {
    label: "Dogal & Organik", icon: Leaf, href: "/kategori/dogal-organik",
    color: "bg-green-100 dark:bg-green-950/40", iconColor: "text-green-600",
    groups: [
      { title: "Kisisel Bakim", items: ["Zeytinyağı Sabun", "Doğal Şampuan", "Bitkisel Krem", "Organik Yüz Maskesi", "Bal Bazlı Ürünler", "Argan Yağı"] },
      { title: "Gıda & Takviye", items: ["Ham Bal", "Bitkisel Çay", "Kurutulmuş Meyve", "Soğuk Sıkım Yağ", "Organik Baharat", "Üzüm Pekmezi"] },
      { title: "Ev & Aromaterapi", items: ["Uçucu Yağ", "Balmumu Mum", "Lavanta Kesesi", "Doğal Temizlik", "Kristal & Taş", "Difüzör"] },
      { title: "Bahce & Tohum", items: ["Organik Tohum", "Saksı Toprak", "Fide", "Gübre", "Bahçe Seti", "Solucan Gübre"] },
    ],
  },
  {
    label: "Dijital & RWA", icon: MonitorSmartphone, href: "/kategori/dijital-rwa",
    color: "bg-indigo-100 dark:bg-indigo-950/40", iconColor: "text-indigo-600",
    groups: [
      { title: "Yazılım & Uygulama", items: ["Mobil Uygulama", "Web Uygulaması", "SaaS Abonelik", "API Erişimi", "Browser Eklentisi", "Masaüstü Yazılımı"] },
      { title: "Dijital İçerik", items: ["Online Kurs", "E-Kitap", "Müzik & Ses", "Fotoğraf & Vektör", "Video İçerik", "Şablon & Tasarım"] },
      { title: "RWA & Token", items: ["Tokenize Sanat Eseri", "Gayrimenkul Payı", "İş Ortaklığı Payı", "NFT Koleksiyon", "Pi Vadeli Sözleşme", "DeFi Ürün"] },
      { title: "Freelance & Hizmet", items: ["Logo & Grafik Tasarım", "Web Geliştirme", "SEO & Pazarlama", "Çeviri & Metin", "Video Montaj", "Danışmanlık"] },
    ],
  },
  {
    label: "Teknoloji & Mining", icon: Cpu, href: "/kategori/teknoloji-mining",
    color: "bg-sky-100 dark:bg-sky-950/40", iconColor: "text-sky-600",
    groups: [
      { title: "Pi Node Ekipmanı", items: ["Raspberry Pi Kit", "SSD & NVMe", "Mini PC", "Network Switch", "PoE Adaptör", "UPS Güç Kaynağı"] },
      { title: "Kripto Aksesuar", items: ["Ledger Hardware Wallet", "Soğuk Cüzdan Kasası", "Seed Phrase Levhası", "Güvenlik Anahtarı", "RFID Koruyucu Kılıf"] },
      { title: "Ağ & Güvenlik", items: ["VPN Router", "Firewall Cihazı", "Mesh Wi-Fi", "Ethernet Kablo", "Fiber Ağ Ekipmanı", "NAS Cihazı"] },
      { title: "Yenilenebilir Enerji", items: ["Güneş Paneli", "Şarj Kontrolcüsü", "LiFePO4 Batarya", "DC-DC Dönüştürücü", "Enerji Monitörü", "Akıllı Priz"] },
    ],
  },
  {
    label: "Elektronik", icon: Smartphone, href: "/kategori/elektronik",
    color: "bg-blue-100 dark:bg-blue-950/40", iconColor: "text-blue-600",
    groups: [
      { title: "Telefon & Aksesuar", items: ["Cep Telefonu", "Kılıf & Koruyucu", "Şarj Aleti", "Kulaklık", "Powerbank", "Akıllı Saat"] },
      { title: "Bilgisayar", items: ["Laptop", "Masaüstü PC", "Tablet", "Monitör", "Klavye & Mouse", "SSD & Bellek"] },
      { title: "TV & Ses", items: ["Akıllı TV", "Soundbar", "Bluetooth Hoparlör", "Projeksiyon", "Ev Sinema"] },
      { title: "Oyun & Konsol", items: ["PlayStation", "Xbox", "Nintendo Switch", "Oyun Kolu", "Oyuncu Monitörü", "VR Gözlük"] },
    ],
  },
  {
    label: "Giyim & Moda", icon: Shirt, href: "/kategori/giyim-aksesuar",
    color: "bg-rose-100 dark:bg-rose-950/40", iconColor: "text-rose-600",
    groups: [
      { title: "Kadın Giyim", items: ["Elbise", "Bluz & Gömlek", "Pantolon & Tayt", "Etek", "Mont & Kaban", "Pijama & İç Giyim"] },
      { title: "Erkek Giyim", items: ["T-shirt & Polo", "Gömlek", "Pantolon & Jean", "Sweatshirt", "Takım Elbise", "Mont & Yelek"] },
      { title: "Çocuk Giyim", items: ["Kız Çocuk", "Erkek Çocuk", "Bebek Kıyafeti", "Okul Üniforması", "Pijama Takımı"] },
      { title: "Ayakkabı & Çanta", items: ["Spor Ayakkabı", "Topuklu Ayakkabı", "Bot & Çizme", "El Çantası", "Sırt Çantası", "Cüzdan"] },
    ],
  },
  {
    label: "Ev & Yasam", icon: Home, href: "/kategori/ev-dekorasyonu",
    color: "bg-orange-100 dark:bg-orange-950/40", iconColor: "text-orange-600",
    groups: [
      { title: "Mobilya", items: ["Koltuk & Kanepe", "Yatak Odası", "Yemek Odası", "Çalışma Masası", "Gardırop", "Raf & Kitaplık"] },
      { title: "Dekorasyon", items: ["Tablo & Duvar Sanatı", "Vazo & Saksı", "Mum & Mumluk", "Ayna", "Halı & Kilim", "Yastık & Örtü"] },
      { title: "Mutfak & Banyo", items: ["Tencere & Tava", "Kahve Makinesi", "Blender", "Fırın Eldiveni", "Banyo Seti", "Havlu"] },
      { title: "Bahce & Aydınlatma", items: ["Bahçe Mobilyası", "Saksı & Toprak", "Avize", "LED Aydınlatma", "Masa Lambası", "Şerit LED"] },
    ],
  },
  {
    label: "Spor & Outdoor", icon: Dumbbell, href: "/kategori/spor",
    color: "bg-cyan-100 dark:bg-cyan-950/40", iconColor: "text-cyan-600",
    groups: [
      { title: "Spor Giyim", items: ["Koşu Ayakkabısı", "Spor Tayt", "Spor Sütyeni", "Forma & Şort", "Spor Çantası", "Terlik"] },
      { title: "Fitness & Gym", items: ["Dambıl & Halter", "Yoga Matı", "Protein Tozu", "Pilates Aleti", "İp Atlama", "Egzersiz Bandı"] },
      { title: "Outdoor & Kamp", items: ["Çadır", "Uyku Tulumu", "Trekking Ayakkabısı", "Su Matarası", "Kamp Ocağı", "El Feneri"] },
      { title: "Bisiklet & Su", items: ["Bisiklet", "Bisiklet Kaskı", "Yüzme Gözlüğü", "Mayo", "Sörf Tahtası", "Kayak"] },
    ],
  },
  {
    label: "Kitap & Hobi", icon: BookOpen, href: "/kategori/kitap",
    color: "bg-violet-100 dark:bg-violet-950/40", iconColor: "text-violet-600",
    groups: [
      { title: "Kitap", items: ["Roman", "Kişisel Gelişim", "Çocuk Kitabı", "Ders Kitabı", "Biyografi", "Bilim & Teknoloji"] },
      { title: "Muzik & Enstruman", items: ["Gitar", "Piyano & Org", "Davul & Perküsyon", "Keman", "Ukulele", "Nota & Aksesuar"] },
      { title: "Sanat & El Isi", items: ["Boyama Seti", "Tuval & Fırça", "Dikiş & Örgü", "Maket Yapımı", "Seramik Malzeme", "Kolaj"] },
      { title: "Oyun & Puzzle", items: ["Kutu Oyunu", "Puzzle", "Satranç", "Lego & Yapboz", "Aksiyon Figürü", "Koleksiyon"] },
    ],
  },
  {
    label: "Anne & Bebek", icon: Baby, href: "/kategori/bebek",
    color: "bg-pink-100 dark:bg-pink-950/40", iconColor: "text-pink-600",
    groups: [
      { title: "Bebek Giyim", items: ["Yenidoğan (0-3 Ay)", "3-6 Ay", "6-12 Ay", "1-2 Yaş", "Pijama & Tulum", "Çorap & Bere"] },
      { title: "Bebek Arac Gerecleri", items: ["Bebek Arabası", "Ana Kucağı", "Bebek Karyolası", "Oto Koltuğu", "Mama Sandalyesi", "Bebek Monitörü"] },
      { title: "Beslenme & Bakım", items: ["Biberon & Emzik", "Mama & Maması", "Bebek Şampuanı", "Islak Mendil", "Bez & Ped", "Buhar Sterilizatörü"] },
      { title: "Oyun & Gelisim", items: ["Eğitici Oyuncak", "Ahşap Oyuncak", "Bebek Yürüteci", "Aktivite Minderi", "Çıngırak", "Müzikli Oyuncak"] },
    ],
  },
  {
    label: "Otomotiv", icon: Car, href: "/kategori/otomotiv",
    color: "bg-slate-100 dark:bg-slate-950/40", iconColor: "text-slate-600",
    groups: [
      { title: "Arac Aksesuar", items: ["Araç Tutucu", "Dash Cam", "Araç Şarj Aleti", "Oto Koku", "Araç Minderi", "Güneşlik"] },
      { title: "Lastik & Jant", items: ["Yaz Lastiği", "Kış Lastiği", "4 Mevsim Lastik", "Jant", "Lastik Basınç Ölçer"] },
      { title: "Yedek Parca & Bakım", items: ["Motor Yağı", "Fren Balata", "Hava Filtresi", "Far & Stop", "Silecek", "Akü"] },
      { title: "Motosiklet & Bisiklet", items: ["Motosiklet Kaskı", "Motosiklet Eldiveni", "Motosiklet Montu", "Motor Kilidi", "Bisiklet Kilidi"] },
    ],
  },
  {
    label: "Mucevher & Saat", icon: Gem, href: "/kategori/mucevher",
    color: "bg-yellow-100 dark:bg-yellow-950/40", iconColor: "text-yellow-600",
    groups: [
      { title: "Altın Takı", items: ["Altın Kolye", "Altın Bilezik", "Altın Yüzük", "Altın Küpe", "Altın Kelepçe"] },
      { title: "Gümüs Takı", items: ["Gümüş Kolye", "Gümüş Bileklik", "Gümüş Yüzük", "Gümüş Küpe", "Gümüş Broş"] },
      { title: "Tasli & Ozel Tasarım", items: ["Pırlanta Yüzük", "Swarovski", "İnci Kolye", "Zirkon Takı", "El Yapımı Takı"] },
      { title: "Saat", items: ["Erkek Saati", "Kadın Saati", "Akıllı Saat", "Cep Saati", "Saat Kordonu"] },
    ],
  },
  {
    label: "Supermarket", icon: UtensilsCrossed, href: "/kategori/market",
    color: "bg-teal-100 dark:bg-teal-950/40", iconColor: "text-teal-600",
    groups: [
      { title: "Gıda & Icecek", items: ["Bakliyat & Tahıl", "Makarna & Pirinç", "Atıştırmalık", "Çay & Kahve", "Meyve Suyu", "Doğal & Organik"] },
      { title: "Kisisel Bakım", items: ["Şampuan & Saç", "Cilt Bakımı", "Diş Bakımı", "Parfüm", "Deodorant", "Tıraş"] },
      { title: "Temizlik", items: ["Deterjan", "Yüzey Temizleyici", "Çamaşır Ürünleri", "Bulaşık Ürünleri", "Kağıt Ürünler", "Çöp Poşeti"] },
      { title: "Evcil Hayvan", items: ["Kedi Maması", "Köpek Maması", "Kedi Kumu", "Oyuncak", "Tasma & Kayış", "Kafes & Akvaryum"] },
    ],
  },
];

function CategoryRow({ cat }: { cat: Category }) {
  const [open, setOpen] = useState(false);
  const Icon = cat.icon;
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 w-full px-4 py-3.5 text-left active:bg-muted/60 transition-colors"
      >
        <div className={`h-9 w-9 rounded-xl ${cat.color} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${cat.iconColor}`} />
        </div>
        <span className="flex-1 text-sm font-semibold text-foreground">{cat.label}</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{cat.groups.reduce((a, g) => a + g.items.length, 0)} ürün grubu</span>
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="bg-muted/30 px-4 pb-4 space-y-4">
          {cat.groups.map((group) => (
            <div key={group.title}>
              <Link
                href={`${cat.href}?alt=${encodeURIComponent(group.title)}`}
                className="block text-xs font-bold text-primary uppercase tracking-wider py-2"
              >
                {group.title}
              </Link>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item}
                    href={`${cat.href}?alt=${encodeURIComponent(item)}`}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary py-1 transition-colors"
                  >
                    <span className="h-1 w-1 rounded-full bg-border flex-shrink-0" />
                    {item}
                  </Link>
                ))}
              </div>
              <Link
                href={`${cat.href}?alt=${encodeURIComponent(group.title)}`}
                className="block text-xs text-primary font-medium mt-2"
              >
                Tümünü Gör →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KategorilerPage() {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? CATEGORIES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.groups.some(
          (g) =>
            g.title.toLowerCase().includes(query.toLowerCase()) ||
            g.items.some((i) => i.toLowerCase().includes(query.toLowerCase()))
        )
      )
    : CATEGORIES;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Kategoriler" showBack={false} />

      <main>
        {/* Arama */}
        <div className="sticky top-[56px] z-30 bg-background border-b border-border px-4 py-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-10 bg-muted border-muted text-sm"
              placeholder="Kategori veya ürün ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Hiyerarsik kategori listesi */}
        <div className="bg-card mt-2 mx-3 rounded-2xl border border-border overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
              Sonuc bulunamadı
            </div>
          ) : (
            filtered.map((cat) => <CategoryRow key={cat.href} cat={cat} />)
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
