"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PreviousOrder {
  id: string;
  product: string;
  price: number;
  image: string;
  date: string;
  artisan: string;
}

const PREV_ORDERS: PreviousOrder[] = [
  { id: "p1", product: "El Dokuma Kilim Yastık", price: 125, image: "/placeholder.svg?height=56&width=56", date: "28 Şubat", artisan: "Ayşe Hanım Atölyesi" },
  { id: "p2", product: "Seramik Vazo - Turkuaz",  price: 89,  image: "/placeholder.svg?height=56&width=56", date: "20 Şubat", artisan: "Çömlek Sanatı"       },
];

export function QuickReorder() {
  const { addItem } = useCart();
  const { toast }   = useToast();
  const [added, setAdded] = useState<Set<string>>(new Set());

  const handleReorder = (order: PreviousOrder) => {
    addItem({
      id: order.id,
      name: order.product,
      price: order.price,
      image: order.image,
      artisan: order.artisan,
      artisanId: "1",
    });
    setAdded(prev => new Set([...prev, order.id]));
    toast({
      title: "Sepete eklendi",
      description: `${order.product} tekrar sepetinizde.`,
    });
    setTimeout(() => setAdded(prev => { const s = new Set(prev); s.delete(order.id); return s; }), 2500);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <RefreshCw className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Hızlı Yeniden Siparis</span>
      </div>
      {PREV_ORDERS.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-3 flex items-center gap-3">
            <img
              src={order.image}
              alt={order.product}
              className="h-14 w-14 rounded-lg object-cover flex-shrink-0 bg-muted"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{order.product}</p>
              <p className="text-xs text-muted-foreground">{order.artisan}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-primary">{order.price}π</span>
                <Badge variant="secondary" className="text-[10px] h-4">{order.date}</Badge>
              </div>
            </div>
            <Button
              size="sm"
              variant={added.has(order.id) ? "outline" : "default"}
              className={cn("h-8 w-8 p-0 flex-shrink-0", added.has(order.id) && "text-green-600 border-green-400")}
              onClick={() => handleReorder(order)}
              disabled={added.has(order.id)}
            >
              {added.has(order.id)
                ? <Check className="h-4 w-4" />
                : <ShoppingCart className="h-4 w-4" />
              }
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
