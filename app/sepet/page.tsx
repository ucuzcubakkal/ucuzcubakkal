"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  Truck,
  Shield,
  RefreshCw,
  ShoppingBag,
  Store,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";

const VALID_COUPONS: Record<string, { discount: number; label: string }> = {
  PI10: { discount: 10, label: "%10 Pi indirim" },
  UCUZCU20: { discount: 20, label: "%20 Hoş geldin indirimi" },
  HOSGELDIN: { discount: 15, label: "%15 İlk alışveriş" },
  FLASH50: { discount: 50, label: "%50 Flash indirim" },
};

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { isLoggedIn } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; discount: number; label: string }>(null);
  const [couponError, setCouponError] = useState("");

  const discountAmount = appliedCoupon ? Math.round(totalPrice * (appliedCoupon.discount / 100)) : 0;
  const shipping = totalPrice >= 150 ? 0 : 12;
  const total = totalPrice - discountAmount + shipping;
  const savedTotal = discountAmount + (totalPrice >= 150 ? 12 : 0);

  const handleCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = VALID_COUPONS[code];
    if (coupon) {
      setAppliedCoupon({ code, ...coupon });
      setCouponError("");
    } else {
      setCouponError("Geçersiz veya süresi dolmuş kupon kodu.");
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) { router.push("/giris"); return; }
    router.push("/odeme");
  };

  // Group items by seller (artisan field)
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.artisan || "Diğer";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack title="Sepetim" />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center max-w-sm">
          <div className="bg-muted rounded-full p-6 mb-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Sepetiniz boş</h2>
          <p className="text-muted-foreground text-sm mb-6">Favori ürünlerinizi sepete ekleyin ve avantajlı fiyatlarla alışveriş yapın.</p>
          <Link href="/"><Button size="lg" className="w-full">Alışverişe Başla</Button></Link>
          <Link href="/favoriler" className="mt-3 w-full">
            <Button variant="outline" size="lg" className="w-full gap-2"><Heart className="h-4 w-4" />Favorilerim</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title={`Sepetim (${items.length})`} />

      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Cart items grouped by seller */}
          <div className="space-y-3">
            {Object.entries(grouped).map(([seller, sellerItems]) => {
              const sellerTotal = sellerItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
              const needsForFreeShip = Math.max(0, 150 - sellerTotal);
              return (
                <Card key={seller} className="border-border overflow-hidden">
                  {/* Seller header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                    <Store className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{seller}</span>
                    <Shield className="h-3.5 w-3.5 text-primary" title="Doğrulanmış Satıcı" />
                    <span className="ml-auto text-xs text-muted-foreground">{sellerItems.length} ürün</span>
                  </div>

                  {/* Free shipping progress */}
                  {needsForFreeShip > 0 && (
                    <div className="px-4 py-2 bg-accent/50 border-b border-border">
                      <p className="text-xs text-accent-foreground">
                        Bu mağazadan <span className="font-bold text-primary">{needsForFreeShip}π</span> daha harcayın, kargo ücretsiz!
                      </p>
                      <div className="mt-1 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (sellerTotal / 150) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                  {needsForFreeShip === 0 && (
                    <div className="px-4 py-2 bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        Bu satıcıdan kargo ücretsiz!
                      </p>
                    </div>
                  )}

                  {/* Products */}
                  <div className="divide-y divide-border">
                    {sellerItems.map((item) => (
                      <div key={item.id} className="p-4 flex gap-3">
                        <Link href={`/urun/${item.productId}`} className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                            <img src={item.image || "/placeholder.svg?height=160&width=160"} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/urun/${item.productId}`}>
                            <h3 className="font-medium text-sm mb-0.5 hover:text-primary transition-colors line-clamp-2 text-balance">{item.name}</h3>
                          </Link>
                          {item.customizationNote && (
                            <p className="text-[11px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground mb-1.5 inline-block">
                              {item.customizationNote}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 border border-border rounded-md">
                              <button className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-semibold text-sm w-7 text-center">{item.quantity}</span>
                              <button className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary">{(item.price * item.quantity).toLocaleString("tr-TR")}π</span>
                              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Ürünü kaldır">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-20 border-border">
              <CardContent className="p-5">
                <h2 className="font-bold text-base mb-4">Sipariş Özeti</h2>

                <div className="space-y-2.5 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ürünler ({items.reduce((s, i) => s + i.quantity, 0)} adet)</span>
                    <span className="font-medium">{totalPrice.toLocaleString("tr-TR")}π</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Kupon ({appliedCoupon?.code})</span>
                      <span className="font-medium">-{discountAmount.toLocaleString("tr-TR")}π</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kargo</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Ücretsiz</span>
                    ) : (
                      <span className="font-medium">{shipping}π</span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-muted-foreground bg-muted/50 rounded p-2">
                      150π üzeri siparişlerde ücretsiz kargo
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between pt-1">
                    <span className="font-bold">Toplam</span>
                    <span className="font-bold text-lg text-primary">{total.toLocaleString("tr-TR")}π</span>
                  </div>
                  {savedTotal > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-2 text-xs text-green-700 dark:text-green-400 font-medium">
                      Bu siparişle <span className="font-bold">{savedTotal}π</span> tasarruf ettiniz!
                    </div>
                  )}
                </div>

                {/* Coupon */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Kupon kodu"
                        className="pl-8 h-9 text-sm"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCoupon} className="h-9 px-3 text-xs font-semibold">
                      Uygula
                    </Button>
                  </div>
                  {appliedCoupon && <p className="text-xs text-green-600 mt-1 font-medium">{appliedCoupon.label} uygulandı!</p>}
                  {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
                  <p className="text-[11px] text-muted-foreground mt-1">Deneme: PI10 · UCUZCU20 · HOSGELDIN</p>
                </div>

                <Button className="w-full h-11 font-semibold text-base" onClick={handleCheckout}>
                  {isLoggedIn ? (
                    <span className="flex items-center gap-2">Ödemeye Geç <ChevronRight className="h-4 w-4" /></span>
                  ) : (
                    "Giriş Yap ve Öde"
                  )}
                </Button>

                {/* Trust badges */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: Shield, label: "Güvenli Ödeme" },
                    { icon: RefreshCw, label: "Kolay İade" },
                    { icon: Truck, label: "Hızlı Kargo" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-[10px] text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Payment methods */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[11px] text-muted-foreground text-center mb-2">Ödeme yöntemleri</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {["π Pi", "Kredi Kartı", "Havale"].map((method) => (
                      <Badge key={method} variant="outline" className="text-[10px] px-2 py-0.5 font-normal">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
