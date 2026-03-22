"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, TrendingUp, ShoppingBag, Users, Zap } from "lucide-react";

interface LiveMetric { label: string; value: string; sub: string; delta: string; up: boolean; color: string; }

function randomDelta(base: number, spread: number) {
  return Math.round(base + (Math.random() - 0.5) * spread);
}

export function AdminLiveStats() {
  const [tick,        setTick]        = useState(0);
  const [lastUpdated, setLastUpdated] = useState("Az once");
  const [auto,        setAuto]        = useState(true);
  const [countdown,   setCountdown]   = useState(30);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const metrics = useMemo((): LiveMetric[] => [
    { label: "Bugun Ciro",       value: `${randomDelta(4820, 400)} π`,  sub: "Canli",        delta: `+${randomDelta(12, 6)}%`, up: true,  color: "text-primary"  },
    { label: "Aktif Siparis",    value: `${randomDelta(34, 10)}`,        sub: "Isleniyor",    delta: `+${randomDelta(3, 2)}`,   up: true,  color: "text-blue-600" },
    { label: "Sitedeki Kullan.", value: `${randomDelta(218, 40)}`,       sub: "Canli",        delta: `+${randomDelta(8, 5)}%`,  up: true,  color: "text-green-600"},
    { label: "Bekleyen Iade",    value: `${randomDelta(7, 4)}`,          sub: "Onay bekliyor",delta: `-${randomDelta(2, 1)}`,   up: false, color: "text-red-500"  },
  ], [tick]);

  // Otomatik yenileme — 30 saniyede bir
  useEffect(() => {
    if (!auto) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setLastUpdated(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCountdown(30);
    }, 30000);
    const cd = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => { clearInterval(interval); clearInterval(cd); };
  }, [auto]);

  const refresh = () => {
    setTick(t => t + 1);
    setLastUpdated(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setCountdown(30);
  };

  const CITY_DATA = [
    { city: "Istanbul",  orders: 312, pct: 100 },
    { city: "Ankara",    orders: 189, pct: 61  },
    { city: "Izmir",     orders: 142, pct: 46  },
    { city: "Bursa",     orders: 98,  pct: 31  },
    { city: "Antalya",   orders: 87,  pct: 28  },
    { city: "Adana",     orders: 64,  pct: 21  },
    { city: "Diger",     orders: 221, pct: 71  },
  ];

  return (
    <div className="space-y-4">
      {/* Canli metrikler */}
      <Card className="border shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Canli Platform Metrikleri
              </CardTitle>
              <CardDescription className="text-xs">
                Son guncelleme: {lastUpdated}
                {auto && <span className="ml-2 text-primary font-medium">— {countdown}s sonra yenileniyor</span>}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuto(a => !a)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${auto ? "bg-green-50 border-green-200 text-green-700" : "bg-muted border-border text-muted-foreground"}`}
              >
                {auto ? "Oto Acik" : "Oto Kapali"}
              </button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={refresh}>
                <RefreshCw className="h-3.5 w-3.5" />Yenile
              </Button>
            </div>
          </div>
          {/* Countdown bar */}
          {auto && <Progress value={(countdown / 30) * 100} className="h-1 mt-2" />}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metrics.map(m => (
              <div key={m.label} className="bg-muted/30 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                  <span className={`text-xs font-semibold ${m.up ? "text-green-600" : "text-red-500"}`}>{m.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Il bazli siparis yogunlugu */}
      <Card className="border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />Siparis Yogunlugu — Il Bazli
          </CardTitle>
          <CardDescription className="text-xs">Bu ayin toplam siparisi ile karsilastirmali</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CITY_DATA.map(d => (
            <div key={d.city} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{d.city}</span>
                <span className="text-muted-foreground">{d.orders} siparis</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">* Harita gorsellestirme icin Mapbox entegrasyonu gereklidir.</p>
        </CardContent>
      </Card>
    </div>
  );
}
