"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Package, CheckCircle2, ArrowLeft, RotateCcw,
  AlertCircle, Clock, Truck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RETURNABLE_ORDERS = [
  {
    id: "ORD-001",
    date: "28 Şubat 2026",
    items: [
      { id: "i1", name: "El Dokuma Kilim Yastık", artisan: "Ayşe Hanım", price: 125, qty: 2, image: "/placeholder.svg?height=80&width=80" },
    ],
    total: 265,
  },
  {
    id: "ORD-002",
    date: "20 Şubat 2026",
    items: [
      { id: "i2", name: "Seramik Vazo - Turkuaz", artisan: "Mehmet Usta", price: 89, qty: 1, image: "/placeholder.svg?height=80&width=80" },
    ],
    total: 104,
  },
];

const RETURN_REASONS = [
  "Ürün açıklamayla uyuşmuyor",
  "Ürün hasarlı geldi",
  "Yanlış ürün gönderildi",
  "Kalite beklentimi karşılamadı",
  "Kişiselleştirme hatalı yapıldı",
  "Diğer",
];

const RETURN_STEPS = [
  { icon: RotateCcw, label: "Talep Oluştur", desc: "Formu doldurun ve gönderin" },
  { icon: Clock, label: "İnceleme", desc: "1-2 iş günü içinde değerlendirilir" },
  { icon: Truck, label: "Ürünü Gönderin", desc: "Size kargo etiketi iletilir" },
  { icon: CheckCircle2, label: "İade Tamamlandı", desc: "Pi ödemeniz iade edilir" },
];

type Step = "select" | "form" | "success";

export default function IadePage() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("select");
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnType, setReturnType] = useState<"iade" | "degisim">("iade");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");

  const order = RETURNABLE_ORDERS.find((o) => o.id === selectedOrder);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async () => {
    if (!reason) {
      toast({ title: "Lütfen bir neden seçin", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    const ref = `RET-${Date.now().toString().slice(-6)}`;
    setReferenceNo(ref);
    setIsSubmitting(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack title="İade / Değişim" />
        <div className="container mx-auto px-4 py-12 max-w-lg text-center">
          <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Talebiniz Alındı</h2>
          <p className="text-muted-foreground mb-4 text-pretty">
            {returnType === "iade" ? "İade" : "Değişim"} talebiniz başarıyla oluşturuldu.
            Satıcı ve destek ekibimiz 1-2 iş günü içinde size dönüş yapacak.
          </p>
          <div className="bg-secondary rounded-xl p-4 mb-6 inline-block">
            <p className="text-xs text-muted-foreground mb-1">Referans Numaranız</p>
            <p className="font-mono font-bold text-lg text-primary">{referenceNo}</p>
          </div>
          <div className="space-y-3">
            <Link href="/profil">
              <Button className="w-full">Profilime Git</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Ana Sayfaya Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="İade / Değişim" />

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-5">

        {/* Süreç adımları */}
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-4 gap-2">
              {RETURN_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center text-center gap-1.5">
                    <div className="bg-accent p-2.5 rounded-full">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-semibold leading-tight">{s.label}</p>
                    {i < 3 && (
                      <div className="absolute" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bilgi notu */}
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">İade Koşulları</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
              Teslimattan itibaren 14 gün içinde iade / değişim talep edebilirsiniz.
              Kişiselleştirilmiş ürünler yalnızca hatalı üretim durumunda iade kapsamındadır.
            </p>
          </div>
        </div>

        {step === "select" && (
          <>
            {/* Sipariş seçimi */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Hangi Sipariş?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RETURNABLE_ORDERS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrder(o.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                      selectedOrder === o.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-accent p-2 rounded-lg">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.date} · {o.total}π</p>
                      </div>
                    </div>
                    {selectedOrder === o.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              disabled={!selectedOrder}
              onClick={() => setStep("form")}
            >
              Devam Et
            </Button>
          </>
        )}

        {step === "form" && order && (
          <>
            {/* Geri butonu */}
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Sipariş seçimine dön
            </button>

            {/* Ürün seçimi */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Hangi Ürünler?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      selectedItems.includes(item.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.artisan} · {item.qty} adet · {item.price * item.qty}π</p>
                    </div>
                    {selectedItems.includes(item.id) && (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* İade / Değişim tipi */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Talep Türü</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(["iade", "degisim"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setReturnType(type)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        returnType === type
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-semibold text-sm">
                        {type === "iade" ? "Para İadesi" : "Ürün Değişimi"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type === "iade" ? "Pi olarak iade edilir" : "Aynı ürün yeniden gönderilir"}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Neden */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">İade Nedeni</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Neden seçin</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Neden seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {RETURN_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">
                    Açıklama <span className="text-xs">(isteğe bağlı)</span>
                  </Label>
                  <Textarea
                    placeholder="Sorununuzu detaylı açıklayın..."
                    className="resize-none"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Özet */}
            {selectedItems.length > 0 && reason && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold mb-2">Talep Özeti</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Sipariş:</span>
                      <span className="font-medium text-foreground">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Talep Türü:</span>
                      <span className="font-medium text-foreground">
                        {returnType === "iade" ? "Para İadesi" : "Değişim"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ürün Sayısı:</span>
                      <span className="font-medium text-foreground">{selectedItems.length} ürün</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Neden:</span>
                      <span className="font-medium text-foreground truncate ml-4 text-right">{reason}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full h-11"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedItems.length === 0 || !reason}
            >
              {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
