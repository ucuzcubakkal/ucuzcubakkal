"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Gauge, Server, Zap, AlertTriangle, CheckCircle2, RefreshCw,
  Activity, Globe, Clock, WifiOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const METRICS = [
  { label: "Anasayfa Yükleme",   value: 1.2,  unit: "sn",  status: "good",  benchmark: 3 },
  { label: "API Yanıt Süresi",   value: 187,  unit: "ms",  status: "good",  benchmark: 500 },
  { label: "Veritabanı Sorgu",   value: 94,   unit: "ms",  status: "good",  benchmark: 200 },
  { label: "Görsel Yükleme",     value: 2.4,  unit: "sn",  status: "warn",  benchmark: 2 },
  { label: "Checkout Akışı",     value: 1.8,  unit: "sn",  status: "good",  benchmark: 3 },
  { label: "Arama Sonuçları",    value: 320,  unit: "ms",  status: "good",  benchmark: 500 },
];

const ERROR_LOG = [
  { time: "14:32", type: "404", path: "/urun/99999",    count: 3,   severity: "low" },
  { time: "13:15", type: "500", path: "/api/odeme",     count: 1,   severity: "high" },
  { time: "11:44", type: "429", path: "/api/ara",       count: 12,  severity: "medium" },
];

const STATUS_COLOR = {
  good:   "text-green-600",
  warn:   "text-orange-500",
  error:  "text-destructive",
};

const SEVERITY_CONFIG = {
  low:    { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",     label: "Düşük" },
  medium: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", label: "Orta" },
  high:   { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",         label: "Yüksek" },
};

export function AdminPerformance() {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [uptime] = useState(99.97);
  const [activeUsers] = useState(1284);
  const [reqPerMin] = useState(342);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({ title: "Metrikler güncellendi" });
    }, 1200);
  };

  const overallScore = Math.round(
    METRICS.filter((m) => m.status === "good").length / METRICS.length * 100
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Performans İzleme Paneli
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Gerçek zamanlı sistem metrikleri</p>
        </div>
        <Button size="sm" variant="outline" onClick={refresh} className="gap-2 h-8">
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          Yenile
        </Button>
      </div>

      {/* Özet istatistikler */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Globe,   label: "Uptime",          value: `%${uptime}`,  color: "text-green-600" },
          { icon: Zap,     label: "Aktif Kullanıcı", value: activeUsers.toLocaleString("tr-TR"), color: "text-primary" },
          { icon: Server,  label: "İstek/dk",        value: reqPerMin,     color: "text-blue-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-3 pb-3 text-center">
              <Icon className={cn("h-5 w-5 mx-auto mb-1", color)} />
              <p className={cn("text-lg font-black", color)}>{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sağlık skoru */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold">Sistem Sağlığı</p>
            <span className={cn("text-sm font-bold", overallScore >= 80 ? "text-green-600" : "text-orange-500")}>
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Metrik listesi */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">SAYFA / API METRİKLERİ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {METRICS.map((m) => (
            <div key={m.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {m.status === "good"
                  ? <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  : <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                }
                <p className="text-xs truncate">{m.label}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-24 hidden sm:block">
                  <Progress
                    value={Math.min((m.value / m.benchmark) * 100, 100)}
                    className="h-1.5"
                  />
                </div>
                <span className={cn("text-xs font-bold tabular-nums", STATUS_COLOR[m.status as keyof typeof STATUS_COLOR])}>
                  {m.value}{m.unit}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hata günlüğü */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <WifiOff className="h-3.5 w-3.5" /> HATA GÜNLÜĞÜ (Son 24 Saat)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ERROR_LOG.map((err, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground">{err.time}</span>
                <Badge variant="outline" className="font-mono text-[10px]">{err.type}</Badge>
                <span className="truncate max-w-[120px] font-mono text-muted-foreground">{err.path}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-muted-foreground">×{err.count}</span>
                <Badge className={cn("text-[10px] border-0", SEVERITY_CONFIG[err.severity as keyof typeof SEVERITY_CONFIG].color)}>
                  {SEVERITY_CONFIG[err.severity as keyof typeof SEVERITY_CONFIG].label}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
