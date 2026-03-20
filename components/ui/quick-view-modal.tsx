"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingBag, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

type Product = {
  id: string;
  name: string;
  artisan_name: string;
  price: number;
  images: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  stock: number;
  description?: string;
};

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export function QuickViewModal({ product, open, onClose }: Props) {
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      productId: Number(product.id),
      name: product.name,
      artisan: product.artisan_name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
    onClose();
  };

  const stockBadge =
    product.stock === 0
      ? { label: "Tükendi", color: "bg-destructive text-destructive-foreground" }
      : product.stock <= 3
      ? { label: `Son ${product.stock} ürün!`, color: "bg-orange-500 text-white" }
      : { label: "Stokta var", color: "bg-green-500 text-white" };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.name} - Hızlı Önizleme</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 bg-card/80 hover:bg-card rounded-full p-1.5 border border-border"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Görsel */}
        <div className="relative aspect-square bg-muted">
          <img
            src={product.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Öne Çıkan
            </Badge>
          )}
          <Badge className={`absolute bottom-3 right-3 ${stockBadge.color} border-0`}>
            {stockBadge.label}
          </Badge>
        </div>

        {/* İçerik */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-serif text-xl font-bold mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.artisan_name}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${
                    s <= Math.round(product.rating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({product.review_count} yorum)</span>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-2xl font-bold text-primary">{product.price}π</span>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="h-4 w-4" />
              {product.stock === 0 ? "Tükendi" : "Sepete Ekle"}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Link href={`/urun/${product.id}`}>
              <Button variant="outline" size="icon" onClick={onClose}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
