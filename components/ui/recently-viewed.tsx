"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

export function RecentlyViewed() {
  const { items, clearAll } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-serif font-bold">Son Baktıklarınız</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground gap-1"
          >
            <X className="h-3 w-3" /> Temizle
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((product) => (
            <Link key={product.id} href={`/urun/${product.id}`} className="flex-shrink-0 w-40">
              <Card className="overflow-hidden hover:shadow-md transition-all border-border">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-2">
                  <p className="text-xs font-medium line-clamp-2 leading-snug mb-1">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-xs">{product.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm font-bold text-primary">{product.price}π</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
