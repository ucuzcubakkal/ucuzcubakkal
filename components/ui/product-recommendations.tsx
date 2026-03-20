"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const MOCK_RELATED = [
  { id: "5",  name: "Hasır Sepet",        artisan: "Doğal Atölye",     price: 68,  rating: 4.7, image: "/placeholder.svg?height=200&width=200", badge: "Çok Satan" },
  { id: "6",  name: "Boya Tasarım Kupa",  artisan: "Seramik İzmir",    price: 45,  rating: 4.9, image: "/placeholder.svg?height=200&width=200", badge: "Yeni" },
  { id: "7",  name: "Makrome Askılık",    artisan: "İpek Atölyesi",    price: 110, rating: 4.8, image: "/placeholder.svg?height=200&width=200", badge: null },
  { id: "8",  name: "Taş Baskı Tablo",   artisan: "Sanat Galerisi",   price: 195, rating: 5.0, image: "/placeholder.svg?height=200&width=200", badge: "Öne Çıkan" },
];

interface ProductRecommendationsProps {
  title?: string;
  context?: "similar" | "also_bought" | "trending";
  currentId?: string | number;
  category?: string;
}

const CONTEXT_LABELS = {
  similar:     "Benzer Ürünler",
  also_bought: "Bunu Alanlar Bunları da Aldı",
  trending:    "Şu An Trend",
};

export function ProductRecommendations({ title, context = "also_bought", currentId, category }: ProductRecommendationsProps) {
  const { addItem } = useCart();

  const label = title || CONTEXT_LABELS[context];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-border">
          {MOCK_RELATED.map((product, i) => (
            <div key={product.id} className="p-3 space-y-2">
              <Link href={`/urun/${product.id}`} className="block">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-xl bg-muted"
                  />
                  {product.badge && (
                    <Badge className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground border-0">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs font-semibold line-clamp-2 leading-tight">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground">{product.artisan}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-[10px] font-medium">{product.rating}</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-sm text-primary">{product.price}π</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 flex-shrink-0"
                  onClick={() => addItem({ productId: Number(product.id), name: product.name, artisan: product.artisan, price: product.price, quantity: 1, image: product.image })}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
