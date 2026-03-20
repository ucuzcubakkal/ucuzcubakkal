"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Search, Package, Truck, CheckCircle2, Clock,
  MapPin, Phone, MessageCircle, ChevronRight, Copy, CheckCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MOCK_ORDERS: Record<string, {
  id: string; seller: string; date: string; total: number; estimatedDelivery: string;
  status: "hazirlaniyor" | "kargoda" | "dagitimda" | "teslim";
  items: { name: string; qty: number; price: number }[];
  tracking: string;
  timeline: { label: string; date: string; done: boolean; active: boolean }[];
}> = {
  "UCB-2026-4872": {
    id: "UCB-2026-4872", seller: "Ayşe Hanım Atölyesi",
    date: "12 Mart 2026", total: 125, estimatedDelivery: "18 Mart 2026",
    status: "kargoda", tracking: "TR9834761234",
    items: [{ name: "El Dokuma Kilim Yastık", qty: 1, price: 125 }],
    timeline: [
      { label: "Sipariş Alındı", date: "12 Mart, 10:24", done: true, active: false },
      { label: "Hazırlanıyor", date: "12 Mart, 14:00", done: true, active: false },
      { label: "Kargoya Verildi", date: "13 Mart, 09:15", done: true, active: true },
      { label: "Dağıtımda", date: "Bekleniyor", done: false, active: false },
      { label: "Teslim Edildi", date: "Bekleniyor", done: false, active: false },
    ],
  },
  "UCB-2026-3311": {
    id: "UCB-2026-3311", seller: "Çömlek Sanatı",
    date: "5 Mart 2026", total: 89, estimatedDelivery: "10 Mart 2026",
    status: "teslim", tracking: "TR8812349876",
    items: [{ name: "Seramik Vazo", qty: 1, price: 89 }],
    timeline: [
      { label: "Sipariş Alındı", date: "5 Mart, 09:00", done: true, active: false },
      { label: "Hazırlanıyor", date: "5 Mart, 13:30", done: true, active: false },
      { label: "Kargoya Verildi", date: "6 Mart, 08:45", done: true, active: false },
      { label: "Dağıtımda", date: "9 Mart, 11:20", done: true, active: false },
      { label: "Teslim Edildi", date: "10 Mart, 14:05", done: true, active: true },
    ],
  },
};

const STATUS_CONFIG = {
  hazirlaniyor: { label: "Hazırlanıyor",  color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  kargoda:      { label: "Kargoda",       color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  dagitimda:    { label: "Dağıtımda",     color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  teslim:       { label: "Teslim Edildi", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

const STATUS_ICONS = {
  hazirlaniyor: Package,
  kargoda:      Truck,
  dagitimda:    MapPin,
  teslim:       CheckCircle2,
};

export default function TakipPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<typeof MOCK_ORDERS[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const search = () => {
    const found = MOCK_ORDERS[query.trim().toUpperCase()];
    if (found) { setOrder(found); setNotFound(false); }
    else { setOrder(null); setNotFound(true); }
  };

  const copyTracking = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.tracking);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Takip numarası kopyalandı" });
  };

  const StatusIcon = order ? STATUS_ICONS[order.status] : Package;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-balance">Sipariş Takibi</h1>
          <p className="text-sm text-muted-foreground mt-1">Sipariş numaranızı girerek durumunuzu öğrenin</p>
        </div>

        {/* Arama */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex gap-2">
              <Input
                placeholder="Örn: UCB-2026-4872"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={search} className="gap-2">
                <Search className="h-4 w-4" />
                Sorgula
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sipariş numaranızı onay e-postanızda veya <Link href="/profil" className="text-primary hover:underline">profil sayfanızda</Link> bulabilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Bulunamadı */}
        {notFound && (
          <Card className="border-destructive/30">
            <CardContent className="pt-5 text-center space-y-2">
              <Package className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="font-semibold">Sipariş bulunamadı</p>
              <p className="text-sm text-muted-foreground">
                Lütfen sipariş numarasını doğru girdiğinizden emin olun.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sipariş detayı */}
        {order && (
          <div className="space-y-4">
            {/* Durum kartı */}
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl">
                      <StatusIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sipariş No</p>
                      <p className="font-bold font-mono">{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.seller}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs font-semibold border-0", STATUS_CONFIG[order.status].color)}>
                    {STATUS_CONFIG[order.status].label}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Sipariş Tarihi</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tahmini Teslimat</p>
                    <p className="font-medium">{order.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Toplam</p>
                    <p className="font-bold text-primary">{order.total}π</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Kargo Takip No</p>
                    <button onClick={copyTracking} className="flex items-center gap-1 font-mono text-xs font-medium hover:text-primary transition-colors">
                      {order.tracking}
                      {copied ? <CheckCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Zaman çizelgesi */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sipariş Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {order.timeline.map((step, i) => (
                    <div key={step.label} className="flex gap-3">
                      {/* Çizgi ve nokta */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-4 w-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all",
                          step.done && step.active ? "bg-primary border-primary ring-2 ring-primary/20" :
                          step.done ? "bg-primary border-primary" :
                          "bg-background border-border"
                        )}>
                          {step.done && !step.active && (
                            <CheckCircle2 className="h-3 w-3 text-primary-foreground m-auto" style={{ marginTop: "-1px" }} />
                          )}
                          {step.active && (
                            <span className="block h-2 w-2 rounded-full bg-primary-foreground m-auto animate-pulse" />
                          )}
                        </div>
                        {i < order.timeline.length - 1 && (
                          <div className={cn("w-0.5 flex-1 my-0.5", step.done ? "bg-primary" : "bg-border")} style={{ minHeight: "28px" }} />
                        )}
                      </div>
                      {/* İçerik */}
                      <div className="pb-5">
                        <p className={cn("text-sm font-medium", !step.done && "text-muted-foreground")}>{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ürünler */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sipariş İçeriği</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.qty}</p>
                    </div>
                    <p className="font-bold text-primary">{item.price}π</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Destek */}
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs font-semibold text-muted-foreground mb-3">YARDIM</p>
                <div className="space-y-2">
                  <Link href="/iletisim">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm">
                      <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4" />Satıcıyla İletişime Geç</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </Link>
                  <Link href="/yardim">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm">
                      <span className="flex items-center gap-2"><Phone className="h-4 w-4" />Destek Merkezi</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Demo ipucu */}
        {!order && !notFound && (
          <Card className="border-dashed">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground text-center mb-2">Demo için bu numaralardan birini deneyin:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {Object.keys(MOCK_ORDERS).map((id) => (
                  <button key={id} onClick={() => { setQuery(id); }}
                    className="text-xs font-mono bg-muted px-2 py-1 rounded hover:bg-accent transition-colors">
                    {id}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
