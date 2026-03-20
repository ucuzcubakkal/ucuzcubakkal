"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UcbLogo } from "@/components/ucb-logo";

const FOOTER_COLS = [
  {
    title: "Alışveriş",
    links: [
      { label: "Tüm Kategoriler",  href: "/kategoriler" },
      { label: "Flash İndirimler", href: "/kampanyalar" },
      { label: "Yeni Ürünler",     href: "/kategori/tumu?sort=newest" },
      { label: "Çok Satanlar",     href: "/kategori/tumu?sort=popular" },
    ],
  },
  {
    title: "Satıcılar",
    links: [
      { label: "Satıcı Ol",     href: "/basvuru" },
      { label: "Satıcı Paneli", href: "/panel" },
      { label: "Satıcılar",     href: "/saticilar" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda",          href: "/hakkimizda" },
      { label: "İletişim",             href: "/iletisim" },
      { label: "Yardım Merkezi",       href: "/yardim" },
      { label: "Gizlilik Politikası",  href: "/gizlilik" },
      { label: "Kullanım Koşulları",   href: "/kullanim-kosullari" },
      { label: "KVKK",                 href: "/kvkk" },
      { label: "Anlasmazlik Cozumu",  href: "/anlasmazlik" },
    ],
  },
  {
    title: "Hesabım",
    links: [
      { label: "Profilim",      href: "/profil" },
      { label: "Siparişlerim",  href: "/profil?tab=orders" },
      { label: "Favorilerim",   href: "/favoriler" },
      { label: "Sepetim",       href: "/sepet" },
      { label: "Puanlarım",     href: "/puanlar" },
      { label: "Sipariş Takip", href: "/takip" },
      { label: "Hediye Kartı",  href: "/hediye-karti" },
    ],
  },
];

// Sadece bu sayfalarda footer gösterilmez (tam ekran akışlar)
const HIDDEN_PATHS = ["/giris", "/odeme", "/admin"];

export function SiteFooter() {
  const pathname = usePathname();
  const hide = HIDDEN_PATHS.some((p) => pathname.startsWith(p));
  if (hide) return null;

  return (
    <footer className="bg-card border-t border-border mt-6">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">

        {/* Logo + açıklama + sütunlar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
          {/* Marka */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <div className="mb-2">
              <UcbLogo size="sm" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Pi Network ekosisteminde faaliyet gösteren global e-ticaret platformu. Dünyanın dört bir yanındaki alıcılar ve satıcıları güvenli, hızlı ve şeffaf bir alışveriş deneyiminde buluşturuyoruz.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Pi Network Ekosistemi
            </div>
          </div>

          {/* Link sütunları */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="font-bold text-sm mb-3 text-foreground">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt çizgi */}
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © 2026 Ucuzcubakkal. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Gizlilik
            </Link>
            <Link href="/kullanim-kosullari" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Koşullar
            </Link>
            <Link href="/kvkk" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
