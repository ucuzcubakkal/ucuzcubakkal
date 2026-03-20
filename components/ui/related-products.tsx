"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type Product = {
  id: string;
  name: string;
  artisan: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
};

type RelatedProductsProps = {
  currentId: string;
  category: string;
};

const ALL_PRODUCTS: Product[] = [
  { id: "1", name: "El Dokuma Kilim Yastık", artisan: "Ayşe Hanım Atölyesi", price: 125, rating: 4.9, reviews: 127, image: "/placeholder.svg?height=400&width=400" },
  { id: "2", name: "Seramik Vazo - Turkuaz", artisan: "Çömlek Sanatı", price: 89, rating: 4.8, reviews: 94, image: "/placeholder.svg?height=400&width=400" },
  { id: "3", name: "Ahşap Tepsi", artisan: "Marangoz Mehmet", price: 156, rating: 5.0, reviews: 203, image: "/placeholder.svg?height=400&width=400" },
  { id: "4", name: "Özel Tasarım Kolye", artisan: "Gümüş Atölye", price: 210, rating: 4.9, reviews: 156, image: "/placeholder.svg?height=400&width=400" },
  { id: "5", name: "El İşlemeli Keten Çanta", artisan: "Fatma Teyze Nakışları", price: 175, rating: 4.7, reviews: 88, image: "/placeholder.svg?height=400&width=400" },
  { id: "6", name: "Doğal Taş Bileklik", artisan: "Taş Atölyesi", price: 95, rating: 4.8, reviews: 112, image: "/placeholder.svg?height=400&width=400" },
  { id: "7", name: "Ahşap Oymalı Çerçeve", artisan: "Usta Oymacı", price: 220, rating: 5.0, reviews: 67, image: "/placeholder.svg?height=400&width=400" },
  { id: "8", name: "Renkli Cam Vazo", artisan: "Cam Sanatı Atölyesi", price: 310, rating: 4.9, reviews: 45, image: "/placeholder.svg?height=400&width=400" },
];

export function RelatedProducts({ currentId }: RelatedProductsProps) {
  const { addItem } = useCart();
  const related = ALL_PRODUCTS.filter((p) => p.id !== currentId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-serif font-bold">Bunu Alanlar Bunu da Aldı</h2>
        <Link href="/kategori/tumu">
          <Button variant="link" className="text-primary p-0 h-auto text-sm">Tümünü Gör</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((product) => (
          <Link key={product.id} href={`/urun/${product.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-all border-border group hover:border-primary/30">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-3">
                <p className="font-semibold text-xs line-clamp-2 leading-snug mb-1">{product.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{product.artisan}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{product.price}π</span>
                  <Button
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={(e) => {
                      e.preventDefault();
                      addItem({ productId: Number(product.id), name: product.name, artisan: product.artisan, price: product.price, quantity: 1, image: product.image });
                    }}
                  >
                    <ShoppingBag className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
