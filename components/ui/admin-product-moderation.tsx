"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Eye, Package, Store, Clock } from "lucide-react";

interface PendingProduct {
  id: string; name: string; seller: string; category: string;
  price: number; desc: string; imgCount: number; date: string;
}

const INIT: PendingProduct[] = [
  { id: "PM1", name: "El Yapimi Kilim Heybe",       seller: "Anatolia Craft",  category: "Aksesuar",   price: 280, desc: "Geleneksel kilim teknigi ile el dokumasi, benzersiz desen.",       imgCount: 5, date: "2 saat once"  },
  { id: "PM2", name: "Seramik Kahve Fincan Seti",   seller: "Cini Ustasi",     category: "Ev Dekoru",  price: 150, desc: "6 parcali el boyamasi seramik fincan seti, doğal toprak boyalar.", imgCount: 4, date: "3 saat once"  },
  { id: "PM3", name: "Makrome Duvar Susu",          seller: "Ipliklerin Dili", category: "Ev Dekoru",  price: 95,  desc: "Pamuk ip ile dokunan minimalist tarzda duvar susu.",               imgCount: 3, date: "5 saat once"  },
  { id: "PM4", name: "Ahsap Oyma Mum Tutucu",       seller: "Oguz Ahsap",      category: "Hediyelik",  price: 65,  desc: "Ceviz agacindan el oyması, saf doga esintisi.",                   imgCount: 3, date: "6 saat once"  },
  { id: "PM5", name: "Dogal Tas Bileklik",          seller: "Tac Takı",        category: "Takilar",    price: 120, desc: "Dogal ametist ve obsidyen taslariyla el yapimi bileklik.",         imgCount: 6, date: "8 saat once"  },
];

export function AdminProductModeration() {
  const { toast } = useToast();
  const [products, setProducts] = useState<PendingProduct[]>(INIT);
  const [selected, setSelected] = useState<string[]>([]);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(prev => prev.length === products.length ? [] : products.map(p => p.id));

  const approve = (ids: string[]) => {
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    setSelected([]);
    toast({ title: `${ids.length} urun onaylandi ve yayina alindi.` });
  };

  const reject = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setRejectId(null);
    setRejectNote("");
    toast({ title: "Urun reddedildi, satici bildirildi.", variant: "destructive" });
  };

  if (products.length === 0)
    return (
      <Card className="border shadow-none">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <p className="font-semibold">Bekleyen urun yok</p>
          <p className="text-sm text-muted-foreground">Tum urunler incelendi.</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Urun Moderasyonu
              <Badge className="bg-amber-100 text-amber-700 text-xs">{products.length} bekliyor</Badge>
            </CardTitle>
            <CardDescription className="text-xs">Beklemedeki urunleri incele, toplu veya tekli onayla</CardDescription>
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{selected.length} secildi</span>
              <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700" onClick={() => approve(selected)}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Toplu Onayla
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Tumu sec */}
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Checkbox
            checked={selected.length === products.length}
            onCheckedChange={toggleAll}
            id="select-all"
          />
          <label htmlFor="select-all" className="text-xs text-muted-foreground cursor-pointer">Tümünü seç</label>
        </div>

        {products.map(p => (
          <div key={p.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${selected.includes(p.id) ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/20"}`}>
            <Checkbox
              checked={selected.includes(p.id)}
              onCheckedChange={() => toggle(p.id)}
              className="mt-1 flex-shrink-0"
            />
            {/* Gorsel placeholder */}
            <div className="w-14 h-14 rounded-xl bg-muted flex-shrink-0 flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold">{p.name}</p>
                <Badge className="text-xs bg-muted text-muted-foreground">{p.category}</Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Store className="h-3 w-3" />{p.seller}
                <span className="mx-1">·</span>
                <span className="text-primary font-semibold">{p.price} π</span>
                <span className="mx-1">·</span>
                <Eye className="h-3 w-3" />{p.imgCount} gorsel
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.desc}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />{p.date}
              </p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 px-2" onClick={() => approve([p.id])}>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 px-2"
                onClick={() => setRejectId(p.id)}>
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {/* Red notu dialog */}
        {rejectId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-5 space-y-4">
              <p className="font-semibold text-sm">Red Nedeni</p>
              <p className="text-xs text-muted-foreground">Satıcıya gonderilecek red nedeni:</p>
              <Textarea
                rows={3}
                placeholder="Ornegin: Fotograf kalitesi yetersiz, aciklama eksik..."
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                className="text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setRejectId(null)}>Iptal</Button>
                <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => reject(rejectId)}>Reddet</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
