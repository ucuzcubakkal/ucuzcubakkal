"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, RefreshCw, CheckCircle2, XCircle, AlertCircle, Database, Globe, Zap, Server, HardDrive, Download, Clock, Shield } from "lucide-react";

interface BackupRecord {
  id: string; type: string; size: string; date: string; status: "basarili" | "basarisiz" | "devam_ediyor"; duration: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  type: "api" | "db" | "cdn" | "ai";
  status: "online" | "degraded" | "offline";
  latency: number;
  uptime: number;
  lastCheck: string;
}

const INIT_SERVICES: ServiceStatus[] = [
  { id: "S1", name: "Pi Network API",    type: "api", status: "online",   latency: 142,  uptime: 99.8, lastCheck: "10 sn once" },
  { id: "S2", name: "Veritabani",        type: "db",  status: "online",   latency: 8,    uptime: 99.99,lastCheck: "5 sn once"  },
  { id: "S3", name: "CDN / Medya",       type: "cdn", status: "degraded", latency: 892,  uptime: 97.2, lastCheck: "15 sn once" },
  { id: "S4", name: "AI Asistan API",    type: "ai",  status: "online",   latency: 310,  uptime: 99.1, lastCheck: "8 sn once"  },
  { id: "S5", name: "E-posta Servisi",   type: "api", status: "online",   latency: 220,  uptime: 99.5, lastCheck: "12 sn once" },
  { id: "S6", name: "Odeme Altyapisi",   type: "api", status: "online",   latency: 188,  uptime: 99.9, lastCheck: "7 sn once"  },
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  api: <Globe className="h-4 w-4" />,
  db:  <Database className="h-4 w-4" />,
  cdn: <Server className="h-4 w-4" />,
  ai:  <Zap className="h-4 w-4" />,
};

const STATUS_CONFIG: Record<string, { color: string; badge: string; icon: React.ReactNode }> = {
  online:   { color: "text-green-600",  badge: "bg-green-100 text-green-700",   icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  degraded: { color: "text-amber-600",  badge: "bg-amber-100 text-amber-700",   icon: <AlertCircle className="h-3.5 w-3.5" />   },
  offline:  { color: "text-red-600",    badge: "bg-red-100 text-red-700",       icon: <XCircle className="h-3.5 w-3.5" />        },
};

const INIT_BACKUPS: BackupRecord[] = [
  { id: "BK1", type: "Tam Yedek",        size: "2.4 GB", date: "2026-03-09 03:00", status: "basarili",  duration: "8 dk" },
  { id: "BK2", type: "Artimsal Yedek",   size: "340 MB", date: "2026-03-09 15:00", status: "basarili",  duration: "2 dk" },
  { id: "BK3", type: "Artimsal Yedek",   size: "280 MB", date: "2026-03-08 15:00", status: "basarili",  duration: "1 dk" },
  { id: "BK4", type: "Tam Yedek",        size: "2.1 GB", date: "2026-03-08 03:00", status: "basarili",  duration: "7 dk" },
  { id: "BK5", type: "Medya Yedegi",     size: "8.7 GB", date: "2026-03-07 03:00", status: "basarisiz", duration: "—"    },
  { id: "BK6", type: "Tam Yedek",        size: "2.0 GB", date: "2026-03-07 03:00", status: "basarili",  duration: "7 dk" },
];

export function AdminServiceHealth() {
  const [services, setServices] = useState<ServiceStatus[]>(INIT_SERVICES);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("Az once");
  const [activeTab, setActiveTab] = useState<"services" | "backup">("services");

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate slight latency changes
      setServices(prev => prev.map(s => ({
        ...s,
        latency: s.latency + Math.floor(Math.random() * 40 - 20),
        lastCheck: "Az once",
      })));
      setLastRefresh("Az once");
      setRefreshing(false);
    }, 1200);
  };

  const onlineCount  = services.filter(s => s.status === "online").length;
  const degradedCount = services.filter(s => s.status === "degraded").length;
  const offlineCount = services.filter(s => s.status === "offline").length;

  const overallHealth = offlineCount > 0 ? "Sorun Var" : degradedCount > 0 ? "Kismi Sorun" : "Tum Sistemler Calisıyor";
  const overallColor  = offlineCount > 0 ? "text-red-600 bg-red-50 border-red-200" : degradedCount > 0 ? "text-amber-700 bg-amber-50 border-amber-200" : "text-green-700 bg-green-50 border-green-200";

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex border border-border rounded-xl overflow-hidden w-fit text-sm">
        <button onClick={() => setActiveTab("services")}
          className={`px-4 py-2 flex items-center gap-2 transition-colors ${activeTab === "services" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
          <Activity className="h-3.5 w-3.5" /> Servis Sagligi
        </button>
        <button onClick={() => setActiveTab("backup")}
          className={`px-4 py-2 flex items-center gap-2 transition-colors ${activeTab === "backup" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
          <HardDrive className="h-3.5 w-3.5" /> Yedekleme Raporu
        </button>
      </div>

    {activeTab === "services" && (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Dis Servis Saglik Monitoru
            </CardTitle>
            <CardDescription className="text-xs">Son guncelleme: {lastRefresh}</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={refresh} disabled={refreshing}>
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Kontrol ediliyor..." : "Yenile"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall status banner */}
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border text-sm font-semibold ${overallColor}`}>
          {offlineCount === 0 && degradedCount === 0
            ? <CheckCircle2 className="h-4 w-4" />
            : <AlertCircle className="h-4 w-4" />}
          {overallHealth}
          <span className="ml-auto text-xs font-normal opacity-70">
            {onlineCount} aktif · {degradedCount} yavas · {offlineCount} cevrimdisi
          </span>
        </div>

        {/* Services list */}
        <div className="space-y-2">
          {services.map(service => {
            const cfg = STATUS_CONFIG[service.status];
            return (
              <div key={service.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <div className={`flex-shrink-0 ${cfg.color}`}>
                  {TYPE_ICON[service.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{service.name}</p>
                  <p className="text-xs text-muted-foreground">%{service.uptime} uptime · {service.lastCheck}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${service.latency > 500 ? "text-red-500" : service.latency > 200 ? "text-amber-500" : "text-green-600"}`}>
                    {service.latency}ms
                  </p>
                  <p className="text-xs text-muted-foreground">Gecikme</p>
                </div>
                <Badge className={`text-xs flex-shrink-0 flex items-center gap-1 ${cfg.badge}`}>
                  {cfg.icon}
                  {service.status === "online" ? "Aktif" : service.status === "degraded" ? "Yavas" : "Cevrimdisi"}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
    )}

    {/* Yedekleme Raporu */}
    {activeTab === "backup" && (
      <Card className="border shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-primary" /> Otomatik Yedekleme Raporu
              </CardTitle>
              <CardDescription className="text-xs">Son 7 gunun yedekleme gecmisi ve durumu</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" /> Son Yedegi Indir
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ozet */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Toplam Yedek", value: INIT_BACKUPS.length, icon: <Database className="h-4 w-4" />, color: "text-primary" },
              { label: "Basarili", value: INIT_BACKUPS.filter(b => b.status === "basarili").length, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-600" },
              { label: "Basarisiz", value: INIT_BACKUPS.filter(b => b.status === "basarisiz").length, icon: <XCircle className="h-4 w-4" />, color: "text-red-500" },
            ].map(s => (
              <div key={s.label} className="bg-muted/40 rounded-xl p-3 text-center">
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Yedek listesi */}
          <div className="divide-y divide-border">
            {INIT_BACKUPS.map(bk => (
              <div key={bk.id} className="flex items-center gap-3 py-3 hover:bg-muted/20 rounded-lg px-2 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${bk.status === "basarili" ? "bg-green-500" : bk.status === "basarisiz" ? "bg-red-500 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{bk.type}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{bk.date}
                    {bk.duration !== "—" && <> · {bk.duration}</>}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">{bk.size}</p>
                </div>
                <Badge className={`text-xs flex-shrink-0 ${
                  bk.status === "basarili" ? "bg-green-100 text-green-700" :
                  bk.status === "basarisiz" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {bk.status === "basarili" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {bk.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Otomatik yedekleme zamani */}
          <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
            <Shield className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Sonraki otomatik yedek</p>
              <p className="text-xs text-muted-foreground">2026-03-10 03:00 — Tam Yedek</p>
            </div>
            <Badge className="bg-primary/10 text-primary text-xs">Zamanlandı</Badge>
          </div>
        </CardContent>
      </Card>
    )}
    </div>
  );
}
