"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingBag, X, ExternalLink, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

// Genis uyumlu tip: hem eski (artisan_name/images) hem yeni (seller/image) yapıyı destekler
export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  image?: string;
  // eski alan adları (opsiyonel)
  images?: string[];
  seller?: string;
  artisan_name?: string;
  reviews?: number;
  review_count?: number;
  is_featured?: boolean;
  stock?: number;
  freeShip?: boolean;
  badge?: string;
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

  // Alan adı uyumlulugu
  const image       = product.image ?? product.images?.[0] ?? "/placeholder.svg?height=400&width=400";
  const sellerName  = product.seller ?? product.artisan_name ?? "Satici";
  const reviewCount = product.reviews ?? product.review_count ?? 0;
  const stock       = product.stock ?? 99;
  const freeShip    = product.freeShip ?? false;

  const handleAddToCart = () => {
    addItem({
      productId: Number(product.id),
      name: product.name,
      artisan: sellerName,
      price: product.price,
      quantity: 1,
      image,
    });
    onClose();
  };

  const stockBadge =
    stock === 0
      ? { label: "Tükendi",          color: "bg-destructive text-destructive-foreground" }
      : stock <= 5
      ? { label: `Son ${stock} adet!`, color: "bg-orange-500 text-white" }
      : { label: "Stokta var",       color: "bg-green-500 text-white" };

  const discountPct = product.discount ?? (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">{product.name} - Hizli Onizleme</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 bg-card/80 hover:bg-card rounded-full p-1.5 border border-border"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Gorsel */}
        <div className="relative aspect-square bg-muted">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              One Cikan
            </Badge>
          )}
          {discountPct > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 font-bold">
              -{discountPct}%
            </Badge>
          )}
          <Badge className={`absolute bottom-3 right-3 border-0 ${stockBadge.color}`}>
            {stockBadge.label}
          </Badge>
        </div>

        {/* Icerik */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-base leading-tight mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{sellerName}</p>
          </div>

          {/* Puan */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviewCount.toLocaleString()} yorum)</span>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Fiyat */}
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-primary">{product.price}π</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through mb-0.5">
                {product.originalPrice}π
              </span>
            )}
          </div>

          {/* Kargo */}
          {freeShip && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <Truck className="h-4 w-4" />
              Ucretsiz kargo
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 gap-2 rounded-xl font-bold"
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              <ShoppingBag className="h-4 w-4" />
              {stock === 0 ? "Tukendi" : "Sepete Ekle"}
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl">
              <Heart className="h-4 w-4" />
            </Button>
            <Link href={`/urun/${product.id}`}>
              <Button variant="outline" size="icon" className="rounded-xl" onClick={onClose}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
