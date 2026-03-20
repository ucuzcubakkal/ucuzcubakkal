"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search, ChevronRight, ChevronDown,
  ShoppingBag, Package, CreditCard, Truck,
  RefreshCw, Shield, MessageCircle, Store,
  Phone,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  {
    icon: ShoppingBag,
    label: "Sipariş Verme",
    color: "bg-blue-100 dark:bg-blue-950/40 text-blue-600",
    questions: [
      { q: "Nasıl sipariş verebilirim?", a: "Ürün sayfasında 'Sepete Ekle' butonuna tıklayın, ardından sepetinizden ödeme adımına geçin. Pi Network cüzdanınızla güvenle ödeme yapabilirsiniz." },
      { q: "Siparişimi nasıl iptal edebilirim?", a: "Profil > Siparişlerim bölümünden 'Hazırlanıyor' durumundaki siparişlerinizi iptal edebilirsiniz. Kargoya verilmiş siparişler için bize ulaşın." },
      { q: "Aynı satıcıdan birden fazla ürün alabilir miyim?", a: "Evet, sepetinize istediğiniz kadar ürün ekleyebilir ve tek seferde ödeme yapabilirsiniz." },
    ],
  },
  {
    icon: CreditCard,
    label: "Ödeme & Pi",
    color: "bg-amber-100 dark:bg-amber-950/40 text-amber-600",
    questions: [
      { q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", a: "Birincil ödeme yöntemimiz Pi Network kripto parasıdır. Ayrıca kredi/banka kartı ile de ödeme yapabilirsiniz." },
      { q: "Pi ödemem neden beklemede?", a: "Pi Network onay süreci birkaç dakika alabilir. İşleminiz blockchain'de onaylandıktan sonra siparişiniz aktif hale gelir." },
      { q: "Para iadesi Pi olarak mı yapılır?", a: "Evet, Pi ile yapılan ödemelerin iadesi Pi olarak yapılır. İade süreci 3-5 iş günü içinde tamamlanır." },
    ],
  },
  {
    icon: Truck,
    label: "Kargo & Teslimat",
    color: "bg-green-100 dark:bg-green-950/40 text-green-600",
    questions: [
      { q: "Kargo takibini nasıl yapabilirim?", a: "Profil > Siparişlerim bölümünde sipariş detayına tıklayın. Kargo takip numarası aktif olduktan sonra doğrudan PTT takip sayfasına yönlendirilirsiniz." },
      { q: "Uluslararası kargo var mı?", a: "Evet, satıcılarımız uluslararası kargo seçeneği sunabilmektedir. Satıcı profil sayfasında kargo bölgeleri belirtilmektedir." },
      { q: "Kargo ücreti ne kadar?", a: "150π ve üzeri siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişler için kargo ücreti satıcı tarafından belirlenir." },
    ],
  },
  {
    icon: RefreshCw,
    label: "İade & Değişim",
    color: "bg-rose-100 dark:bg-rose-950/40 text-rose-600",
    questions: [
      { q: "İade süresi ne kadar?", a: "Teslim tarihinden itibaren 14 gün içinde iade talebinde bulunabilirsiniz. El yapımı ürünler için satıcı politikaları farklılık gösterebilir." },
      { q: "Hasarlı ürün aldım, ne yapmalıyım?", a: "Fotoğraflarla birlikte bize iletişim formu üzerinden ulaşın. 24 saat içinde çözüm üretiriz." },
      { q: "İade ürününü nasıl göndereceğim?", a: "İade talebiniz onaylandıktan sonra size kargo etiketi gönderilir. Ürünü orijinal ambalajında gönderin." },
    ],
  },
  {
    icon: Store,
    label: "Satıcı İşlemleri",
    color: "bg-violet-100 dark:bg-violet-950/40 text-violet-600",
    questions: [
      { q: "Satıcı olmak için ne gerekiyor?", a: "Pi Network hesabı, KYC doğrulaması ve mağaza bilgilerinizle başvurabilirsiniz. Başvuru 3-5 iş günü içinde değerlendirilir." },
      { q: "XML Feed ile ürün yükleyebilir miyim?", a: "Evet, Satıcı Paneli > XML Feed bölümünden standart XML formatında toplu ürün yüklemesi yapabilirsiniz." },
      { q: "Satıcı komisyonu ne kadar?", a: "El yapımı ve özgün ürünler için %8, dijital ürünler için %5 komisyon uygulanmaktadır." },
    ],
  },
  {
    icon: Shield,
    label: "Güvenlik & Hesap",
    color: "bg-teal-100 dark:bg-teal-950/40 text-teal-600",
    questions: [
      { q: "Hesabım nasıl korunuyor?", a: "Pi Network kimlik doğrulama sistemi kullanılmaktadır. Şüpheli aktivite tespit edildiğinde hesabınız otomatik olarak korunur." },
      { q: "Kişisel verilerim güvende mi?", a: "KVKK kapsamında tüm kişisel verileriniz korunmaktadır. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz." },
      { q: "Hesabımı nasıl silebilirim?", a: "Profil > Ayarlar > Hesabımı Sil bölümünden kalıcı hesap silme işlemi yapabilirsiniz. Bu işlem geri alınamaz." },
    ],
  },
];

export default function YardimPage() {
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filtered = search.trim()
    ? CATEGORIES.map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(search.toLowerCase()) ||
            q.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.questions.length > 0)
    : CATEGORIES;

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Yardım Merkezi" />

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">

        {/* Başlık */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Yardım Merkezi</h1>
          <p className="text-sm text-muted-foreground">Size nasıl yardımcı olabiliriz?</p>
        </div>

        {/* Arama */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-11"
            placeholder="Soru veya konu ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Hızlı linkler */}
        {!search && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => setOpenCategory(openCategory === cat.label ? null : cat.label)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-accent transition-colors"
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* SSS Akordeon */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-sm">"{search}" için sonuç bulunamadı.</p>
              <Link href="/iletisim">
                <Button variant="outline" size="sm" className="mt-3 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Bize Sorun
                </Button>
              </Link>
            </div>
          )}
          {filtered.map((cat) => {
            const Icon = cat.icon;
            const isCatOpen = search.trim() ? true : openCategory === cat.label;
            return (
              <Card key={cat.label} className="overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenCategory(isCatOpen ? null : cat.label)}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm flex-1">{cat.label}</span>
                  <Badge variant="secondary" className="text-xs mr-1">{cat.questions.length}</Badge>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isCatOpen ? "rotate-180" : ""}`} />
                </button>

                {isCatOpen && (
                  <div className="border-t border-border">
                    {cat.questions.map((item) => {
                      const key = `${cat.label}-${item.q}`;
                      const isOpen = openQuestion === key;
                      return (
                        <div key={item.q} className="border-b border-border last:border-0">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
                            onClick={() => setOpenQuestion(isOpen ? null : key)}
                          >
                            <span className="text-sm font-medium flex-1 text-balance">{item.q}</span>
                            <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Hala yardım lazım */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-5 text-center space-y-3">
            <p className="font-semibold text-sm">Aradığınızı bulamadınız mı?</p>
            <p className="text-xs text-muted-foreground">Destek ekibimiz size yardımcı olmaktan memnuniyet duyar.</p>
            <div className="flex gap-2 justify-center">
              <Link href="/iletisim">
                <Button size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Bize Yazın
                </Button>
              </Link>
              <a href="tel:+905432027808">
                <Button size="sm" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Bizi Arayın
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
