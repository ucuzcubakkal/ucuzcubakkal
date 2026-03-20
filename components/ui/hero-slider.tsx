"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "Pi Network Topluluğu",
    title: "Global Alışverişin Yeni Adresi",
    description: "Dünyanın dört bir yanından milyonlarca ürün. En iyi fiyatlar, güvenli alışveriş, hızlı teslimat.",
    cta: "Alışverişe Başla",
    ctaLink: "/kategori/tumu",
    secondaryCta: "Satıcıları Keşfet",
    secondaryLink: "/saticilar",
    bg: "from-primary/20 to-secondary",
  },
  {
    id: 2,
    badge: "Yeni Kampanya",
    title: "İlk Siparişte %20 İndirim",
    description: "HOSGELDIN kupon koduyla ilk alışverişinizde %20 indirim kazanın. Fırsatı kaçırmayın!",
    cta: "Kampanyaları Gör",
    ctaLink: "/kampanyalar",
    secondaryCta: "Kupon Al",
    secondaryLink: "/giris",
    bg: "from-violet-500/20 to-secondary",
  },
  {
    id: 3,
    badge: "Satıcı Olmak İster misiniz?",
    title: "Ürünlerinizi Dünyaya Satın",
    description: "Platforma katılın, ürünlerinizi milyonlarca alıcıyla buluşturun. Başvuru ücretsiz.",
    cta: "Hemen Başvur",
    ctaLink: "/basvuru",
    secondaryCta: "Daha Fazla Bilgi",
    secondaryLink: "/hakkimizda",
    bg: "from-emerald-500/20 to-secondary",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <section
      className={`relative bg-gradient-to-br ${slide.bg} py-14 md:py-24 transition-all duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center animate-slide-up">
          <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1">
            {slide.badge}
          </Badge>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-balance text-foreground">
            {slide.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            {slide.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={slide.ctaLink}>
              <Button size="lg" className="h-12 px-8 font-medium w-full sm:w-auto">
                {slide.cta}
              </Button>
            </Link>
            <Link href={slide.secondaryLink}>
              <Button size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto">
                {slide.secondaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigasyon Okları */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border rounded-full p-2 transition-all"
        aria-label="Önceki slayt"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border rounded-full p-2 transition-all"
        aria-label="Sonraki slayt"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Nokta Göstergesi */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-primary w-6" : "bg-primary/30 w-2"
            }`}
            aria-label={`Slayt ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
