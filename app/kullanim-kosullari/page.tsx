"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { FileText, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    id: "taraflar",
    title: "1. Taraflar ve Sözleşmenin Kapsamı",
    content: `Bu Kullanım Koşulları, Ucuzcubakkal Teknoloji A.Ş. (bundan böyle "Ucuzcubakkal" veya "Platform") ile platformu kullanan gerçek veya tüzel kişiler (bundan böyle "Kullanıcı") arasındaki hukuki ilişkiyi düzenlemektedir.

Platformu kullanmaya başladığınız anda bu koşulları okumuş, anlamış ve kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız platformu kullanmayı derhal bırakınız.

Platform; web sitesi, mobil uygulama, Pi Network DApp ve diğer dijital kanallar aracılığıyla sunulan tüm hizmetleri kapsamaktadır.`,
  },
  {
    id: "uyelik",
    title: "2. Üyelik ve Hesap Güvenliği",
    content: `**Üyelik Koşulları:** Platforma üye olabilmek için 18 yaşını doldurmuş olmak ya da yasal temsilci onayına sahip olmak gerekmektedir.

**Pi Network Entegrasyonu:** Üyelik, Pi Network kimliğiyle gerçekleştirilmektedir. Pi hesabınızın gerçek ve aktif olması zorunludur.

**Hesap Güvenliği:** Hesabınızın güvenliğinden ve hesabınız üzerinden gerçekleştirilen tüm işlemlerden siz sorumlusunuz. Hesabınıza yetkisiz erişim şüphesi durumunda derhal destek@ucuzcubakkal.com adresine bildirmelisiniz.

**Tek Hesap:** Her kullanıcı yalnızca bir hesap açabilir. Birden fazla hesap oluşturulması durumunda tüm hesaplar askıya alınabilir.

**Doğru Bilgi:** Üyelik ve profil bilgilerinizin doğru, güncel ve eksiksiz olması zorunludur.`,
  },
  {
    id: "alici-kurallari",
    title: "3. Alıcı Kuralları",
    content: `**Sipariş Süreci:** Sipariş tamamlanması bağlayıcı bir satın alma taahhüdü oluşturur. Sipariş onayından sonra iptaller satıcının onayına tabidir.

**Ödeme:** Ödemeler Pi Network üzerinden gerçekleştirilir. Ödeme tamamlanmadan sipariş işleme alınmaz.

**Teslimat Adresi:** Doğru teslimat adresi girme sorumluluğu alıcıya aittir. Hatalı adres nedeniyle oluşan kayıplardan platform sorumlu tutulamaz.

**İade ve İptal:** Ürün tesliminden itibaren 14 gün içinde iade hakkı mevcuttur. Kişiye özel üretilen ürünlerde bu hak kullanılamaz. Detaylar için İade Politikamıza başvurunuz.

**Dürüst Değerlendirme:** Ürün değerlendirmeleri gerçek satın alma deneyimine dayalı, dürüst ve hakaret içermeyen biçimde yapılmalıdır.`,
  },
  {
    id: "satici-kurallari",
    title: "4. Satıcı Kuralları",
    content: `**Satıcı Başvurusu:** Satıcı olmak için başvuru süreci tamamlanmalı ve platform onayı alınmalıdır. Platform, başvuruyu herhangi bir gerekçe göstermeksizin reddedebilir.

**Ürün Standartları:** Listelenen ürünlerin gerçek, yasal, güvenli ve açıklamalarla uyumlu olması zorunludur. Yanıltıcı ürün açıklamaları, sahte görseller veya gerçek dışı fiyatlandırma yasaktır.

**Stok Yönetimi:** Satıcılar, listelenen ürünlerin stok durumunu güncel tutmakla yükümlüdür. Stokta bulunmayan ürünlerin satışa sunulması hesap askıya alınmasına neden olabilir.

**Kargo ve Teslimat:** Sipariş tamamlanmasından itibaren belirtilen süre içinde kargoya verilme yükümlülüğü satıcıya aittir.

**Komisyon:** Platform, gerçekleşen satışlar üzerinden belirlenen komisyon oranını otomatik olarak tahsil eder. Güncel oranlar satıcı panelinde görüntülenebilir.

**Yasaklı Ürünler:** Alkol, tütün, silah, uyuşturucu, erotik içerik, sahte veya korsan ürünler, telif hakkı ihlali içeren ürünler kesinlikle yasaktır.`,
  },
  {
    id: "yasakli-faaliyetler",
    title: "5. Yasaklı Faaliyetler",
    content: `Aşağıdaki faaliyetler kesinlikle yasaktır ve hesap kapatmaya kadar yaptırım uygulanır:

• Platform sistemlerine yetkisiz erişim girişimi
• Diğer kullanıcıların kişisel verilerine izinsiz erişim
• Sahte sipariş, sahte değerlendirme veya manipülatif davranışlar
• Spam, phishing veya kötü amaçlı yazılım dağıtımı
• Fikri mülkiyet haklarının ihlali
• Pi Network kurallarını ihlal eden davranışlar
• Platforma zarar verebilecek otomatik araçların (bot, scraper) kullanımı
• Diğer kullanıcılara yönelik taciz, tehdit veya ayrımcılık`,
  },
  {
    id: "fikri-mulkiyet",
    title: "6. Fikri Mülkiyet",
    content: `**Platform İçeriği:** Logo, tasarım, yazılım ve içerik dahil tüm platform unsurları Ucuzcubakkal'a aittir ve telif hakkı yasalarıyla korunmaktadır.

**Kullanıcı İçeriği:** Platforma yüklediğiniz görseller, açıklamalar ve değerlendirmeler için platform'a sınırlı, dünya genelinde geçerli, telif ücretsiz bir lisans vermiş olursunuz. Bu içeriklerin üçüncü taraf haklarını ihlal etmediği konusunda garanti verirsiniz.

**DMCA / Telif Şikayeti:** Telif hakkı ihlali şüpheniz varsa dmca@ucuzcubakkal.com adresine bildirim yapabilirsiniz.`,
  },
  {
    id: "sorumluluk-siniri",
    title: "7. Sorumluluk Sınırı",
    content: `**Aracılık Rolü:** Ucuzcubakkal, alıcı ve satıcılar arasında aracı platform olarak faaliyet göstermektedir. Satıcılar tarafından listelenen ürünlerin kalitesi, güvenliği veya yasallığından doğrudan sorumlu tutulamaz.

**Hizmet Kesintileri:** Planlı veya plansız bakım, teknik arızalar ya da mücbir sebep halleri nedeniyle yaşanan hizmet kesintilerinden sorumluluk kabul edilmemektedir.

**Dolaylı Zararlar:** Kar kaybı, veri kaybı, itibar zararı gibi dolaylı veya sonuç olarak ortaya çıkan zararlardan sorumluluk kabul edilmemektedir.

**Azami Sorumluluk:** Her durumda azami sorumluluğumuz, ilgili işlemde ödenen tutarla sınırlıdır.`,
  },
  {
    id: "uyusmazlik",
    title: "8. Uyuşmazlık Çözümü",
    content: `**İlk Başvuru:** Uyuşmazlıklarda öncelikle destek@ucuzcubakkal.com üzerinden platform müşteri hizmetlerine başvurulması beklenmektedir.

**Arabuluculuk:** Çözüme kavuşturulamayan uyuşmazlıklarda taraflar öncelikle arabuluculuk yoluna başvurabilir.

**Yetkili Mahkeme:** İşbu sözleşmeden doğan uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.

**Tüketici Hakları:** Tüketici sıfatındaki kullanıcılar Tüketici Hakem Heyeti ve Tüketici Mahkemelerine başvurma haklarını saklı tutar.`,
  },
  {
    id: "degisiklikler",
    title: "9. Değişiklikler",
    content: `Platform, bu koşulları önceden bildirmeksizin güncelleme hakkını saklı tutar. Önemli değişiklikler e-posta veya platform bildirimi aracılığıyla kullanıcılara duyurulur. Değişiklik sonrasında platformu kullanmaya devam etmeniz yeni koşulları kabul ettiğiniz anlamına gelir.

Son güncelleme tarihi her zaman bu sayfanın üst kısmında yer almaktadır.`,
  },
];

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Kullanim Kosullari" />

      {/* Hero */}
      <div className="bg-secondary border-b border-border py-10 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Kullanim Kosullari</h1>
          <p className="text-sm text-muted-foreground">Son güncelleme: Mart 2026</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto text-pretty">
            Ucuzcubakkal platformunu kullanmadan önce lütfen bu koşulları dikkatlice okuyunuz.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="sticky top-20 bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Icindekiler</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary py-1 transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 flex-shrink-0" />
                    <span>{s.title.replace(/^\d+\.\s/, "")}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Icerik */}
          <main className="flex-1 min-w-0">
            <div className="space-y-10">
              {SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b border-border">{section.title}</h2>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    {section.content.split("\n\n").map((para, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                          part.startsWith("**") && part.endsWith("**")
                            ? <strong key={j} className="text-foreground font-semibold">{part.replace(/\*\*/g, "")}</strong>
                            : part
                        )}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/gizlilik" className="hover:text-primary transition-colors">Gizlilik Politikasi</Link>
              <Link href="/kvkk" className="hover:text-primary transition-colors">KVKK Aydinlatma Metni</Link>
              <Link href="/hakkimizda" className="hover:text-primary transition-colors">Hakkimizda</Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
