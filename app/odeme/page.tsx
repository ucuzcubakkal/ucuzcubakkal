"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard, CheckCircle2, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { usePiPayment } from "@/hooks/use-pi-payment";
import { Header } from "@/components/header";

type Step = "address" | "payment" | "confirm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();

  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState("pi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { initializePayment, isLoading: isPiLoading, error: piError } = usePiPayment();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Türkiye",
  });

  const shipping = totalPrice > 200 ? 0 : 15;
  const total = totalPrice + shipping;
  const orderId = `ORD-${Date.now()}`;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-serif font-bold mb-4">Giriş Yapmanız Gerekiyor</h2>
        <Link href="/giris"><Button>Giriş Yap</Button></Link>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-serif font-bold mb-4">Sepetiniz Boş</h2>
        <Link href="/"><Button>Alışverişe Başla</Button></Link>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (paymentMethod === "pi") {
        // Pi Network SDK ile gerçek ödeme girişimi
        const result = await initializePayment({
          amount: total,
          memo: `Ucuzcubakkal Siparişi — ${items.map((i) => i.name).join(", ").slice(0, 80)}`,
          metadata: {
            orderId,
            itemCount: items.length,
            buyerAddress: shippingInfo.city,
          },
        });
        if (!result && !piError) {
          // SDK mevcut değil (tarayıcı ortamı) — simülasyon moduna geç
          await new Promise((r) => setTimeout(r, 2000));
        }
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    } catch {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-3">Sipariş Alındı!</h2>
          <p className="text-muted-foreground mb-2">Siparişiniz başarıyla oluşturuldu.</p>
          <Badge variant="outline" className="mb-6 text-sm px-4 py-1">{orderId}</Badge>
          <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold mb-2">Teslimat Bilgileri</p>
            <p className="text-sm text-muted-foreground">{shippingInfo.fullName}</p>
            <p className="text-sm text-muted-foreground">{shippingInfo.address}</p>
            <p className="text-sm text-muted-foreground">{shippingInfo.city}, {shippingInfo.country}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/profil">
              <Button className="w-full">Siparişlerimi Gör</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Ana Sayfaya Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const STEPS = [
    { key: "address", label: "Adres" },
    { key: "payment", label: "Ödeme" },
    { key: "confirm", label: "Onay" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Ödeme" />

      {/* Adım Göstergesi */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${step === s.key ? "bg-primary text-primary-foreground" :
                    STEPS.findIndex(x => x.key === step) > i ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                  {STEPS.findIndex(x => x.key === step) > i ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.key ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            {/* Adres Adımı */}
            {step === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle>Teslimat Adresi</CardTitle>
                  <CardDescription>Siparişinizin gönderileceği adresi girin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Ad Soyad</Label>
                      <Input id="fullName" placeholder="Adınız Soyadınız"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" placeholder="+90 555 123 4567"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Textarea id="address" placeholder="Sokak, Mahalle, Bina No..." rows={3}
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <Label htmlFor="city">Şehir</Label>
                      <Input id="city" placeholder="İstanbul"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Posta Kodu</Label>
                      <Input id="zipCode" placeholder="34000"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Ülke</Label>
                      <Input id="country" placeholder="Türkiye"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })} />
                    </div>
                  </div>
                  <Button className="w-full h-11 mt-2"
                    onClick={() => setStep("payment")}
                    disabled={!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city}>
                    Ödemeye Geç
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ödeme Adımı */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Ödeme Yöntemi</CardTitle>
                  <CardDescription>Ödeme yönteminizi seçin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors
                      ${paymentMethod === "pi" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                      <RadioGroupItem value="pi" id="pi" />
                      <Wallet className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">Pi Network ile Öde</p>
                        <p className="text-sm text-muted-foreground">Güvenli ve hızlı Pi ödemesi</p>
                      </div>
                      <Badge className="bg-primary text-primary-foreground text-xs">Önerilen</Badge>
                    </label>
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-not-allowed opacity-50 border-border`}>
                      <RadioGroupItem value="card" id="card" disabled />
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Kredi / Banka Kartı</p>
                        <p className="text-sm text-muted-foreground">Yakında eklenecek</p>
                      </div>
                    </label>
                  </RadioGroup>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1 h-11" onClick={() => setStep("address")}>
                      Geri
                    </Button>
                    <Button className="flex-1 h-11" onClick={() => setStep("confirm")}>
                      Devam Et
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Onay Adımı */}
            {step === "confirm" && (
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Onayı</CardTitle>
                  <CardDescription>Siparişinizi onaylamadan önce kontrol edin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-semibold">Teslimat Adresi</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.fullName} - {shippingInfo.phone}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.address}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.city} {shippingInfo.zipCode}, {shippingInfo.country}</p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-semibold">Ödeme Yöntemi</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span>Pi Network ({total}π)</span>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Ödemeniz Pi Network güvenlik protokolleri ile korunmaktadır.
                    </p>
                  </div>
                  {piError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      <p className="text-xs text-destructive">{piError}</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 h-11" onClick={() => setStep("payment")}>
                      Geri
                    </Button>
                    <Button className="flex-1 h-11" onClick={handlePayment} disabled={isProcessing || isPiLoading}>
                      {(isProcessing || isPiLoading) ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Pi Network işleniyor...</>
                      ) : (
                        <><Wallet className="h-4 w-4 mr-2" />{total}π Öde</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium flex-shrink-0">{item.price * item.quantity}π</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kargo</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Ücretsiz</span>
                  ) : (
                    <span className="font-medium">{shipping}π</span>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold">Toplam</span>
                  <span className="font-bold text-primary text-lg">{total}π</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
