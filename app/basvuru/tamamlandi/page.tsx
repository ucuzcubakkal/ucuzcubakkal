"use client";

import Link from "next/link";
import { CheckCircle2, Store, ArrowRight, Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";

const STEPS = [
  { step: "1", title: "Başvuru Alındı", desc: "Başvurunuz sisteme kaydedildi ve inceleme kuyruğuna alındı.", done: true },
  { step: "2", title: "KYC Doğrulama", desc: "Kimlik ve adres bilgileriniz Pi Network ekibi tarafından doğrulanır.", done: false },
  { step: "3", title: "Mağaza Onayı", desc: "Satıcı ekibimiz mağaza bilgilerinizi ve portföyünüzü değerlendirir.", done: false },
  { step: "4", title: "Aktivasyon", desc: "Onay sonrası mağazanız yayına girer ve ürün eklemeye başlayabilirsiniz.", done: false },
];

export default function BasvuruTamamlandiPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Başvuru Tamamlandı" />

      <div className="container mx-auto px-4 py-10 max-w-lg space-y-6">

        {/* Basari karti */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
          <CardContent className="p-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Başvurunuz Alındı!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Satıcı başvurunuz başarıyla gönderildi. Ekibimiz en kısa sürede
              inceleyerek size dönecektir. Ortalama değerlendirme süresi <strong>1-3 iş günüdür</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Surec adimlar */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Onay Süreci</p>
          <div className="space-y-3">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${s.done ? "bg-green-500 text-white" : "bg-muted text-muted-foreground border border-border"}`}>
                  {s.done ? <CheckCircle2 className="h-4 w-4" /> : s.step}
                </div>
                <div className={`pb-3 ${i < STEPS.length - 1 ? "border-b border-border w-full" : "w-full"}`}>
                  <p className={`text-sm font-medium ${s.done ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bekleme suresi */}
        <Card className="border-border shadow-none">
          <CardContent className="p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Ne zaman haber alacaksınız?</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Başvurunuzun sonucu Pi Browser bildirimlerinize ve kayıtlı e-posta adresinize gönderilecektir.
                Spam klasörünüzü de kontrol etmeyi unutmayın.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Iletisim */}
        <Card className="border-border shadow-none">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-semibold">Sorularınız için bize ulaşın</p>
            <a href="mailto:satici@ucuzcubakkal.com"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              satici@ucuzcubakkal.com
            </a>
            <a href="https://wa.me/905432027808"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              WhatsApp: 0543 202 78 08
            </a>
          </CardContent>
        </Card>

        {/* Eylem butonlar */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="w-full">
            <Button className="w-full gap-2">
              <Store className="h-4 w-4" />
              Alışverişe Devam Et
            </Button>
          </Link>
          <Link href="/panel" className="w-full">
            <Button variant="outline" className="w-full gap-2">
              Satıcı Paneline Git
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
