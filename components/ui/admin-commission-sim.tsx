"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MONTHLY_VOLUME = 42800; // pi cinsinden aylik toplam satis hacmi
const CURRENT_RATE   = 8;     // mevcut komisyon orani %

function calcRevenue(rate: number) { return Math.round(MONTHLY_VOLUME * rate / 100); }
function calcSellerImpact(rate: number) { return Math.round(MONTHLY_VOLUME * (rate - CURRENT_RATE) / 100); }

export function AdminCommissionSim() {
  const [rate, setRate] = useState(CURRENT_RATE);
  const { toast } = useToast();

  const newRevenue  = calcRevenue(rate);
  const diff        = newRevenue - calcRevenue(CURRENT_RATE);
  const impact      = calcSellerImpact(rate);

  const chartData = [4,6,8,10,12,14,16].map(r => ({
    oran: `%${r}`, gelir: calcRevenue(r), aktif: r === rate,
  }));

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" /> Komisyon Simulasyon Araci
            </CardTitle>
            <CardDescription className="text-xs">Farkli komisyon oranlarinin platform gelirine etkisini gercek zamanli hesapla</CardDescription>
          </div>
          <Badge className="text-xs bg-muted text-foreground">Mevcut Oran: %{CURRENT_RATE}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Yeni Komisyon Orani</span>
            <span className="text-2xl font-bold text-primary">%{rate}</span>
          </div>
          <Slider min={1} max={25} step={0.5} value={[rate]} onValueChange={v => setRate(v[0])} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>%1</span><span>%25</span>
          </div>
        </div>

        {/* Sonuc kartlari */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Tahmini Aylik Gelir</p>
            <p className="text-lg font-bold text-primary">{newRevenue.toLocaleString()} π</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${diff >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
            <p className="text-xs text-muted-foreground">Gelir Farki</p>
            <div className="flex items-center justify-center gap-1">
              {diff >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-green-600"/> : <TrendingDown className="h-3.5 w-3.5 text-red-500"/>}
              <p className={`text-lg font-bold ${diff >= 0 ? "text-green-600" : "text-red-500"}`}>
                {diff >= 0 ? "+" : ""}{diff.toLocaleString()} π
              </p>
            </div>
          </div>
          <div className={`rounded-xl p-3 text-center ${impact <= 0 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-muted/40"}`}>
            <p className="text-xs text-muted-foreground">Satici Etkisi</p>
            <p className={`text-lg font-bold ${impact > 0 ? "text-red-500" : "text-amber-600"}`}>
              {impact > 0 ? "+" : ""}{impact.toLocaleString()} π
            </p>
          </div>
        </div>

        {/* Karsilastirma grafigi */}
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="oran" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => [`${Number(v).toLocaleString()} π`, "Gelir"]} />
              <ReferenceLine x={`%${CURRENT_RATE}`} stroke="#94a3b8" strokeDasharray="4 2" />
              <Bar dataKey="gelir" radius={[4,4,0,0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.aktif ? "#f97316" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {rate !== CURRENT_RATE && (
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5">
            <p className="text-xs flex-1">%{CURRENT_RATE} → %{rate} degisikligini butun kategorilere uygulamak istiyor musunuz?</p>
            <Button size="sm" className="h-7 text-xs" onClick={() => { toast({ title: `Komisyon orani %${rate} olarak ayarlandi`, duration: 2000 }); setRate(rate); }}>
              Uygula
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
