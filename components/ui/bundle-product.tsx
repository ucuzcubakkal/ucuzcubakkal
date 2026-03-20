"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Package, Plus, X, Tag, Percent, ShoppingBag, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BundleItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Bundle {
  id: string;
  name: string;
  items: BundleItem[];
  originalPrice: number;
  bundlePrice: number;
  discount: number;
  active: boolean;
}

const SAMPLE_PRODUCTS: BundleItem[] = [
  { id: 1, name: "El Dokuma Kilim Yastık",  price: 125, image: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Seramik Vazo",             price: 89,  image: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "El Örgüsü Çanta",          price: 160, image: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Ahşap Oyma Çerçeve",       price: 75,  image: "/placeholder.svg?height=40&width=40" },
];

export function BundleProductManager() {
  const { toast } = useToast();
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: "B1", name: "Ev Dekor Seti", active: true,
      items: [SAMPLE_PRODUCTS[0], SAMPLE_PRODUCTS[1]],
      originalPrice: 214, bundlePrice: 185, discount: 14,
    },
  ]);
  const [creating, setCreating] = useState(false);
  const [newBundle, setNewBundle] = useState({ name: "", discount: "10" });
  const [selected, setSelected] = useState<BundleItem[]>([]);

  const toggleProduct = (p: BundleItem) => {
    setSelected(prev =>
      prev.find(x => x.id === p.id)
        ? prev.filter(x => x.id !== p.id)
        : [...prev, p]
    );
  };

  const originalPrice = selected.reduce((a, p) => a + p.price, 0);
  const discountPct    = parseInt(newBundle.discount) || 0;
  const bundlePrice    = Math.round(originalPrice * (1 - discountPct / 100));

  const handleCreate = () => {
    if (!newBundle.name.trim() || selected.length < 2) {
      toast({ title: "En az 2 ürün seçin ve paket adı girin", variant: "destructive" });
      return;
    }
    setBundles(prev => [...prev, {
      id: `B${Date.now()}`, name: newBundle.name, active: true,
      items: selected, originalPrice, bundlePrice, discount: discountPct,
    }]);
    setCreating(false);
    setSelected([]);
    setNewBundle({ name: "", discount: "10" });
    toast({ title: "Paket ürün oluşturuldu", description: newBundle.name });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Paket Ürünler</span>
          <Badge variant="secondary" className="text-xs">{bundles.length}</Badge>
        </div>
        {!creating && (
          <Button size="sm" className="h-7 text-xs gap-1" onClick={() => setCreating(true)}>
            <Plus className="h-3.5 w-3.5" /> Paket Oluştur
          </Button>
        )}
      </div>

      {/* Mevcut paketler */}
      <div className="space-y-2">
        {bundles.map((b) => (
          <div key={b.id} className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3 flex-wrap">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate">{b.name}</p>
                <Badge className={cn("text-[10px] border-0 h-4", b.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                  {b.active ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {b.items.length} ürün · <span className="line-through">{b.originalPrice}π</span>{" "}
                <span className="text-primary font-bold">{b.bundlePrice}π</span>
                <span className="ml-1.5 text-green-600 font-medium">%{b.discount} indirim</span>
              </p>
            </div>
            <Button
              variant="ghost" size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={() => setBundles(prev => prev.filter(x => x.id !== b.id))}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Paket oluşturma formu */}
      {creating && (
        <div className="rounded-xl border-2 border-primary/30 bg-primary/3 p-4 space-y-4">
          <p className="text-sm font-semibold text-primary">Yeni Paket Oluştur</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Paket Adı</Label>
              <Input
                value={newBundle.name}
                onChange={(e) => setNewBundle(p => ({ ...p, name: e.target.value }))}
                placeholder="Örn: Ev Dekor Seti"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Percent className="h-3 w-3" /> İndirim Oranı
              </Label>
              <div className="relative">
                <Input
                  type="number" min="5" max="50"
                  value={newBundle.discount}
                  onChange={(e) => setNewBundle(p => ({ ...p, discount: e.target.value }))}
                  className="h-8 text-sm pr-7"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Paket Fiyatı</Label>
              <div className="h-8 rounded-md border bg-muted flex items-center px-3">
                <span className="text-sm font-bold text-primary">{bundlePrice > 0 ? `${bundlePrice}π` : "—"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Pakete Eklenecek Ürünler (min. 2)</Label>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRODUCTS.map((p) => {
                const isSelected = !!selected.find(x => x.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p)}
                    className={cn(
                      "rounded-lg border p-2.5 text-left transition-all text-xs",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <p className="font-semibold truncate">{p.name}</p>
                    <p className="text-muted-foreground mt-0.5">{p.price}π</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setCreating(false)}>
              Vazgec
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={handleCreate}>
              <Tag className="h-3.5 w-3.5 mr-1.5" /> Paketi Olustur
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
