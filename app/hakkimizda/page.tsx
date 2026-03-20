"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Sparkles, Users, Heart, Zap } from "lucide-react";

const STATS = [
  { label: "Satici", value: "50.000+" },
  { label: "Urun", value: "2.000.000+" },
  { label: "Mutlu Musteri", value: "1.500.000+" },
  { label: "Ulke", value: "45" },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Genis Urun Yelpazesi",
    desc: "Elektronikten modaya, ev dekorasyonundan gidaya milyonlarca urune tek platformdan ulasim.",
  },
  {
    icon: Globe,
    title: "Global Erisim",
    desc: "45 ulkede hizmet veren altyapimizla her yerden alisveris yapabilir, her yere urun gonderebilirsiniz.",
  },
  {
    icon: Heart,
    title: "Guvenli Alisveris",
    desc: "Alici koruma politikamiz ve Pi Network odeme altyapisiyla guvenli aliverisin garantisini veriyoruz.",
  },
  {
    icon: Shield,
    title: "Veri Guvenligi",
    desc: "Kisisel verileriniz KVKK ve GDPR standartlarinda, sifrelenmis altyapi uzerinde korunmaktadir.",
  },
  {
    icon: Users,
    title: "Satici Destek",
    desc: "Basvuru aninden itibaren saticilarimiza ozel egitim, panel ve canlı destek sunuyoruz.",
  },
  {
    icon: Zap,
    title: "Pi Network Odeme",
    desc: "Pi Network toplulugu icin optimize edilmis odeme altyapisi ile hizli ve dusuk maliyetli islemler.",
  },
];

const TEAM = [
  { name: "Zeynep Arslan", role: "Kurucu & CEO", avatar: "/placeholder.svg?height=100&width=100" },
  { name: "Ahmet Yildiz", role: "CTO", avatar: "/placeholder.svg?height=100&width=100" },
  { name: "Fatma Demir", role: "Topluluk Yoneticisi", avatar: "/placeholder.svg?height=100&width=100" },
  { name: "Mehmet Kaya", role: "Urun Direktoru", avatar: "/placeholder.svg?height=100&width=100" },
];

const MILESTONES = [
  { year: "2023", event: "Ucuzcubakkal Pi Network DApp olarak hayata gecti." },
  { year: "2024", event: "50.000 uye ve 500.000 urun esigine ulasildi." },
  { year: "2025", event: "Global e-ticaret platformuna donusum; 45 ulkeye genisletildi." },
  { year: "2026", event: "2 milyon urun, 1,5 milyon aktif kullanici milestoneu gecildi." },
];

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Hakkimizda" />

      {/* Hero */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1">Global E-Ticaret Platformu</Badge>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-5 text-balance text-foreground">
            Alisverisini Kolaylastiriyoruz
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
            Ucuzcubakkal, dunyanin dort bir yanindan milyonlarca urunu birlestiren, Pi Network altyapisiyla
            guvenli odeme sunan global bir e-ticaret platformudur. Amacimiz; alicilar, saticiler ve Pi
            toplulugunu tek cercevede bulusturmaktir.
          </p>
        </div>
      </section>

      {/* Istatistikler */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-serif font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Degerlerimiz */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-10">Degerlerimiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tarihce */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-10">Tarihcemiz</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex gap-5 items-start relative pl-14">
                  <div className="absolute left-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{m.year}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ekip */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-10">Ekibimiz</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-primary/20"
                />
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-secondary">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="font-serif text-2xl font-bold mb-4">Toplulugumuza Katilin</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Satici olmak istiyor musunuz? Magazanizi acin, urunlerinizi dunyaya satisini yapın.
            Ya da alici olarak milyonlarca urun arasından secim yapin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/basvuru">
              <Button size="lg" className="w-full sm:w-auto">Satici Olarak Basvur</Button>
            </Link>
            <Link href="/kategori/tumu">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Alisverise Basla</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Yasal linkler */}
      <section className="py-6 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/gizlilik" className="hover:text-primary transition-colors">Gizlilik Politikasi</Link>
            <Link href="/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanim Kosullari</Link>
            <Link href="/kvkk" className="hover:text-primary transition-colors">KVKK</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
