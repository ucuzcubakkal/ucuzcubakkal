"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users, Crown, UserCheck, UserX, Search,
  ShoppingBag, TrendingUp, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Segment = "all" | "loyal" | "new" | "passive";

interface Customer {
  id: string;
  name: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  segment: Exclude<Segment, "all">;
}

const CUSTOMERS: Customer[] = [
  { id: "1", name: "Mehmet K.",  orders: 12, totalSpent: 1450, lastOrder: "2 gün önce",   segment: "loyal"   },
  { id: "2", name: "Ayse Y.",    orders: 1,  totalSpent: 125,  lastOrder: "3 gün önce",   segment: "new"     },
  { id: "3", name: "Zeynep A.",  orders: 5,  totalSpent: 680,  lastOrder: "1 ay önce",    segment: "loyal"   },
  { id: "4", name: "Hasan B.",   orders: 2,  totalSpent: 245,  lastOrder: "4 ay önce",    segment: "passive" },
  { id: "5", name: "Fatma C.",   orders: 8,  totalSpent: 920,  lastOrder: "1 hafta önce", segment: "loyal"   },
  { id: "6", name: "Ali D.",     orders: 1,  totalSpent: 89,   lastOrder: "5 gün önce",   segment: "new"     },
  { id: "7", name: "Selin E.",   orders: 3,  totalSpent: 380,  lastOrder: "3 ay önce",    segment: "passive" },
];

const SEGMENT_META: Record<Exclude<Segment,"all">, { label: string; color: string; icon: React.ElementType; desc: string }> = {
  loyal:   { label: "Sadik Musteri",   color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",  icon: Crown,     desc: "5+ siparis, aktif" },
  new:     { label: "Yeni Musteri",    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",       icon: UserCheck, desc: "1-2 siparis"       },
  passive: { label: "Pasif Musteri",   color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",          icon: UserX,     desc: "2+ ay siparis yok" },
};

export function CustomerSegments() {
  const [active, setActive] = useState<Segment>("all");
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter(c => {
    const matchSeg = active === "all" || c.segment === active;
    const matchStr = c.name.toLowerCase().includes(search.toLowerCase());
    return matchSeg && matchStr;
  });

  const counts = {
    all:     CUSTOMERS.length,
    loyal:   CUSTOMERS.filter(c => c.segment === "loyal").length,
    new:     CUSTOMERS.filter(c => c.segment === "new").length,
    passive: CUSTOMERS.filter(c => c.segment === "passive").length,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" /> Musteri Segmentasyonu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Segment secimleri */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["all", "loyal", "new", "passive"] as Segment[]).map((seg) => {
            const meta = seg === "all"
              ? { label: "Tumu", color: "", icon: Users }
              : SEGMENT_META[seg];
            const Icon = meta.icon;
            return (
              <button
                key={seg}
                onClick={() => setActive(seg)}
                className={cn(
                  "rounded-lg border p-2.5 text-left transition-all",
                  active === seg ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={cn("h-3.5 w-3.5", active === seg ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-[11px] font-bold", active === seg ? "text-primary" : "text-foreground")}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-lg font-black">{counts[seg]}</p>
              </button>
            );
          })}
        </div>

        {/* Arama */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Musteri ara..."
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Liste */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Musteri bulunamadı.</p>
          )}
          {filtered.map((c) => {
            const seg = SEGMENT_META[c.segment];
            const SegIcon = seg.icon;
            return (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5 hover:bg-muted/30 transition-colors">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">{c.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <Badge className={cn("text-[9px] h-4 border-0 gap-0.5 px-1.5", seg.color)}>
                      <SegIcon className="h-2.5 w-2.5" /> {seg.label}
                    </Badge>
                  </div>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <ShoppingBag className="h-3 w-3" /> {c.orders} siparis
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {c.totalSpent}π
                    </span>
                    <span className="text-[11px] text-muted-foreground">{c.lastOrder}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
