"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Package, Users, Send, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WaitlistItem { id: string; product: string; seller: string; waitCount: number; lastNotified: string | null; category: string; }

const ITEMS: WaitlistItem[] = [
  { id:"W1", product:"El Yapimi Kilim (120x80)",   seller:"Anatolian Art",   waitCount: 23, lastNotified: null,          category:"Tekstil"     },
  { id:"W2", product:"Dogal Kil Maske Seti",       seller:"Ege Olive",       waitCount: 17, lastNotified: "12 Mar",      category:"Kozmetik"    },
  { id:"W3", product:"Bakir Cezve (2 Kisilik)",     seller:"Ahmet Usta",      waitCount: 31, lastNotified: null,          category:"Mutfak"      },
  { id:"W4", product:"Handmade Deri Canta",         seller:"Zeynep Ceramics", waitCount: 9,  lastNotified: "15 Mar",      category:"Aksesuar"    },
  { id:"W5", product:"Organik Cicek Bali 500g",     seller:"Karadeniz Bali",  waitCount: 44, lastNotified: null,          category:"Gida"        },
];

export function AdminWaitlist() {
  const [notified, setNotified] = useState<string[]>([]);
  const { toast } = useToast();

  const totalWaiting = ITEMS.reduce((s, i) => s + i.waitCount, 0);

  function notify(id: string, product: string, count: number) {
    setNotified(prev => [...prev, id]);
    toast({ title: `${count} kullaniciye "${product}" stok bildirimi gonderildi`, duration: 3000 });
  }

  function notifyAll() {
    const pending = ITEMS.filter(i => !notified.includes(i.id) && !i.lastNotified);
    pending.forEach(i => setNotified(prev => [...prev, i.id]));
    toast({ title: `${pending.length} urun icin toplu stok bildirimi gonderildi`, duration: 3000 });
  }

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Urun Bekleme Listesi Paneli
            </CardTitle>
            <CardDescription className="text-xs">Stokta olmayan urunleri bekleyen kullanicilara bildirim gonder</CardDescription>
          </div>
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={notifyAll}>
            <Send className="h-3.5 w-3.5" /> Toplu Bildirim Gonder
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ozet */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Package className="h-4 w-4 text-primary mx-auto mb-1"/>
            <p className="text-lg font-bold">{ITEMS.length}</p>
            <p className="text-xs text-muted-foreground">Stokta Olmayan Urun</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <Users className="h-4 w-4 text-blue-500 mx-auto mb-1"/>
            <p className="text-lg font-bold">{totalWaiting}</p>
            <p className="text-xs text-muted-foreground">Bekleyen Kullanici</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1"/>
            <p className="text-lg font-bold">{Math.max(...ITEMS.map(i => i.waitCount))}</p>
            <p className="text-xs text-muted-foreground">En Yuksek Talep</p>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-2">
          {ITEMS.sort((a, b) => b.waitCount - a.waitCount).map(item => {
            const isNotified = notified.includes(item.id) || !!item.lastNotified;
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate">{item.product}</p>
                    <Badge className="text-xs bg-muted text-foreground">{item.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.seller}</p>
                </div>
                <div className="text-center flex-shrink-0">
                  <p className="text-base font-bold text-primary">{item.waitCount}</p>
                  <p className="text-xs text-muted-foreground">bekliyor</p>
                </div>
                {isNotified ? (
                  <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">
                    Bildirildi
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline" className="h-7 text-xs flex-shrink-0 gap-1" onClick={() => notify(item.id, item.product, item.waitCount)}>
                    <Bell className="h-3 w-3" /> Bildir
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
