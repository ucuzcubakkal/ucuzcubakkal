"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Shield, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    id: "toplanan-bilgiler",
    title: "1. Toplanan Kişisel Veriler",
    content: `Ucuzcubakkal olarak hizmetlerimizi sunabilmek amacıyla aşağıdaki kişisel verileri işlemekteyiz:

**Kimlik Bilgileri:** Ad, soyad, kullanıcı adı, Pi Network kullanıcı kimliği.

**İletişim Bilgileri:** E-posta adresi, telefon numarası, teslimat adresi.

**Finansal Bilgiler:** Pi Network cüzdan adresi, işlem geçmişi. Kredi kartı veya banka bilgileri doğrudan tarafımızca tutulmamakta olup ödeme altyapı sağlayıcılarınca işlenmektedir.

**Kullanım Verileri:** Ziyaret edilen sayfalar, arama geçmişi, tıklama verileri, cihaz ve tarayıcı bilgileri, IP adresi.

**Satıcı Verileri:** Mağaza adı, ürün bilgileri, fatura bilgileri, vergi numarası (ticari satıcılar için).`,
  },
  {
    id: "islem-amaci",
    title: "2. Verilerin İşlenme Amaçları",
    content: `Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

• Üyelik hesabının oluşturulması ve yönetilmesi
• Siparişlerin alınması, işlenmesi ve teslimat süreçlerinin yürütülmesi
• Pi Network üzerinden ödeme işlemlerinin gerçekleştirilmesi
• Müşteri hizmetleri desteğinin sağlanması
• Kişiselleştirilmiş ürün önerilerinin sunulması
• Yasal yükümlülüklerin yerine getirilmesi (vergi, muhasebe, uyum)
• Platform güvenliğinin ve dolandırıcılık önlemenin sağlanması
• Kampanya ve promosyon bildirimlerinin iletilmesi (açık rıza ile)`,
  },
  {
    id: "hukuki-dayanak",
    title: "3. Hukuki Dayanak",
    content: `Verilerinizin işlenmesi aşağıdaki hukuki dayanakları kapsamında gerçekleştirilmektedir:

**Sözleşmenin ifası:** Sipariş, teslimat ve ödeme işlemleri için.

**Yasal yükümlülük:** Vergi mevzuatı, Türk Ticaret Kanunu ve ilgili düzenlemeler kapsamında.

**Meşru menfaat:** Platform güvenliği, dolandırıcılık tespiti ve hizmet kalitesinin iyileştirilmesi için.

**Açık rıza:** Pazarlama iletişimleri ve analitik çerezler için. Rızanızı her zaman geri alabilirsiniz.`,
  },
  {
    id: "veri-paylasimi",
    title: "4. Veri Paylaşımı ve Aktarımı",
    content: `Kişisel verileriniz üçüncü taraflarla yalnızca aşağıdaki durumlarda paylaşılmaktadır:

**Hizmet Sağlayıcılar:** Kargo firmaları, ödeme altyapı sağlayıcıları ve bulut depolama hizmetleri. Bu sağlayıcılar verilerinizi yalnızca hizmet amacıyla ve gizlilik sözleşmesi çerçevesinde kullanır.

**Pi Network:** Kimlik doğrulama ve ödeme işlemleri için Pi Network API'si kullanılmaktadır. Pi Network'ün gizlilik politikası ayrıca geçerlidir.

**Satıcılar:** Teslimat için ad, soyad ve adres bilgileri ilgili satıcıyla paylaşılır.

**Yasal Zorunluluklar:** Mahkeme kararı veya yetkili kurum talebi halinde yasal yükümlülüklerimiz kapsamında.

Verileriniz hiçbir koşulda üçüncü taraflara ticari amaçla satılmamakta veya kiralanmamaktadır.`,
  },
  {
    id: "veri-guvenligi",
    title: "5. Veri Güvenliği",
    content: `Verilerinizin güvenliğini sağlamak amacıyla endüstri standardı önlemler uygulanmaktadır:

• TLS/SSL şifrelemesi ile tüm veri transferleri korunmaktadır
• Hassas veriler AES-256 şifrelemesiyle depolanmaktadır
• Erişim kontrolleri ve yetkilendirme sistemleri uygulanmaktadır
• Düzenli güvenlik denetimleri ve sızma testleri gerçekleştirilmektedir
• Veri ihlali durumunda 72 saat içinde ilgili otoritelere ve etkilenen kullanıcılara bildirim yapılmaktadır`,
  },
  {
    id: "saklama-suresi",
    title: "6. Veri Saklama Süreleri",
    content: `Kişisel verileriniz aşağıdaki süreler boyunca saklanmaktadır:

• Hesap verileri: Hesap silinme tarihinden itibaren 3 yıl (yasal yükümlülükler kapsamında)
• Sipariş ve fatura kayıtları: 10 yıl (Türk Ticaret Kanunu gereği)
• İletişim kayıtları: 3 yıl
• Çerez ve analitik veriler: 13 ay
• Pazarlama tercihleri: Rıza geri alınana kadar

Saklama süresinin dolması veya amacın ortadan kalkması halinde verileriniz güvenli biçimde silinmekte ya da anonimleştirilmektedir.`,
  },
  {
    id: "haklariniz",
    title: "7. Kullanıcı Hakları",
    content: `6698 sayılı KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:

• **Bilgi edinme:** Hangi verilerinizin işlendiğini öğrenme hakkı
• **Erişim:** Kişisel verilerinizin bir kopyasını talep etme hakkı
• **Düzeltme:** Hatalı veya eksik verilerinizin güncellenmesini talep etme hakkı
• **Silme:** Belirli koşullar altında verilerinizin silinmesini talep etme hakkı
• **İşlemeyi kısıtlama:** Belirli işlemlerin durdurulmasını talep etme hakkı
• **Veri taşınabilirliği:** Verilerinizi makine okunabilir formatta alma hakkı
• **İtiraz:** Meşru menfaate dayalı işlemelere itiraz etme hakkı
• **Rızayı geri alma:** Pazarlama iletişimlerine verdiğiniz rızayı geri alma hakkı

Haklarınızı kullanmak için kvkk@ucuzcubakkal.com adresine e-posta gönderebilirsiniz.`,
  },
  {
    id: "cerezler",
    title: "8. Çerezler",
    content: `Platform'da aşağıdaki çerez türleri kullanılmaktadır:

**Zorunlu Çerezler:** Oturum yönetimi ve güvenlik için gereklidir. Devre dışı bırakılamaz.

**Performans Çerezleri:** Sayfa yükleme süreleri ve kullanıcı deneyimini iyileştirmek amacıyla anonim analitik veriler toplar.

**İşlevsellik Çerezleri:** Dil tercihleri, sepet içeriği ve kişiselleştirme ayarlarını hatırlar.

**Pazarlama Çerezleri:** Yalnızca açık rızanız halinde etkinleştirilir. İlgi alanlarınıza göre içerik gösterilmesi amacıyla kullanılır.

Çerez tercihlerinizi tarayıcı ayarlarınızdan veya platform içindeki çerez yönetim panelinden değiştirebilirsiniz.`,
  },
  {
    id: "iletisim",
    title: "9. İletişim",
    content: `Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için:

**Veri Sorumlusu:** Seyirevi Reklam ve Bilişim San. Tic. Ltd. Şti.
**E-posta:** gizlilik@ucuzcubakkal.com
**KVKK Başvuruları:** kvkk@ucuzcubakkal.com
**Adres:** Konak Mah. Lefkoşe Cad. Barış Sok. No: 3 Kat:1 Nilüfer / Bursa
**Telefon:** 0543 202 78 08

Kişisel Verileri Koruma Kurumu'na (KVKK) şikayette bulunma hakkınız saklıdır.`,
  },
];

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Gizlilik Politikası" />

      {/* Hero */}
      <div className="bg-secondary border-b border-border py-10 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Gizlilik Politikası</h1>
          <p className="text-sm text-muted-foreground">Son güncelleme: Mart 2026</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto text-pretty">
            Bu politika, Ucuzcubakkal platformunda kişisel verilerinizin nasıl toplandığını, kullanıldığını ve
            korunduğunu açıklamaktadır.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar — hızlı nav */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="sticky top-20 bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">İçindekiler</p>
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

          {/* İçerik */}
          <main className="flex-1 min-w-0">
            <div className="space-y-10">
              {SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b border-border">{section.title}</h2>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    {section.content.split("\n\n").map((para, i) => {
                      if (para.startsWith("**") && para.endsWith("**")) {
                        return <p key={i} className="font-semibold text-foreground">{para.replace(/\*\*/g, "")}</p>;
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

            {/* Alt linkler */}
            <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanim Kosullari</Link>
              <Link href="/kvkk" className="hover:text-primary transition-colors">KVKK Aydinlatma Metni</Link>
              <Link href="/hakkimizda" className="hover:text-primary transition-colors">Hakkimizda</Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
