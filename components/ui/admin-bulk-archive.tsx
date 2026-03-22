"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Archive, Package, FileText, Filter, CheckSquare, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArchivableItem { id: string; name: string; type: "urun" | "blog"; views: number; sales: number; lastActive: string; selected: boolean; }

const INIT: ArchivableItem[] = [
  { id:"AR1", name:"Eski Halı Modeli v1",          type:"urun", views:12, sales:0, lastActive:"3 ay once",  selected:false },
  { id:"AR2", name:"2024 Kis Koleksiyonu",          type:"urun", views:34, sales:2, lastActive:"4 ay once",  selected:false },
  { id:"AR3", name:"Tanıtım Yazisi - Ocak 2024",   type:"blog", views:89, sales:0, lastActive:"14 ay once", selected:false },
  { id:"AR4", name:"Pamuk Sapan (Stok Yok)",        type:"urun", views:5,  sales:0, lastActive:"6 ay once",  selected:false },
  { id:"AR5", name:"Platform Yenilikler - Ekim 23", type:"blog", views:22, sales:0, lastActive:"18 ay once", selected:false },
  { id:"AR6", name:"Deneme Urun - Test",            type:"urun", views:2,  sales:0, lastActive:"8 ay once",  selected:false },
];

export function AdminBulkArchive() {
  const [items, setItems] = useState<ArchivableItem[]>(INIT);
  const [filter, setFilter] = useState<"hepsi" | "urun" | "blog">("hepsi");
  const [minMonths, setMinMonths] = useState(3);
  const { toast } = useToast();

  const filtered = items.filter(i => filter === "hepsi" || i.type === filter);
  const selected = items.filter(i => i.selected);

  function toggleSelect(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  }
  function selectAll() {
    setItems(prev => prev.map(i => ({ ...i, selected: true })));
  }
  function archive() {
    const count = selected.length;
    setItems(prev => prev.filter(i => !i.selected));
    toast({ title: `${count} oge arsivlendi`, duration: 2500 });
  }

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Archive className="h-4 w-4 text-primary" /> Toplu Icerik Arsivleme
            </CardTitle>
            <CardDescription className="text-xs">Dusuk performansli veya eski icerik/urunleri toplu arsivle</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={selectAll} className="text-xs text-primary hover:underline">Tümünü Sec</button>
            {selected.length > 0 && (
              <Button size="sm" variant="destructive" className="h-8 text-xs gap-1.5" onClick={archive}>
                <Archive className="h-3.5 w-3.5" /> {selected.length} Ogeyi Arsivle
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtreler */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex border border-border rounded-xl overflow-hidden text-xs">
            {(["hepsi","urun","blog"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                {f === "hepsi" ? "Hepsi" : f === "urun" ? "Urunler" : "Bloglar"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Min. aktif olmama suresi:</span>
            <select value={minMonths} onChange={e => setMinMonths(+e.target.value)}
              className="border border-border rounded-lg px-2 py-1 bg-background text-xs">
              {[1,2,3,6,12].map(m => <option key={m} value={m}>{m} ay</option>)}
            </select>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/20"}`}>
              <button onClick={() => toggleSelect(item.id)} className="flex-shrink-0">
                {item.selected
                  ? <CheckSquare className="h-4 w-4 text-primary" />
                  : <Square      className="h-4 w-4 text-muted-foreground" />}
              </button>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === "urun" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"}`}>
                {item.type === "urun" ? <Package className="h-3.5 w-3.5"/> : <FileText className="h-3.5 w-3.5"/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.lastActive} · {item.views} gorunum · {item.sales} satis</p>
              </div>
              <Badge className={`text-xs flex-shrink-0 ${item.type === "urun" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                {item.type}
              </Badge>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">Bu kriterde arsivlenecek oge bulunamadi.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
