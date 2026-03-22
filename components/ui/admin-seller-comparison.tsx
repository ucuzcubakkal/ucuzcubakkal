"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Store, TrendingUp, Star, AlertTriangle, CheckCircle2 } from "lucide-react";

const SELLERS = [
  { id: "S1", name: "Anatolia Craft",  sales: 312, revenue: 18240, rating: 4.9, returnRate: 1.2, responseTime: 1.4, satisfaction: 97, products: 28, verified: true  },
  { id: "S2", name: "Cini Ustasi",     sales: 189, revenue: 11340, rating: 4.7, returnRate: 2.1, responseTime: 2.8, satisfaction: 91, products: 15, verified: true  },
  { id: "S3", name: "Ipliklerin Dili", sales: 142, revenue: 8520,  rating: 4.8, returnRate: 1.8, responseTime: 2.1, satisfaction: 94, products: 21, verified: false },
  { id: "S4", name: "Oguz Ahsap",      sales: 98,  revenue: 5880,  rating: 4.6, returnRate: 3.1, responseTime: 4.2, satisfaction: 88, products: 12, verified: true  },
  { id: "S5", name: "Tac Taki",        sales: 221, revenue: 13260, rating: 4.8, returnRate: 1.5, responseTime: 1.8, satisfaction: 95, products: 34, verified: true  },
];

type SellerKey = "sales" | "revenue" | "rating" | "returnRate" | "responseTime" | "satisfaction" | "products";
interface MetricRow { label: string; keyA: SellerKey; keyB: SellerKey; unit?: string; lowerBetter?: boolean; }
const METRICS: MetricRow[] = [
  { label: "Toplam Satis",     keyA: "sales",        keyB: "sales",        unit: "adet" },
  { label: "Toplam Ciro",      keyA: "revenue",      keyB: "revenue",      unit: "π"   },
  { label: "Ortalama Puan",    keyA: "rating",       keyB: "rating",       unit: "/5"  },
  { label: "Iade Orani",       keyA: "returnRate",   keyB: "returnRate",   unit: "%",  lowerBetter: true },
  { label: "Cevap Suresi",     keyA: "responseTime", keyB: "responseTime", unit: "sa", lowerBetter: true },
  { label: "Memnuniyet",       keyA: "satisfaction", keyB: "satisfaction", unit: "%"  },
  { label: "Urun Sayisi",      keyA: "products",     keyB: "products",     unit: "adet"},
];

export function AdminSellerComparison() {
  const [selA, setSelA] = useState(SELLERS[0].id);
  const [selB, setSelB] = useState(SELLERS[1].id);

  const A = SELLERS.find(s => s.id === selA)!;
  const B = SELLERS.find(s => s.id === selB)!;

  const radarData = [
    { axis: "Satis",      A: Math.round((A.sales / 312) * 100),      B: Math.round((B.sales / 312) * 100)      },
    { axis: "Ciro",       A: Math.round((A.revenue / 18240) * 100),  B: Math.round((B.revenue / 18240) * 100)  },
    { axis: "Puan",       A: Math.round((A.rating / 5) * 100),       B: Math.round((B.rating / 5) * 100)       },
    { axis: "Memnuniyet", A: A.satisfaction,                          B: B.satisfaction                          },
    { axis: "Urunler",    A: Math.round((A.products / 34) * 100),    B: Math.round((B.products / 34) * 100)    },
  ];

  const winner = (keyA: number, keyB: number, lowerBetter?: boolean) => {
    if (keyA === keyB) return "tie";
    return (lowerBetter ? keyA < keyB : keyA > keyB) ? "A" : "B";
  };

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />Satici Karsilastirma
        </CardTitle>
        <CardDescription className="text-xs">Iki saticiyi yan yana karsilastir</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Satici secimleri */}
        <div className="grid grid-cols-2 gap-3">
          {[{ val: selA, set: setSelA, label: "Satici A", color: "text-blue-600" }, { val: selB, set: setSelB, label: "Satici B", color: "text-violet-600" }].map(s => (
            <div key={s.label}>
              <p className={`text-xs font-semibold mb-1 ${s.color}`}>{s.label}</p>
              <Select value={s.val} onValueChange={s.set}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SELLERS.map(sel => (
                    <SelectItem key={sel.id} value={sel.id} disabled={sel.id === (s.label === "Satici A" ? selB : selA)}>
                      {sel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Radar grafiği */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Radar name={A.name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name={B.name} dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrik karsilastirma tablosu */}
        <div className="divide-y divide-border">
          {METRICS.map(m => {
            const vA = A[m.keyA] as number;
            const vB = B[m.keyB] as number;
            const w  = winner(vA, vB, m.lowerBetter);
            const maxVal = Math.max(vA, vB);
            return (
              <div key={m.label} className="py-2.5 grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                {/* A degeri */}
                <div className="text-right space-y-1">
                  <p className={`text-sm font-bold ${w === "A" ? "text-blue-600" : "text-foreground"}`}>{vA}{m.unit}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${maxVal > 0 ? (vA / maxVal) * 100 : 0}%` }} />
                  </div>
                </div>
                {/* Label */}
                <div className="text-center px-2">
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{m.label}</p>
                  {w !== "tie" && (
                    <Badge className={`text-[10px] px-1 py-0 mt-0.5 ${w === "A" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
                      {w} kazandi
                    </Badge>
                  )}
                </div>
                {/* B degeri */}
                <div className="text-left space-y-1">
                  <p className={`text-sm font-bold ${w === "B" ? "text-violet-600" : "text-foreground"}`}>{vB}{m.unit}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${maxVal > 0 ? (vB / maxVal) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
