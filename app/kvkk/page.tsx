"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Scale, ChevronRight, Mail, Phone } from "lucide-react";

const SECTIONS = [
  {
    id: "veri-sorumlusu",
    title: "1. Veri Sorumlusunun Kimliği",
    content: `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz aşağıda kimlik bilgileri verilen veri sorumlusu tarafından işlenmektedir:

**Ünvan:** Seyirevi Reklam ve Bilişim San. Tic. Ltd. Şti.
**Merkez:** Konak Mah. Lefkoşe Cad. Barış Sok. No: 3 Kat:1 Nilüfer / Bursa
**Telefon:** 0543 202 78 08
**KVKK Başvuru E-posta:** kvkk@ucuzcubakkal.com
**Web Sitesi:** ucuzcubakkal.com

Şirketimiz, KVKK kapsamında Kişisel Verileri Koruma Kurumu'na (KVKK) veri sorumlusu sıfatıyla kayıtlıdır.`,
  },
  {
    id: "islenen-veriler",
    title: "2. İşlenen Kişisel Veriler",
    content: `Platformumuz aracılığıyla aşağıdaki kategorilerde kişisel veriler işlenmektedir:

**Kimlik Verileri:** Ad, soyad, doğum tarihi, T.C. kimlik numarası (fatura düzenleme durumunda), Pi Network kullanıcı kimliği.

**İletişim Verileri:** E-posta adresi, telefon numarası, teslimat ve fatura adresi.

**Finansal Veriler:** Pi Network cüzdan adresi, sipariş tutarları, ödeme geçmişi. Banka/kart bilgileri tarafımızca depolanmaz.

**Müşteri İşlem Verileri:** Sipariş geçmişi, iade talepleri, değerlendirmeler, şikayet kayıtları.

**Dijital İz Verileri:** IP adresi, cihaz kimliği, tarayıcı türü, ziyaret geçmişi, çerez verileri.

**Satıcı Özel Verileri:** Vergi kimlik numarası, ticaret unvanı, banka IBAN bilgisi (ödeme aktarımları için), belge ve portföy görselleri.`,
  },
  {
    id: "isleme-amaci",
    title: "3. Kişisel Verilerin İşlenme Amacı",
    content: `Kişisel verileriniz KVKK'nın 5. ve 6. maddeleri kapsamında aşağıdaki amaçlarla işlenmektedir:

**Sözleşmenin Kurulması ve İfası (m.5/2-c):**
• Üyelik sözleşmesinin kurulması
• Sipariş süreçlerinin yürütülmesi
• Teslimat ve kargo operasyonları
• Pi Network üzerinden ödeme işlemleri

**Hukuki Yükümlülüklerin Yerine Getirilmesi (m.5/2-ç):**
• Vergi ve muhasebe kayıtlarının tutulması
• Yetkili kurum bilgi talepleri
• Tüketici mevzuatı kapsamındaki yükümlülükler

**Meşru Menfaat (m.5/2-f):**
• Platform güvenliğinin sağlanması
• Dolandırıcılık tespiti ve önlenmesi
• Hizmet kalitesinin ölçülmesi ve iyileştirilmesi

**Açık Rıza (m.5/1):**
• E-posta ve SMS pazarlama iletişimleri
• Kişiselleştirilmiş reklam gösterimi
• Üçüncü taraf analitik araçlarının kullanımı`,
  },
  {
    id: "aktarim",
    title: "4. Kişisel Verilerin Aktarımı",
    content: `Kişisel verileriniz KVKK'nın 8. ve 9. maddeleri kapsamında aşağıdaki taraflara aktarılabilmektedir:

**Yurt İçi Aktarım:**
• Kargo ve lojistik firmaları (teslimat için)
• Ödeme altyapı sağlayıcıları (finansal işlemler için)
• Hukuk büroları ve muhasebe firmaları (yasal yükümlülükler için)
• Bulut altyapı sağlayıcıları (sistem barındırma için)

**Yurt Dışı Aktarım:**
• Pi Network (kimlik doğrulama ve ödeme; ABD merkezli, yeterli koruma güvencesi kapsamında)
• Uluslararası kargo firmaları (sınır ötesi teslimatlar için)
• Analitik hizmet sağlayıcıları (açık rıza ile)

Yurt dışına aktarım yalnızca KVKK'nın 9. maddesi kapsamında gerekli güvenceler sağlandığında gerçekleştirilmektedir.`,
  },
  {
    id: "saklama",
    title: "5. Saklama Süreleri",
    content: `Kişisel veriler, işlenme amacı ortadan kalktığında ve yasal saklama süreleri dolduğunda silinmekte, yok edilmekte veya anonim hale getirilmektedir:

| Veri Kategorisi | Saklama Süresi |
| Hesap ve üyelik verileri | Hesap silinmesinden itibaren 3 yıl |
| Sipariş ve fatura kayıtları | 10 yıl (TTK gereği) |
| Müşteri hizmetleri yazışmaları | 3 yıl |
| Çerez ve log verileri | 1 yıl |
| Pazarlama onay kayıtları | Rıza geri alınana kadar + 3 yıl ispat süresi |
| Satıcı finansal kayıtları | 10 yıl (vergi mevzuatı gereği) |`,
  },
  {
    id: "haklariniz",
    title: "6. İlgili Kişi Hakları",
    content: `KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

**(a) Bilgi Edinme Hakkı:** Kişisel verilerinizin işlenip işlenmediğini ve hangi verilerinizin işlendiğini öğrenme.

**(b) Amaç Öğrenme Hakkı:** Kişisel verilerinizin hangi amaçla işlendiğini ve bu amaca uygun kullanılıp kullanılmadığını öğrenme.

**(c) Aktarım Bilgisi Hakkı:** Yurt içinde ve yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme.

**(d) Düzeltme Hakkı:** Eksik veya yanlış işlenen kişisel verilerin düzeltilmesini talep etme.

**(e) Silme/Yok Etme Hakkı:** KVKK'nın 7. maddesi kapsamındaki şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini talep etme.

**(f) İtiraz Hakkı:** Kişisel verilerinizin otomatik sistemler vasıtasıyla işlenmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme.

**(g) Tazminat Hakkı:** KVKK hükümlerinin ihlali nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme.`,
  },
  {
    id: "basvuru",
    title: "7. Başvuru Yöntemi",
    content: `KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki yollarla başvurabilirsiniz:

**E-posta Başvurusu:** kvkk@ucuzcubakkal.com adresine, konu satırına "KVKK Başvurusu" yazarak güvenli elektronik imzalı e-posta gönderebilirsiniz.

**Yazılı Başvuru:** Kimliğinizi ispatlayan belgelerle birlikte ıslak imzalı dilekçenizi kayıtlı adresimize gönderebilirsiniz.

**Başvuruda Bulunması Gereken Bilgiler:**
• Ad, soyad ve T.C. kimlik numarası (veya pasaport numarası)
• Tebligata esas yerleşim yeri veya iş yeri adresi
• Bildirime esas e-posta adresi veya telefon numarası
• Talep konusu

Başvurularınız, talebin niteliğine göre en geç **30 gün** içinde ücretsiz olarak yanıtlanmaktadır. Yanıtın ayrıca bir maliyet gerektirmesi halinde Kişisel Verileri Koruma Kurumu tarafından belirlenen tarife esas alınır.`,
  },
  {
    id: "kvkk-kurumu",
    title: "8. KVKK Kurumu'na Başvuru",
    content: `Başvurunuzun reddedilmesi, verilen yanıtı yetersiz bulmanız veya 30 gün içinde yanıt alınamaması halinde Kişisel Verileri Koruma Kurumu'na şikayette bulunma hakkınız saklıdır:

**Kişisel Verileri Koruma Kurumu**
Adres: Nasuh Akar Mah. Ziyabey Cad. No:1407 Balgat/Ankara
Web: kvkk.gov.tr
Telefon: +90 312 216 50 00`,
  },
];

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="KVKK Aydinlatma Metni" />

      {/* Hero */}
      <div className="bg-secondary border-b border-border py-10 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">KVKK Aydinlatma Metni</h1>
          <p className="text-sm text-muted-foreground">Son güncelleme: Mart 2026</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="secondary" className="text-xs">6698 Sayili KVKK</Badge>
            <Badge variant="secondary" className="text-xs">GDPR Uyumlu</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin
            işlenmesine ilişkin aydınlatma yükümlülüğümüzün yerine getirilmesi amacıyla hazırlanmıştır.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="sticky top-20 bg-card border border-border rounded-xl p-4 space-y-4">
              <div>
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
              {/* Hizli iletisim */}
              <div className="border-t border-border pt-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">KVKK Basvuru</p>
                <a href="mailto:kvkk@ucuzcubakkal.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-3 w-3" />
                  kvkk@ucuzcubakkal.com
                </a>
                <a href="tel:+902121234567" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-3 w-3" />
                  +90 212 123 45 67
                </a>
              </div>
            </div>
          </aside>

          {/* Icerik */}
          <main className="flex-1 min-w-0">
            <div className="space-y-10">
              {SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b border-border">{section.title}</h2>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    {section.content.split("\n\n").map((para, i) => {
                      if (para.includes("| ")) {
                        const rows = para.split("\n").filter(r => r.trim().startsWith("|"));
                        return (
                          <div key={i} className="overflow-x-auto">
                            <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                              <tbody>
                                {rows.map((row, ri) => {
                                  const cells = row.split("|").filter(Boolean).map(c => c.trim());
                                  return (
                                    <tr key={ri} className={ri === 0 ? "bg-muted font-semibold" : "border-t border-border"}>
                                      {cells.map((cell, ci) => (
                                        <td key={ci} className="px-3 py-2 text-foreground">{cell}</td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      return (
                        <p key={i} className="whitespace-pre-line">
                          {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                            part.startsWith("**") && part.endsWith("**")
                              ? <strong key={j} className="text-foreground font-semibold">{part.replace(/\*\*/g, "")}</strong>
                              : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/gizlilik" className="hover:text-primary transition-colors">Gizlilik Politikasi</Link>
              <Link href="/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanim Kosullari</Link>
              <Link href="/hakkimizda" className="hover:text-primary transition-colors">Hakkimizda</Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
