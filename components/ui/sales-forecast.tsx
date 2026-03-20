"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const DATA_7: { day: string; gercek: number; tahmin: number }[] = [
  { day: "Pzt", gercek: 12, tahmin: 11 },
  { day: "Sal", gercek: 8,  tahmin: 9  },
  { day: "Car", gercek: 15, tahmin: 13 },
  { day: "Per", gercek: 10, tahmin: 12 },
  { day: "Cum", gercek: 22, tahmin: 18 },
  { day: "Cmt", gercek: 0,  tahmin: 20 },
  { day: "Paz", gercek: 0,  tahmin: 16 },
];

const DATA_30: { day: string; gercek: number; tahmin: number }[] = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  gercek: i < 22 ? Math.round(8 + Math.random() * 14) : 0,
  tahmin: Math.round(9 + Math.random() * 13),
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card shadow-lg p-2.5 text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-bold">{p.value} adet</span>
        </div>
      ))}
    </div>
  );
};

export function SalesForecast() {
  const [range, setRange] = useState<"7" | "30">("7");
  const data = range === "7" ? DATA_7 : DATA_30;

  const totalForecast  = data.reduce((a, d) => a + (d.tahmin ?? 0), 0);
  const totalActual    = data.filter(d => d.gercek > 0).reduce((a, d) => a + d.gercek, 0);
  const trend          = totalForecast > totalActual ? "up" : totalForecast < totalActual ? "down" : "flat";

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Satış Tahmini
          </CardTitle>
          <div className="flex gap-1">
            {(["7", "30"] as const).map((r) => (
              <Button
                key={r}
                variant={range === r ? "default" : "outline"}
                size="sm"
                className="h-6 text-xs px-2.5"
                onClick={() => setRange(r)}
              >
                {r} gün
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Özet */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg bg-muted/40 p-2.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Gercek (simdi)</p>
            <p className="text-lg font-bold mt-0.5">{totalActual}</p>
            <p className="text-[10px] text-muted-foreground">adet satıldı</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/15 p-2.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Tahmin (toplam)</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-lg font-bold">{totalForecast}</p>
              <TrendIcon className={cn("h-4 w-4", trendColor)} />
            </div>
            <p className="text-[10px] text-muted-foreground">adet bekleniyor</p>
          </div>
        </div>

        {/* Grafik */}
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGercek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F27A1A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F27A1A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTahmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="gercek"  stroke="#F27A1A" strokeWidth={2} fill="url(#colorGercek)" name="Gercek" />
            <Area type="monotone" dataKey="tahmin"  stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 4" fill="url(#colorTahmin)" name="Tahmin" />
          </AreaChart>
        </ResponsiveContainer>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Tahmin, geçmiş 90 günlük satış trendine göre oluşturulmuştur.
        </p>
      </CardContent>
    </Card>
  );
}
