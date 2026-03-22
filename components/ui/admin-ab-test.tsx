"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BarChart2, TrendingUp, Users, CheckCircle2, Clock, PlayCircle, StopCircle } from "lucide-react";

interface ABTest {
  id: string; name: string; type: string; status: "aktif" | "tamamlandi" | "bekliyor";
  variantA: string; variantB: string;
  usersA: number; usersB: number;
  convA: number; convB: number;
  startDate: string; endDate: string;
  winner?: "A" | "B";
}

const INIT_TESTS: ABTest[] = [
  {
    id: "AB1", name: "Ana Sayfa Hero Banner", type: "Banner", status: "aktif",
    variantA: "El sanatlari odakli gorsel", variantB: "Sezonluk kampanya gorseli",
    usersA: 1240, usersB: 1198, convA: 8.4, convB: 11.2,
    startDate: "Mar 5", endDate: "Mar 19",
  },
  {
    id: "AB2", name: "Urun Kart Fiyat Gosterimi", type: "Fiyat", status: "tamamlandi",
    variantA: "Sadece Pi goster", variantB: "Pi + USD karsiligi",
    usersA: 2100, usersB: 2080, convA: 6.1, convB: 9.3,
    startDate: "Feb 20", endDate: "Mar 4", winner: "B",
  },
  {
    id: "AB3", name: "Sepete Ekle Butonu", type: "UI", status: "bekliyor",
    variantA: "Mevcut tasarim", variantB: "Yeni animasyonlu buton",
    usersA: 0, usersB: 0, convA: 0, convB: 0,
    startDate: "Mar 20", endDate: "Apr 3",
  },
];

export function AdminABTest() {
  const { toast } = useToast();
  const [tests, setTests] = useState<ABTest[]>(INIT_TESTS);

  const toggleStatus = (id: string) => {
    setTests(prev => prev.map(t => t.id === id
      ? { ...t, status: t.status === "aktif" ? "tamamlandi" : t.status === "bekliyor" ? "aktif" : "bekliyor" }
      : t
    ));
    toast({ title: "Test durumu guncellendi." });
  };

  const declareWinner = (id: string, winner: "A" | "B") => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, winner, status: "tamamlandi" } : t));
    toast({ title: `Varyant ${winner} kazanan ilan edildi.` });
  };

  const STATUS_COLORS: Record<ABTest["status"], string> = {
    aktif:       "bg-green-100 text-green-700",
    tamamlandi:  "bg-muted text-muted-foreground",
    bekliyor:    "bg-amber-100 text-amber-700",
  };

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-primary" />A/B Test Yoneticisi
        </CardTitle>
        <CardDescription className="text-xs">Farkli varyantlari kullanici segmentlerinde test et ve sonuclari karsilastir</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tests.map(t => {
          const totalUsers = t.usersA + t.usersB;
          const leadingVariant = t.convA >= t.convB ? "A" : "B";
          const lift = t.convA > 0 ? Math.abs(((t.convB - t.convA) / t.convA) * 100).toFixed(1) : "0";

          return (
            <div key={t.id} className="border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge className={`text-xs flex-shrink-0 ${STATUS_COLORS[t.status]}`}>{t.status}</Badge>
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <Badge className="text-xs bg-muted text-muted-foreground hidden sm:flex">{t.type}</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />{t.startDate} — {t.endDate}
                  <button onClick={() => toggleStatus(t.id)} className="ml-2">
                    {t.status === "aktif"
                      ? <StopCircle className="h-4 w-4 text-red-500 hover:text-red-700" />
                      : <PlayCircle className="h-4 w-4 text-green-500 hover:text-green-700" />}
                  </button>
                </div>
              </div>

              {/* Variant karsilastirma */}
              <div className="p-4 space-y-3">
                {(["A", "B"] as const).map(v => {
                  const users = v === "A" ? t.usersA : t.usersB;
                  const conv  = v === "A" ? t.convA  : t.convB;
                  const desc  = v === "A" ? t.variantA : t.variantB;
                  const isWinner = t.winner === v || (t.status === "aktif" && leadingVariant === v && totalUsers > 0);
                  return (
                    <div key={v} className={`p-3 rounded-xl border transition-colors ${isWinner && totalUsers > 0 ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${v === "A" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
                            Varyant {v}
                          </span>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                        {t.winner === v && <Badge className="text-xs bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Kazanan</Badge>}
                      </div>
                      <div className="flex items-end gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Kullanici</p>
                          <p className="text-lg font-bold">{users.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Donusum</p>
                          <p className={`text-lg font-bold ${isWinner && totalUsers > 0 ? "text-primary" : ""}`}>%{conv}</p>
                        </div>
                        <div className="flex-1">
                          <Progress value={conv * 6} className="h-2 mt-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Sonuc / Kazanan ilan et */}
                {t.status === "aktif" && totalUsers > 0 && !t.winner && (
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      Varyant {leadingVariant} +%{lift} donusum avantajinda
                    </p>
                    <div className="flex gap-1">
                      <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700" onClick={() => declareWinner(t.id, "A")}>A Kazandi</Button>
                      <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700" onClick={() => declareWinner(t.id, "B")}>B Kazandi</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
