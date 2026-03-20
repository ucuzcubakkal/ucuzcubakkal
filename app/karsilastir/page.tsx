"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, X, ShoppingBag, CheckCircle2, XCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const ALL_PRODUCTS = [
  { id: "1", name: "El Dokuma Kilim Yastık", artisan: "Ayşe Hanım Atölyesi", price: 125, rating: 4.9, reviews: 127, stock: 12, category: "Ev Dekorasyonu", image: "/placeholder.svg?height=400&width=400", customizable: true, material: "Pamuk", origin: "Türkiye", weight: "500g" },
  { id: "2", name: "Seramik Vazo", artisan: "Çömlek Sanatı", price: 89, rating: 4.8, reviews: 94, stock: 3, category: "Ev Dekorasyonu", image: "/placeholder.svg?height=400&width=400", customizable: false, material: "Seramik", origin: "Türkiye", weight: "800g" },
  { id: "3", name: "Ahşap Tepsi", artisan: "Marangoz Mehmet", price: 156, rating: 5.0, reviews: 203, stock: 2, category: "Ev Dekorasyonu", image: "/placeholder.svg?height=400&width=400", customizable: true, material: "Ceviz Ağacı", origin: "Türkiye", weight: "1.2kg" },
  { id: "4", name: "Özel Tasarım Kolye", artisan: "Gümüş Atölye", price: 210, rating: 4.9, reviews: 156, stock: 8, category: "Moda", image: "/placeholder.svg?height=400&width=400", customizable: true, material: "925 Gümüş", origin: "Türkiye", weight: "30g" },
];

const COMPARE_ROWS = [
  { label: "Fiyat", key: "price", render: (v: unknown) => `${v}π` },
  { label: "Puan", key: "rating", render: (v: unknown) => String(v) },
  { label: "Değerlendirme", key: "reviews", render: (v: unknown) => `${v} yorum` },
  { label: "Kategori", key: "category", render: (v: unknown) => String(v) },
  { label: "Malzeme", key: "material", render: (v: unknown) => String(v) },
  { label: "Menşei", key: "origin", render: (v: unknown) => String(v) },
  { label: "Ağırlık", key: "weight", render: (v: unknown) => String(v) },
  { label: "Stok", key: "stock", render: (v: unknown) => `${v} adet` },
  { label: "Kişiselleştirme", key: "customizable", render: (v: unknown) => v ? "Var" : "Yok" },
];

export default function KarsilastirPage() {
  const [selected, setSelected] = useState<typeof ALL_PRODUCTS>([ALL_PRODUCTS[0], ALL_PRODUCTS[1]]);
  const { addItem } = useCart();

  const addProduct = (product: typeof ALL_PRODUCTS[0]) => {
    if (selected.length >= 3) return;
    if (selected.find((p) => p.id === product.id)) return;
    setSelected((prev) => [...prev, product]);
  };

  const removeProduct = (id: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== id));
  };

  const available = ALL_PRODUCTS.filter((p) => !selected.find((s) => s.id === p.id));

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Ürün Karşılaştır" />

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <p className="text-muted-foreground text-sm mb-6">En fazla 3 ürün karşılaştırabilirsiniz.</p>

        {/* Ürün Seçim Alanı */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Ürün Başlıkları */}
            <div className="flex gap-3 mb-6">
              <div className="w-36 flex-shrink-0" />
              {selected.map((product) => (
                <Card key={product.id} className="w-44 flex-shrink-0 border-primary/40">
                  <CardContent className="p-3 relative">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Kaldır"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <Link href={`/urun/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-lg mb-2"
                      />
                      <p className="font-semibold text-xs line-clamp-2 leading-snug mb-1">{product.name}</p>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-2">{product.artisan}</p>
                    <Button
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => addItem({ productId: Number(product.id), name: product.name, artisan: product.artisan, price: product.price, quantity: 1, image: product.image })}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" /> Ekle
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Ürün Ekle */}
              {selected.length < 3 && available.length > 0 && (
                <div className="w-44 flex-shrink-0">
                  <Card className="border-dashed border-border h-full min-h-[200px] flex items-center justify-center">
                    <CardContent className="p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-3">Karşılaştırma ekle</p>
                      <div className="space-y-1.5">
                        {available.slice(0, 3).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => addProduct(p)}
                            className="w-full text-left text-xs p-1.5 rounded hover:bg-accent flex items-center gap-1.5"
                          >
                            <Plus className="h-3 w-3 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Karşılaştırma Satırları */}
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.key} className={`flex gap-3 mb-0 ${i % 2 === 0 ? "bg-muted/30" : ""} rounded-lg`}>
                <div className="w-36 flex-shrink-0 flex items-center py-3 px-2">
                  <span className="text-xs font-semibold text-muted-foreground">{row.label}</span>
                </div>
                {selected.map((product) => {
                  const rawVal = product[row.key as keyof typeof product];
                  const isBest = row.key === "price"
                    ? product.price === Math.min(...selected.map((p) => p.price))
                    : row.key === "rating"
                    ? product.rating === Math.max(...selected.map((p) => p.rating))
                    : false;

                  return (
                    <div key={product.id} className="w-44 flex-shrink-0 flex items-center py-3 px-2">
                      {row.key === "customizable" ? (
                        rawVal ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )
                      ) : row.key === "rating" ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span className={`text-sm font-medium ${isBest ? "text-primary" : ""}`}>
                            {row.render(rawVal)}
                          </span>
                        </div>
                      ) : (
                        <span className={`text-sm ${isBest ? "font-bold text-primary" : "text-foreground"}`}>
                          {row.render(rawVal)}
                          {isBest && <Badge className="ml-1.5 text-xs px-1 py-0" variant="secondary">En İyi</Badge>}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
