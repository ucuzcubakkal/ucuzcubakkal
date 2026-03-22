"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, Ban, CheckCircle2, Clock, Terminal, Flag, Trash2, Eye, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditEntry {
  id: string; admin: string; action: string; target: string;
  ip: string; time: string; level: "info" | "warning" | "error";
}

interface SuspectReview {
  id: string; user: string; product: string; rating: number;
  text: string; ip: string; accountAge: string; flagged: boolean;
}

interface BlockedIP {
  id: string; ip: string; reason: string; blockedAt: string; permanent: boolean;
}

const AUDIT_LOG: AuditEntry[] = [
  { id: "A1", admin: "hanedan", action: "Siparis onaylandi",     target: "#UCB-001",         ip: "185.23.1.44",   time: "03:09 14:22", level: "info"    },
  { id: "A2", admin: "hanedan", action: "Satici askiya alindi",  target: "OfficePro",         ip: "185.23.1.44",   time: "03:09 12:11", level: "warning" },
  { id: "A3", admin: "hanedan", action: "Urun silindi",          target: "P010",              ip: "185.23.1.44",   time: "03:08 18:45", level: "error"   },
  { id: "A4", admin: "hanedan", action: "Uye yasaklandi",        target: "ayse@email.com",    ip: "185.23.1.44",   time: "03:08 11:30", level: "warning" },
  { id: "A5", admin: "hanedan", action: "Kupon olusturuldu",     target: "BAHAR2026",         ip: "185.23.1.44",   time: "03:07 09:15", level: "info"    },
];

const SUSPECT_REVIEWS: SuspectReview[] = [
  { id: "R1", user: "kullanici_xyz",  product: "Galaxy S24",   rating: 5, text: "Mukemmel urun!",   ip: "91.22.33.44",  accountAge: "2 gun",  flagged: true  },
  { id: "R2", user: "newuser_2026",   product: "Deri Canta",   rating: 5, text: "Cok iyi satici!",  ip: "91.22.33.44",  accountAge: "1 gun",  flagged: true  },
  { id: "R3", user: "test_hesap",     product: "Spor Ayakkabi",rating: 1, text: "Hic iyi degil!!!",  ip: "10.0.0.99",    accountAge: "3 saat", flagged: true  },
];

const INIT_BLOCKED: BlockedIP[] = [
  { id: "IP1", ip: "91.22.33.44",  reason: "Sahte yorum serisi",  blockedAt: "2026-03-09", permanent: false },
  { id: "IP2", ip: "10.0.0.99",    reason: "Toplu spam istegi",   blockedAt: "2026-03-08", permanent: true  },
];

const LEVEL_STYLE: Record<string, string> = {
  info:    "bg-blue-100 text-blue-700",
  warning: "bg-amber-100 text-amber-700",
  error:   "bg-red-100 text-red-700",
};

export function AdminSecurityPanel() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"audit" | "reviews" | "ip">("audit");
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>(INIT_BLOCKED);
  const [suspects, setSuspects] = useState<SuspectReview[]>(SUSPECT_REVIEWS);
  const [newIP, setNewIP] = useState("");
  const [search, setSearch] = useState("");

  const blockIP = () => {
    if (!newIP.trim()) return;
    setBlockedIPs(prev => [...prev, { id: `IP${Date.now()}`, ip: newIP.trim(), reason: "Manuel engelleme", blockedAt: new Date().toISOString().slice(0, 10), permanent: false }]);
    setNewIP("");
    toast({ title: "IP engellendi", duration: 2000 });
  };

  const unblockIP = (id: string) => {
    setBlockedIPs(prev => prev.filter(ip => ip.id !== id));
    toast({ title: "IP engeli kaldirildi", duration: 2000 });
  };

  const approveReview = (id: string) => {
    setSuspects(prev => prev.filter(r => r.id !== id));
    toast({ title: "Yorum onaylandi ve isaretleme kaldirildi", duration: 2000 });
  };

  const deleteReview = (id: string) => {
    setSuspects(prev => prev.filter(r => r.id !== id));
    toast({ title: "Yorum silindi", duration: 2000 });
  };

  const filteredAudit = AUDIT_LOG.filter(a =>
    search === "" ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Tab */}
      <div className="flex border border-border rounded-xl overflow-hidden w-fit text-sm">
        {([["audit", "Islem Kaydi", <Terminal key="t" className="h-3.5 w-3.5" />],
           ["reviews", `Suphe (${suspects.length})`, <Flag key="r" className="h-3.5 w-3.5" />],
           ["ip", "IP Engel", <Ban key="i" className="h-3.5 w-3.5" />]] as const).map(([id, label, icon]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 flex items-center gap-2 transition-colors ${tab === id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Audit Log */}
      {tab === "audit" && (
        <Card className="border shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" /> Admin Islem Kayitlari
                </CardTitle>
                <CardDescription className="text-xs">Tum admin islemleri zaman damgasiyla kaydedilir</CardDescription>
              </div>
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="h-8 text-xs pl-8 w-44" placeholder="Islem veya hedef..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredAudit.map(entry => (
                <div key={entry.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20">
                  <Badge className={`text-xs mt-0.5 flex-shrink-0 ${LEVEL_STYLE[entry.level]}`}>{entry.level}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">Hedef: <span className="font-mono">{entry.target}</span></p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-mono text-muted-foreground">{entry.ip}</p>
                    <p className="text-xs text-muted-foreground">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suspect Reviews */}
      {tab === "reviews" && (
        <Card className="border shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Flag className="h-4 w-4 text-amber-500" /> Supheyle Isaretlenmis Yorumlar
            </CardTitle>
            <CardDescription className="text-xs">Yeni hesap, cok yorum, ayni IP — otomatik isaretlendi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {suspects.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm font-medium">Suphe bulunamadi</p>
                <p className="text-xs text-muted-foreground">Tum yorumlar temiz gorunuyor</p>
              </div>
            ) : suspects.map(r => (
              <div key={r.id} className="border border-amber-200 rounded-xl p-3 bg-amber-50/50">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold">{r.user}</p>
                    <p className="text-xs text-muted-foreground">{r.product} · Hesap yas: {r.accountAge} · IP: {r.ip}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:bg-green-50" onClick={() => approveReview(r.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => deleteReview(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm bg-background rounded-lg px-3 py-2 border">{r.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* IP Blocking */}
      {tab === "ip" && (
        <Card className="border shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-500" /> IP Engelleme Yoneticisi
            </CardTitle>
            <CardDescription className="text-xs">Engellenilen IP'ler platforma erisemez</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input className="h-9 text-sm flex-1" placeholder="91.22.33.44" value={newIP} onChange={e => setNewIP(e.target.value)}
                onKeyDown={e => e.key === "Enter" && blockIP()} />
              <Button size="sm" className="h-9" onClick={blockIP}>
                <Ban className="h-3.5 w-3.5 mr-1.5" /> Engelle
              </Button>
            </div>
            <div className="space-y-2">
              {blockedIPs.map(entry => (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/20">
                  <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded flex-shrink-0">{entry.ip}</code>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{entry.reason} · {entry.blockedAt}</p>
                  </div>
                  {entry.permanent && <Badge className="text-xs bg-red-100 text-red-700 flex-shrink-0">Kalici</Badge>}
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => unblockIP(entry.id)}>
                    Kaldir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
