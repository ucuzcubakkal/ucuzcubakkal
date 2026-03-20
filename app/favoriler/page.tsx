"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/header";
import { EmptyState } from "@/components/empty-state";
import { useCart } from "@/lib/cart-context";

type FavoriteProduct = {
  id: string;
  name: string;
  artisan: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

const MOCK_FAVORITES: FavoriteProduct[] = [
  {
    id: "1",
    name: "El Dokuma Kilim Yastık",
    artisan: "Ayşe Hanım Atölyesi",
    price: 125,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "3",
    name: "Seramik Kupa",
    artisan: "Toprak & Ateş",
    price: 45,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.8,
    reviews: 95,
  },
  {
    id: "5",
    name: "Geleneksel Bakır Çarşı Tabağı",
    artisan: "Bakırcı Mehmet Usta",
    price: 210,
    image: "/placeholder.svg?height=400&width=400",
    rating: 4.7,
    reviews: 62,
  },
];

export default function FavoriPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(MOCK_FAVORITES);
  const { addItem } = useCart();

  const handleRemoveFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    addItem({
      productId: Number(product.id),
      name: product.name,
      artisan: product.artisan,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold mb-2">Favorilerim</h2>
          <p className="text-muted-foreground">
            {favorites.length > 0
              ? `${favorites.length} ürün favorilerinizde`
              : "Beğendiğiniz ürünler burada görünür"}
          </p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState type="favorites" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-xl transition-shadow border-border group"
              >
                <Link href={`/urun/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/urun/${product.id}`}>
                    <h4 className="font-semibold text-lg mb-1 text-balance line-clamp-2 hover:text-primary transition-colors leading-snug">
                      {product.name}
                    </h4>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3">{product.artisan}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium text-sm">{product.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-primary">{product.price}π</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleRemoveFavorite(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
