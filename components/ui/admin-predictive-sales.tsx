"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from "recharts";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";

const DATA = [
  { gun: "Mar 10", gercek: 1240, tahmin: null,  alt: null,  ust: null  },
  { gun: "Mar 12", gercek: 1380, tahmin: null,  alt: null,  ust: null  },
  { gun: "Mar 14", gercek: 1190, tahmin: null,  alt: null,  ust: null  },
  { gun: "Mar 16", gercek: 1520, tahmin: null,  alt: null,  ust: null  },
  { gun: "Mar 18", gercek: 1460, tahmin: null,  alt: null,  ust: null  },
  { gun: "Mar 20", gercek: null, tahmin: 1510,  alt: 1380,  ust: 1640  },
  { gun: "Mar 22", gercek: null, tahmin: 1590,  alt: 1420,  ust: 1760  },
  { gun: "Mar 24", gercek: null, tahmin: 1720,  alt: 1540,  ust: 1900  },
  { gun: "Mar 26", gercek: null, tahmin: 1650,  alt: 1470,  ust: 1830  },
  { gun: "Mar 28", gercek: null, tahmin: 1800,  alt: 1600,  ust: 2000  },
  { gun: "Mar 30", gercek: null, tahmin: 1950,  alt: 1740,  ust: 2160  },
  { gun: "Nis 01", gercek: null, tahmin: 2100,  alt: 1870,  ust: 2330  },
];

const INSIGHTS = [
  { label: "Tahmin Edilen 30 Gun Geliri", value: "12.3k π", trend: "up"   },
  { label: "Ortalama Gunluk Siparis",     value: "47",       trend: "up"   },
  { label: "Beklenen Buyume Orani",       value: "+14.2%",   trend: "up"   },
  { label: "Risk Seviyesi",              value: "Dusuk",     trend: "flat" },
];

export function AdminPredictiveSales() {
  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Tahminsel Satis Analizi (AI)
            </CardTitle>
            <CardDescription className="text-xs">Gecmis veriye dayali onumuzdeki 14 gunluk satis tahmini</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary text-xs">AI Destekli</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Insight kartlar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {INSIGHTS.map(i => (
            <div key={i.label} className="bg-muted/40 rounded-xl p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{i.label}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-base font-bold">{i.value}</p>
                {i.trend === "up"   && <TrendingUp   className="h-3.5 w-3.5 text-green-500" />}
                {i.trend === "down" && <TrendingDown  className="h-3.5 w-3.5 text-red-500"   />}
                {i.trend === "flat" && <Minus         className="h-3.5 w-3.5 text-amber-500" />}
              </div>
            </div>
          ))}
        </div>

        {/* Tahmin grafigi */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="gun" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: any, name: string) => [v ? `${v} π` : "—", name === "gercek" ? "Gercek" : name === "tahmin" ? "Tahmin" : name === "alt" ? "Alt Sinir" : "Ust Sinir"]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x="Mar 18" stroke="#94a3b8" strokeDasharray="4 2" label={{ value: "Bugun", fontSize: 10, fill: "#94a3b8" }} />
              <Bar  dataKey="gercek" name="Gercek Satis" fill="#3b82f6" opacity={0.8} radius={[3,3,0,0]} />
              <Line dataKey="tahmin" name="AI Tahmini"   stroke="#f97316" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} connectNulls />
              <Line dataKey="ust"    name="Ust Sinir"    stroke="#cbd5e1" strokeWidth={1} dot={false} connectNulls />
              <Line dataKey="alt"    name="Alt Sinir"    stroke="#cbd5e1" strokeWidth={1} dot={false} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground">* Tahmin modeli son 6 aylik satis verisi, mevsimsel trenler ve platform buyume katsayisi kullanilarak hesaplanmistir.</p>
      </CardContent>
    </Card>
  );
}
