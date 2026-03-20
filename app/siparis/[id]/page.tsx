"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2, Package, Truck, MapPin, Home,
  MessageCircle, Star, XCircle, Copy, CheckCheck,
  Calendar, Clock, CreditCard, Download, FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StepStatus = "done" | "active" | "upcoming";

const getSteps = (currentStep: number) => [
  {
    icon: CheckCircle2,
    label: "Sipariş Alındı",
    desc: "Siparişiniz başarıyla oluşturuldu",
    time: "Az önce",
    status: currentStep >= 0 ? (currentStep > 0 ? "done" : "active") : "upcoming",
  },
  {
    icon: Package,
    label: "Hazırlanıyor",
    desc: "Satıcınız siparişinizi hazırlıyor",
    time: "1-2 iş günü",
    status: currentStep >= 1 ? (currentStep > 1 ? "done" : "active") : "upcoming",
  },
  {
    icon: Truck,
    label: "Kargoya Verildi",
    desc: "Paketiniz kargo şirketine teslim edildi",
    time: "3-5 iş günü",
    status: currentStep >= 2 ? (currentStep > 2 ? "done" : "active") : "upcoming",
  },
  {
    icon: MapPin,
    label: "Dağıtımda",
    desc: "Paketiniz bulunduğunuz bölgeye ulaştı",
    time: "1-2 gün",
    status: currentStep >= 3 ? (currentStep > 3 ? "done" : "active") : "upcoming",
  },
  {
    icon: Home,
    label: "Teslim Edildi",
    desc: "Siparişiniz teslim edildi",
    time: "",
    status: currentStep >= 4 ? "done" : "upcoming",
  },
] as { icon: typeof CheckCircle2; label: string; desc: string; time: string; status: StepStatus }[];

const ORDER_ITEMS = [
  { id: "1", name: "El Dokuma Kilim Yastık", artisan: "Ayşe Hanım", price: 125, qty: 2, image: "/placeholder.svg?height=80&width=80" },
  { id: "2", name: "Seramik Vazo - Turkuaz", artisan: "Mehmet Usta", price: 89, qty: 1, image: "/placeholder.svg?height=80&width=80" },
];

function getDeliveryDate(daysFromNow: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
}

export default function SiparisOnayPage() {
  const { id } = useParams();
  const siparisNo = `UB-${String(id).padStart(6, "0")}`;
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  // Simüle edilmiş sipariş adımı (gerçekte API'den gelir)
  const currentStep = 1; // 0=alındı, 1=hazırlanıyor, 2=kargoda, 3=dağıtımda, 4=teslim
  const steps = getSteps(currentStep);

  const copyOrderNo = () => {
    navigator.clipboard.writeText(siparisNo).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = () => {
    const lines = [
      "UCUZCU BAKKAL - RESMİ FATURA",
      "=".repeat(40),
      `Sipariş No  : ${siparisNo}`,
      `Tarih       : ${new Date().toLocaleDateString("tr-TR")}`,
      "-".repeat(40),
      ...ORDER_ITEMS.map((i) => `${i.name} (${i.artisan}) x${i.qty}   ${i.price * i.qty}π`),
      "-".repeat(40),
      `Kargo       : Ücretsiz`,
      `TOPLAM      : ${total}π`,
      "=".repeat(40),
      "Ödeme Yöntemi: Pi Network",
        "ucuzcubakkal.com - Pi Topluluğu Global E-Ticaret Platformu",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fatura-${siparisNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Fatura indirildi", description: `${siparisNo} nolu fatura kaydedildi.`, duration: 2500 });
  };

  const handleCancel = () => {
    setCancelled(true);
    toast({ title: "Sipariş İptal Edildi", description: "İptal talebiniz alındı, ödeme iade süreciniz başlatıldı.", duration: 4000 });
  };

  const handleReviewSubmit = () => {
    setShowReview(false);
    toast({ title: "Yorumunuz Alındı", description: "Teşekkürler! Yorumunuz yayınlanacak.", duration: 3000 });
  };

  const total = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Başarı Banner */}
      <div className={`${cancelled ? "bg-destructive" : "bg-primary"} text-primary-foreground py-10 text-center px-4 transition-colors`}>
        <div className="flex justify-center mb-3">
          <div className="bg-primary-foreground/20 rounded-full p-4">
            {cancelled
              ? <XCircle className="h-10 w-10 text-primary-foreground" />
              : <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
            }
          </div>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">
          {cancelled ? "Sipariş İptal Edildi" : "Siparişiniz Alındı!"}
        </h1>
        <p className="opacity-90 text-sm max-w-sm mx-auto mb-4">
          {cancelled
            ? "Ödemeniz 3-5 iş günü içinde iade edilecektir."
                  : "Satıcınız siparişinizi hazırlamaya başlayacak."}
        </p>
        <button
          onClick={copyOrderNo}
          className="inline-flex items-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-full px-4 py-1.5 font-mono text-sm font-semibold"
        >
          {siparisNo}
          {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-4">

        {/* Kargo Takip Stepper */}
        {!cancelled && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Sipariş Durumu</CardTitle>
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0 text-xs">
                  {steps[currentStep].label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                Tahmini teslimat: <strong className="text-foreground">{getDeliveryDate(10)}</strong>
              </p>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
              {/* Steps */}
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                <div className="space-y-5">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isDone = step.status === "done";
                    const isActive = step.status === "active";
                    return (
                      <div key={step.label} className="flex items-start gap-4 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 transition-all ${
                          isDone ? "bg-primary border-primary text-primary-foreground"
                            : isActive ? "bg-background border-primary text-primary animate-pulse"
                            : "bg-card border-border text-muted-foreground"
                        }`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className={`font-medium text-sm ${!isDone && !isActive ? "text-muted-foreground" : "text-foreground"}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                          {step.time && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3" /> {step.time}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sipariş Ürünleri */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sipariş İçeriği</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ORDER_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.artisan} · {item.qty} adet</p>
                </div>
                <p className="font-semibold text-sm text-primary flex-shrink-0">{item.price * item.qty}π</p>
              </div>
            ))}
            <div className="pt-3 border-t border-border flex justify-between text-sm">
              <span className="text-muted-foreground">Toplam</span>
              <span className="font-bold text-primary">{total}π</span>
            </div>
          </CardContent>
        </Card>

        {/* Özet Bilgiler */}
        <Card>
          <CardContent className="p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Ödeme</span>
              <span className="font-medium">Pi Network</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Sipariş Tarihi</span>
              <span className="font-medium">{new Date().toLocaleDateString("tr-TR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Kargo</span>
              <span className="font-medium">Ücretsiz</span>
            </div>
          </CardContent>
        </Card>

        {/* Yorum Formu */}
        {currentStep === 4 && !showReview && (
          <Button variant="outline" className="w-full gap-2" onClick={() => setShowReview(true)}>
            <Star className="h-4 w-4" /> Bu Siparişi Değerlendir
          </Button>
        )}
        {showReview && (
          <Card>
            <CardContent className="p-5">
              <p className="font-semibold mb-3">Siparişinizi Değerlendirin</p>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star className={`h-7 w-7 transition-colors ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Button className="w-full" size="sm" onClick={handleReviewSubmit} disabled={rating === 0}>
                Yorumu Gönder
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Aksiyonlar */}
        <div className="flex flex-col gap-3 pb-6">
          <Link href="/mesajlar">
            <Button className="w-full gap-2" size="lg">
              <MessageCircle className="h-4 w-4" />
                    Satıcıyla İletişime Geç
            </Button>
          </Link>
          <Button variant="outline" className="w-full gap-2" size="lg" onClick={handleDownloadInvoice}>
            <FileText className="h-4 w-4" />
            Faturayı İndir
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full gap-2" size="lg">
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          {currentStep <= 1 && !cancelled && (
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
              onClick={handleCancel}
            >
              <XCircle className="h-4 w-4" />
              Siparişi İptal Et
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
