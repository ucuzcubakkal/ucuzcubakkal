"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, Tag, Percent, ShoppingBag, Copy, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";

type Campaign = {
  id: number;
  title: string;
  description: string;
  discount: string;
  code?: string;
  type: "flash" | "seasonal" | "coupon" | "free-shipping";
  endsAt: string;
  color: string;
  products?: { id: string; name: string; price: number; originalPrice: number; image: string }[];
};

const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: "Hoş Geldin İndirimi",
    description: "İlk alışverişinizde %20 indirim. Hemen kayıt olun!",
    discount: "%20",
    code: "HOSGELDIN",
    type: "coupon",
    endsAt: "2026-12-31",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Bahar Festivali",
    description: "Seçili ürünlerde bahar indirimleri başladı!",
    discount: "%30'a Kadar",
    type: "seasonal",
    endsAt: "2026-04-30",
    color: "bg-secondary",
    products: [
      { id: "1", name: "El Dokuma Kilim Yastık", price: 87, originalPrice: 125, image: "/placeholder.svg?height=300&width=300" },
      { id: "2", name: "Seramik Vazo - Turkuaz", price: 62, originalPrice: 89, image: "/placeholder.svg?height=300&width=300" },
      { id: "3", name: "Ahşap Tepsi", price: 109, originalPrice: 156, image: "/placeholder.svg?height=300&width=300" },
    ],
  },
  {
    id: 3,
    title: "Ücretsiz Kargo",
    description: "200π üzeri tüm siparişlerde ücretsiz kargo!",
    discount: "Ücretsiz Kargo",
    code: "UCRETSIZ",
    type: "free-shipping",
    endsAt: "2026-06-30",
    color: "bg-accent",
  },
  {
    id: 4,
    title: "Pi Günü Flash Sale",
    description: "14 Mart Pi Günü'ne özel 24 saat flash indirim!",
    discount: "%14",
    code: "PI314",
    type: "flash",
    endsAt: "2026-03-14",
    color: "bg-primary",
    products: [
      { id: "4", name: "Özel Tasarım Kolye", price: 180, originalPrice: 210, image: "/placeholder.svg?height=300&width=300" },
      { id: "7", name: "Ahşap Oymalı Çerçeve", price: 189, originalPrice: 220, image: "/placeholder.svg?height=300&width=300" },
    ],
  },
];

function pad(n: number) { return String(n).padStart(2, "0"); }

function CountdownTimer({ endsAt, isFlash }: { endsAt: string; isFlash?: boolean }) {
  const [diff, setDiff] = useState(() => Math.max(new Date(endsAt).getTime() - Date.now(), 0));

  useEffect(() => {
    const id = setInterval(() => {
      setDiff(Math.max(new Date(endsAt).getTime() - Date.now(), 0));
    }, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  const expired = diff === 0;

  if (expired) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
        <Clock className="h-3.5 w-3.5" />
        <span>Bu kampanya sona erdi</span>
      </div>
    );
  }

  // Flash sale: dakika ve saniye göster
  if (isFlash || days === 0) {
    return (
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
        <div className="flex items-center gap-1">
          {days > 0 && (
            <>
              <span className="bg-destructive/10 text-destructive font-mono font-bold text-sm px-2 py-0.5 rounded">
                {pad(days)}
              </span>
              <span className="text-muted-foreground text-xs">g</span>
            </>
          )}
          <span className="bg-destructive/10 text-destructive font-mono font-bold text-sm px-2 py-0.5 rounded">
            {pad(hours)}
          </span>
          <span className="text-muted-foreground text-xs font-bold">:</span>
          <span className="bg-destructive/10 text-destructive font-mono font-bold text-sm px-2 py-0.5 rounded">
            {pad(mins)}
          </span>
          <span className="text-muted-foreground text-xs font-bold">:</span>
          <span className="bg-destructive/10 text-destructive font-mono font-bold text-sm px-2 py-0.5 rounded animate-pulse">
            {pad(secs)}
          </span>
          <span className="text-xs text-destructive font-medium ml-1">kaldı</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock className="h-3.5 w-3.5" />
      <span>{days} gün {pad(hours)} saat {pad(mins)} dk kaldı</span>
    </div>
  );
}

const TYPE_LABELS: Record<Campaign["type"], string> = {
  flash: "Flash Sale",
  seasonal: "Sezonluk",
  coupon: "Kupon",
  "free-shipping": "Kargo",
};

const TYPE_ICONS: Record<Campaign["type"], typeof Tag> = {
  flash: Percent,
  seasonal: ShoppingBag,
  coupon: Tag,
  "free-shipping": ShoppingBag,
};

export default function KampanyalarPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { addItem } = useCart();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    toast({ title: "Kod Kopyalandı!", description: `"${code}" sepette kullanmaya hazır.`, duration: 2000 });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Kampanyalar" />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-10 text-center px-4">
        <Percent className="h-10 w-10 mx-auto mb-3 opacity-80" />
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Özel Kampanyalar</h1>
        <p className="opacity-90 text-sm md:text-base max-w-md mx-auto">
          Pi Network topluluğuna özel indirimler ve fırsatlar
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {CAMPAIGNS.map((campaign) => {
          const Icon = TYPE_ICONS[campaign.type];
          return (
            <Card key={campaign.id} className="overflow-hidden border-border">
              {/* Üst banner */}
              <div className={`${campaign.color} text-foreground px-5 py-4 flex items-start justify-between gap-3`}>
                <div className="flex items-center gap-3">
                  <div className="bg-background/20 p-2 rounded-full">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="font-bold text-lg">{campaign.title}</h2>
                      <Badge variant="secondary" className="text-xs">{TYPE_LABELS[campaign.type]}</Badge>
                    </div>
                    <p className="text-sm opacity-80">{campaign.description}</p>
                  </div>
                </div>
                <span className="text-2xl font-serif font-bold flex-shrink-0">{campaign.discount}</span>
              </div>

              <CardContent className="p-5 space-y-4">
                <CountdownTimer endsAt={campaign.endsAt} isFlash={campaign.type === "flash"} />

                {/* Kupon kodu */}
                {campaign.code && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 border-2 border-dashed border-border rounded-lg px-3 py-2 bg-secondary/30">
                      <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-mono font-bold text-primary tracking-widest text-sm flex-1">
                        {campaign.code}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 flex-shrink-0"
                      onClick={() => copyCode(campaign.code!)}
                    >
                      {copiedCode === campaign.code ? (
                        <><CheckCheck className="h-3.5 w-3.5 text-green-500" /> Kopyalandı</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Kopyala</>
                      )}
                    </Button>
                  </div>
                )}

                {/* Kampanya ürünleri */}
                {campaign.products && campaign.products.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Kampanya Ürünleri
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {campaign.products.map((product) => (
                        <Link key={product.id} href={`/urun/${product.id}`}>
                          <div className="group text-center">
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <Badge className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] px-1 py-0">
                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                              </Badge>
                            </div>
                            <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="text-xs font-bold text-primary">{product.price}π</span>
                              <span className="text-[10px] text-muted-foreground line-through">{product.originalPrice}π</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!campaign.products && (
                  <Link href="/kategori/tumu">
                    <Button variant="outline" size="sm" className="w-full">
                      Tüm Ürünleri Gör
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
