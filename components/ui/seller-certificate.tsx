"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Star, Package, ThumbsUp, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CERT_LEVELS = [
  {
    id: "bronze",
    label: "Bronz Satici",
    color: "text-amber-700",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    minSales: 0,
    maxSales: 50,
    icon: "🥉",
    perks: ["Onaylanmis Satici rozeti", "Temel destek"],
  },
  {
    id: "silver",
    label: "Gumus Satici",
    color: "text-slate-600",
    bg: "bg-slate-50 dark:bg-slate-900/20",
    border: "border-slate-200 dark:border-slate-700",
    minSales: 50,
    maxSales: 200,
    icon: "🥈",
    perks: ["Arama sonuclarinda on siralama", "Oncelikli musteri destegi", "Gelismis analitik"],
  },
  {
    id: "gold",
    label: "Altin Satici",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    minSales: 200,
    maxSales: 500,
    icon: "🥇",
    perks: ["Ana sayfada one cikma", "Ozel kampanya destegi", "Dusuk komisyon orani (%3)", "Ozel profil rozeti"],
  },
  {
    id: "platinum",
    label: "Platin Satici",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    minSales: 500,
    maxSales: Infinity,
    icon: "💎",
    perks: ["Bolum tanitim alani", "Deger yoneticisi atamasi", "Komisyonsuz (ilk 1000π/ay)", "Etiket ve urun onerisi onceligi"],
  },
];

const MOCK_STATS = {
  totalSales: 87,
  avgRating: 4.7,
  returnRate: 2.1,
  responseTime: "1.8 saat",
  completionRate: 98.3,
};

export function SellerCertificate() {
  const { toast } = useToast();
  const [claimed, setClaimed] = useState(false);

  const currentLevel = CERT_LEVELS.findIndex(
    (l) => MOCK_STATS.totalSales >= l.minSales && MOCK_STATS.totalSales < l.maxSales
  );
  const level = CERT_LEVELS[currentLevel];
  const nextLevel = CERT_LEVELS[currentLevel + 1];
  const progress = nextLevel
    ? Math.round(((MOCK_STATS.totalSales - level.minSales) / (nextLevel.minSales - level.minSales)) * 100)
    : 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" /> Satici Sertifika Programi
        </CardTitle>
        <CardDescription className="text-xs">
          Satis performansiniza gore rozet kazanin ve daha fazla avantaj elde edin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mevcut seviye */}
        <div className={cn("rounded-xl border p-4 flex items-center gap-4", level.bg, level.border)}>
          <span className="text-4xl">{level.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={cn("font-bold text-base", level.color)}>{level.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{MOCK_STATS.totalSales} tamamlanmis satis</p>
            {nextLevel && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sonraki seviye: {nextLevel.label}</span>
                  <span className="font-semibold">{nextLevel.minSales - MOCK_STATS.totalSales} satis kaldi</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
          </div>
          {!claimed && (
            <Button
              size="sm"
              onClick={() => {
                setClaimed(true);
                toast({ title: `${level.label} rozeti talep edildi!`, description: "2-3 is gunu icerisinde onaylanacak.", duration: 3000 });
              }}
            >
              Talep Et
            </Button>
          )}
          {claimed && (
            <Badge className="bg-green-600 text-white text-xs">Onayda</Badge>
          )}
        </div>

        {/* Performans metrikleri */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Star,     label: "Ortalama Puan",    value: `${MOCK_STATS.avgRating}/5`,         color: "text-yellow-500" },
            { icon: Package,  label: "Toplam Satis",     value: MOCK_STATS.totalSales,               color: "text-blue-500" },
            { icon: ThumbsUp, label: "Tamamlanma Orani", value: `%${MOCK_STATS.completionRate}`,     color: "text-green-500" },
            { icon: Clock,    label: "Yanit Suresi",     value: MOCK_STATS.responseTime,             color: "text-purple-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-lg border border-border p-3 text-center bg-muted/30">
              <Icon className={cn("h-4 w-4 mx-auto mb-1", color)} />
              <p className="text-base font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Tum seviyeler */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tum Seviyeler</p>
          {CERT_LEVELS.map((lvl, i) => (
            <div
              key={lvl.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 border text-sm transition-colors",
                i === currentLevel ? cn(lvl.bg, lvl.border) : "bg-background border-border opacity-60"
              )}
            >
              <span className="text-xl flex-shrink-0">{lvl.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("font-semibold text-xs", i === currentLevel ? lvl.color : "text-foreground")}>
                  {lvl.label}
                  {i === currentLevel && <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">Mevcut</span>}
                </p>
                <p className="text-[11px] text-muted-foreground">{lvl.perks.join(" · ")}</p>
              </div>
              <div className="text-[11px] text-muted-foreground font-medium flex-shrink-0">
                {lvl.maxSales === Infinity ? `${lvl.minSales}+ satis` : `${lvl.minSales}–${lvl.maxSales}`}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
