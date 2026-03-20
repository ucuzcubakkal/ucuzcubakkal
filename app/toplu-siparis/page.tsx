"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Package,
  Users,
  Star,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  Loader2,
  ArrowRight,
  Gift,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type OrderItem = {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  customization: string;
  unitPrice: number;
};

const CATALOG = [
  { id: "c1", name: "El Dokuma Kilim Yastık", category: "Ev Dekorasyonu", basePrice: 125 },
  { id: "c2", name: "Seramik Vazo - Özel Baskı", category: "Dekorasyon", basePrice: 89 },
  { id: "c3", name: "Ahşap Plak - Kurumsal Logo", category: "Hediyelik", basePrice: 156 },
  { id: "c4", name: "El İşlemeli Keten Çanta", category: "Moda", basePrice: 175 },
  { id: "c5", name: "Özel Tasarım Kolye", category: "Takı", basePrice: 210 },
  { id: "c6", name: "Seramik Kupa - Kurumsal", category: "Mutfak", basePrice: 65 },
];

const BENEFITS = [
  { icon: Package, title: "%15 Toplu İndirim", desc: "50+ adet siparişlerde otomatik indirim" },
  { icon: Gift, title: "Özel Ambalaj", desc: "Şirket logolu hediye paketleme seçeneği" },
  { icon: Sparkles, title: "Kişiselleştirme", desc: "Her ürün için özel mesaj ve tasarım" },
  { icon: Users, title: "Dedicated Destek", desc: "Atanmış hesap yöneticisi desteği" },
  { icon: Star, title: "Öncelikli Üretim", desc: "Kurumsal siparişler öncelikle işleme alınır" },
  { icon: ShieldCheck, title: "Garanti", desc: "Kurumsal siparişlere 60 gün garanti" },
];

export default function TopluSiparisPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", productName: "", category: "", quantity: 10, customization: "", unitPrice: 0 },
  ]);
  const [companyInfo, setCompanyInfo] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    deadline: "",
    notes: "",
    budget: "",
  });

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productName: "",
        category: "",
        quantity: 10,
        customization: "",
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === "productName") {
          const catalog = CATALOG.find((c) => c.name === value);
          return { ...item, productName: String(value), unitPrice: catalog?.basePrice || 0 };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discountRate = totalItems >= 100 ? 0.2 : totalItems >= 50 ? 0.15 : totalItems >= 20 ? 0.1 : 0;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyInfo.company || !companyInfo.email || !companyInfo.contact) {
      toast({ title: "Eksik Bilgi", description: "Lütfen zorunlu alanları doldurun.", variant: "destructive" });
      return;
    }
    if (items.every((i) => !i.productName)) {
      toast({ title: "Ürün Seçin", description: "En az bir ürün seçmelisiniz.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setStep("success");
  };

  if (step === "success") {
    const refNo = `UB-CORP-${Date.now().toString().slice(-6)}`;
    return (
      <div className="min-h-screen bg-background">
        <Header showBack title="Toplu Sipariş" />
        <div className="container mx-auto px-4 py-16 max-w-lg text-center">
          <div className="bg-green-100 dark:bg-green-950/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-3">Teklifiniz Alındı!</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Ekibimiz 24 saat içinde sizinle iletişime geçecek ve özel fiyat teklifinizi hazırlayacak.
          </p>
          <Badge variant="outline" className="mb-8 text-base px-5 py-2 font-mono border-primary text-primary">
            {refNo}
          </Badge>
          <div className="bg-secondary/50 rounded-xl p-5 mb-8 text-left space-y-2">
            <p className="font-semibold text-sm">Teklif Özeti</p>
            <p className="text-sm text-muted-foreground">Şirket: <span className="text-foreground font-medium">{companyInfo.company}</span></p>
            <p className="text-sm text-muted-foreground">Toplam Adet: <span className="text-foreground font-medium">{totalItems} ürün</span></p>
            <p className="text-sm text-muted-foreground">Tahmini Tutar: <span className="text-primary font-bold">{total}π</span></p>
            {discountRate > 0 && (
              <p className="text-sm text-green-600 font-medium">%{(discountRate * 100).toFixed(0)} toplu indirim uygulandı</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/mesajlar">
              <Button className="w-full gap-2" size="lg">
                <Building2 className="h-4 w-4" />
                Mesajlarıma Git
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full" size="lg">Ana Sayfaya Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Toplu & Kurumsal Sipariş" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent py-10 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1">
            Kurumsal Çözümler
          </Badge>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-balance">
            Toplu & Kurumsal Siparişler
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Şirket hediyelerinden etkinlik ürünlerine kadar her türlü kurumsal ihtiyacınız için
            özel fiyatlandırma ve kişiselleştirme hizmetleri sunuyoruz.
          </p>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-xl font-bold mb-5 text-center">Kurumsal Avantajlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-secondary/40 rounded-xl p-4 flex flex-col items-start gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-sm">{b.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* İndirim Skalası */}
      <section className="py-6 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="font-semibold text-sm text-center mb-4">Toplu Sipariş İndirim Skalası</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { min: "20-49", disc: "10%", color: "border-blue-200 bg-blue-50 dark:bg-blue-950/20" },
              { min: "50-99", disc: "15%", color: "border-violet-200 bg-violet-50 dark:bg-violet-950/20" },
              { min: "100+", disc: "20%", color: "border-primary/30 bg-primary/5" },
            ].map((tier) => (
              <div key={tier.min} className={`rounded-xl border-2 ${tier.color} p-3 text-center`}>
                <p className="text-lg font-bold text-primary">{tier.disc}</p>
                <p className="text-xs text-muted-foreground">{tier.min} adet</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Şirket Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-4 w-4 text-primary" />
                    Şirket Bilgileri
                  </CardTitle>
                  <CardDescription>Kurumsal bilgilerinizi girin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Şirket Adı <span className="text-destructive">*</span></Label>
                      <Input
                        id="company"
                        placeholder="ABC Şirketi A.Ş."
                        value={companyInfo.company}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Yetkili Kişi <span className="text-destructive">*</span></Label>
                      <Input
                        id="contact"
                        placeholder="Adınız Soyadınız"
                        value={companyInfo.contact}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, contact: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="kurumsal@sirket.com"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        placeholder="+90 212 000 0000"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Teslim Tarihi</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={companyInfo.deadline}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, deadline: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Tahmini Bütçe (π)</Label>
                      <Input
                        id="budget"
                        placeholder="Örn: 5000"
                        value={companyInfo.budget}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, budget: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Özel Notlar</Label>
                    <Textarea
                      id="notes"
                      placeholder="Özel gereksinimleriniz, tercihleriniz veya sorularınız..."
                      rows={3}
                      value={companyInfo.notes}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, notes: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ürün Listesi */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-4 w-4 text-primary" />
                        Sipariş Kalemleri
                      </CardTitle>
                      <CardDescription>Sipariş etmek istediğiniz ürünleri ekleyin</CardDescription>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Kalem Ekle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={item.id} className="p-4 border border-border rounded-xl space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-muted-foreground">#{idx + 1}. Kalem</span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Ürün Seçin</Label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                          value={item.productName}
                          onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                        >
                          <option value="">Ürün seçin...</option>
                          {CATALOG.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name} — {c.basePrice}π/adet
                            </option>
                          ))}
                          <option value="Özel Ürün (Belirtiniz)">Özel Ürün (Belirtiniz)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Adet</Label>
                          <div className="flex items-center border border-input rounded-md overflow-hidden">
                            <button
                              type="button"
                              className="px-3 py-2 bg-muted hover:bg-muted/80 transition-colors"
                              onClick={() => updateItem(item.id, "quantity", Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              className="flex-1 text-center bg-background text-sm py-2 border-0 outline-none"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            />
                            <button
                              type="button"
                              className="px-3 py-2 bg-muted hover:bg-muted/80 transition-colors"
                              onClick={() => updateItem(item.id, "quantity", item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        {item.unitPrice > 0 && (
                          <div className="space-y-2">
                            <Label>Ara Toplam</Label>
                            <div className="h-9 flex items-center px-3 bg-muted rounded-md text-sm font-semibold text-primary">
                              {item.quantity * item.unitPrice}π
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Kişiselleştirme / Özel İstek</Label>
                        <Input
                          placeholder="Logo baskısı, renk tercihi, özel mesaj..."
                          value={item.customization}
                          onChange={(e) => updateItem(item.id, "customization", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Özet */}
            <div>
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Sipariş Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {items.filter((i) => i.productName && i.unitPrice > 0).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground line-clamp-1 flex-1 mr-1">
                          {item.productName} ×{item.quantity}
                        </span>
                        <span className="font-medium flex-shrink-0">{item.quantity * item.unitPrice}π</span>
                      </div>
                    ))}
                    {items.filter((i) => i.productName && i.unitPrice > 0).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-3">Ürün seçilmedi</p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Toplam Adet</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>

                  {subtotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ara Toplam</span>
                      <span className="font-medium">{subtotal}π</span>
                    </div>
                  )}

                  {discountRate > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Toplu İndirim (%{(discountRate * 100).toFixed(0)})</span>
                        <span className="font-medium">-{discount.toFixed(0)}π</span>
                      </div>
                    </>
                  )}

                  {total > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-bold">Tahmini Toplam</span>
                        <span className="font-bold text-primary text-lg">{total.toFixed(0)}π</span>
                      </div>
                    </>
                  )}

                  {discountRate > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-xs text-green-700 dark:text-green-400">
                      🎉 %{(discountRate * 100).toFixed(0)} toplu indirim uygulanıyor!
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 gap-2 mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor...</>
                    ) : (
                      <>Teklif Al <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Ekibimiz 24 saat içinde sizinle iletişime geçecek ve kesin fiyat teklifi sunacak.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
