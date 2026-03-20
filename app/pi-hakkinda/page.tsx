"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield, Wallet, Globe, Users, Zap, Lock,
  ArrowRight, ExternalLink, CheckCircle2, Smartphone,
} from "lucide-react";

const PI_FEATURES = [
  {
    icon: Shield,
    title: "Güvenli Kimlik Doğrulama",
    desc: "Pi Network'ün KYC sistemi sayesinde tüm kullanıcılar gerçek kimliğiyle doğrulanır. Sahte hesap, bot veya spam riski sıfıra yakındır.",
  },
  {
    icon: Wallet,
    title: "Pi ile Ödeme",
    desc: "Tüm alışverişlerinizi Pi kripto para birimi ile yapabilirsiniz. Banka kartı veya kredi kartı gerekmez — Pi cüzdanınız yeterli.",
  },
  {
    icon: Zap,
    title: "Düşük İşlem Ücreti",
    desc: "Pi Network'ün Stellar tabanlı altyapısı sayesinde işlem ücretleri son derece düşüktür. Mikro ödemeler bile ekonomik biçimde gerçekleşir.",
  },
  {
    icon: Globe,
    title: "Global Erişim",
    desc: "Pi Browser dünya genelinde 50 milyondan fazla kullanıcı tarafından kullanılmaktadır. Ucuzcubakkal bu kitleye doğrudan ulaşır.",
  },
  {
    icon: Users,
    title: "Büyüyen Ekosistem",
    desc: "Pi Network Mainnet açıldıkça daha fazla uygulama ve kullanıcı sisteme dahil olmaktadır. Erken katılım en büyük avantajı sağlar.",
  },
  {
    icon: Lock,
    title: "Merkeziyetsiz Güven",
    desc: "Pi Network blockchain teknolojisi üzerine kurulu olup hiçbir merkezi otorite işlemleri engelleyemez veya manipüle edemez.",
  },
];

const HOW_TO_USE = [
  { step: "1", title: "Pi Browser'ı İndirin", desc: "iOS App Store veya Google Play'den Pi Browser uygulamasını indirin." },
  { step: "2", title: "Pi Hesabı Oluşturun", desc: "Pi Network hesabı açın ve KYC doğrulamanızı tamamlayın." },
  { step: "3", title: "Ucuzcubakkal'a Girin", desc: "Pi Browser'da ucuzcubakkal.com adresini açın ve Pi hesabınızla giriş yapın." },
  { step: "4", title: "Alışverişe Başlayın", desc: "Beğendiğiniz ürünü sepete ekleyin ve Pi ile ödeme yapın." },
];

export default function PiHakkindaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Pi Network Nedir?" />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.75 14.25h-1.5v-5.5h1.5v5.5zm0-7h-1.5v-1.5h1.5v1.5z"/>
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold">Pi Network Nedir?</h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xl mx-auto">
            Pi Network, sıradan insanların akıllı telefonlarından madencilik yapabildiği,
            KYC doğrulamalı ve Mainnet'e geçiş aşamasındaki bir kripto para ağıdır.
            Ucuzcubakkal, Pi ekosisteminin ilk büyük e-ticaret platformudur.
          </p>
          <Badge className="bg-white/20 text-primary-foreground border-0 text-xs px-3 py-1">
            Pi Network Onaylı DApp
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">

        {/* Pi Ozellikleri */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Neden Pi ile Alışveriş?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PI_FEATURES.map((f) => (
              <Card key={f.title} className="border-border shadow-none">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nasil kullanilir */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Nasıl Kullanılır?</h2>
          <div className="space-y-3">
            {HOW_TO_USE.map((item, i) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className={`flex-1 pb-3 ${i < HOW_TO_USE.length - 1 ? "border-b border-border" : ""}`}>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pi Mainnet bilgisi */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="text-sm font-bold">Ucuzcubakkal — Pi Mainnet DApp</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ucuzcubakkal, Pi Core Team (PCT) tarafından inceleme sürecindedir ve
              Mainnet onayı alındığında gerçek Pi ile ödeme kabul eden ilk global
              e-ticaret platformlarından biri olacaktır. Şu anda Sandbox modunda
              test işlemleri gerçekleştirilebilmektedir.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="text-xs">Sandbox Aktif</Badge>
              <Badge variant="outline" className="text-xs">KYC Entegre</Badge>
              <Badge variant="outline" className="text-xs">Pi SDK v2</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pi Browser indirme CTA */}
        <Card className="border-border shadow-none">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <p className="text-sm font-bold">Pi Browser ile Açın</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Ucuzcubakkal'ın tüm özelliklerini kullanmak için Pi Browser üzerinden erişmeniz önerilir.
            </p>
            <a
              href="https://minepi.com/pi-browser"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-primary font-medium hover:underline"
            >
              Pi Browser'ı İndir
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>

        {/* Eylem butonlari */}
        <div className="flex flex-col gap-3 pb-4">
          <Link href="/" className="w-full">
            <Button className="w-full gap-2">
              Alışverişe Başla
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/basvuru" className="w-full">
            <Button variant="outline" className="w-full gap-2">
              Satıcı Ol
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
