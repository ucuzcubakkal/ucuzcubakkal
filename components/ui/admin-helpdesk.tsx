"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Headphones, Search, Clock, CheckCircle2, AlertCircle, Circle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Priority = "dusuk" | "orta" | "yuksek" | "kritik";
type Status   = "acik" | "isleniyor" | "beklemede" | "kapali";

interface Ticket {
  id: string; user: string; subject: string; category: string;
  priority: Priority; status: Status; created: string; assigned: string;
}

const INIT: Ticket[] = [
  { id:"T-001", user:"Mehmet K.",    subject:"Odeme onaylanmiyor",          category:"Odeme",     priority:"kritik", status:"acik",       created:"19 Mar 10:24", assigned:"Atanmadi" },
  { id:"T-002", user:"Ayse D.",      subject:"Kargo numarasini goremiyorum", category:"Kargo",     priority:"yuksek", status:"isleniyor",  created:"18 Mar 15:40", assigned:"Admin #2" },
  { id:"T-003", user:"Fatih A.",     subject:"Urun resmi yuklenemiyor",       category:"Teknik",    priority:"orta",   status:"isleniyor",  created:"18 Mar 09:12", assigned:"Admin #1" },
  { id:"T-004", user:"Zeynep M.",    subject:"Hesap silme talebi",            category:"Hesap",     priority:"dusuk",  status:"beklemede",  created:"17 Mar 22:05", assigned:"Admin #1" },
  { id:"T-005", user:"Kadir S.",     subject:"Iade sureci hakkinda bilgi",    category:"Iade",      priority:"orta",   status:"kapali",     created:"16 Mar 14:30", assigned:"Admin #3" },
];

const PRIORITY_CFG: Record<Priority, { label: string; class: string }> = {
  kritik: { label: "Kritik", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"          },
  yuksek: { label: "Yuksek", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  orta:   { label: "Orta",   class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"   },
  dusuk:  { label: "Dusuk",  class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"      },
};

const STATUS_CFG: Record<Status, { label: string; icon: React.ReactNode }> = {
  acik:       { label: "Acik",       icon: <Circle        className="h-3.5 w-3.5 text-red-500"    /> },
  isleniyor:  { label: "Isleniyor",  icon: <Clock         className="h-3.5 w-3.5 text-amber-500"  /> },
  beklemede:  { label: "Beklemede",  icon: <AlertCircle   className="h-3.5 w-3.5 text-blue-500"   /> },
  kapali:     { label: "Kapali",     icon: <CheckCircle2  className="h-3.5 w-3.5 text-green-500"  /> },
};

export function AdminHelpdesk() {
  const [tickets, setTickets] = useState<Ticket[]>(INIT);
  const [search,  setSearch]  = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reply, setReply]       = useState("");
  const { toast } = useToast();

  const filtered = tickets.filter(t =>
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  function close(id: string) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "kapali" } : t));
    toast({ title: `#${id} talebi kapatildi`, duration: 2000 });
    setExpanded(null);
  }

  const counts = {
    acik:      tickets.filter(t => t.status === "acik").length,
    isleniyor: tickets.filter(t => t.status === "isleniyor").length,
    beklemede: tickets.filter(t => t.status === "beklemede").length,
    kapali:    tickets.filter(t => t.status === "kapali").length,
  };

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" /> Musteri Destek Talebi Yonetimi
        </CardTitle>
        <CardDescription className="text-xs">Talepleri oncelik ve duruma gore yonet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ozet */}
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(counts) as [Status, number][]).map(([s, n]) => (
            <div key={s} className="bg-muted/40 rounded-xl p-2.5 text-center">
              <div className="flex justify-center mb-1">{STATUS_CFG[s].icon}</div>
              <p className="text-base font-bold">{n}</p>
              <p className="text-xs text-muted-foreground">{STATUS_CFG[s].label}</p>
            </div>
          ))}
        </div>

        {/* Arama */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kullanici veya konu ara..." className="pl-9 h-9 text-sm" />
        </div>

        {/* Talep listesi */}
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors text-left"
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}
              >
                <div className="flex-shrink-0">{STATUS_CFG[t.status].icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate">{t.subject}</p>
                    <Badge className={`text-[10px] px-1.5 py-0.5 ${PRIORITY_CFG[t.priority].class}`}>
                      {PRIORITY_CFG[t.priority].label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.user} · {t.category} · {t.created}</p>
                </div>
                <div className="flex-shrink-0 text-xs text-muted-foreground hidden sm:block">{t.assigned}</div>
                {expanded === t.id ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />}
              </button>

              {expanded === t.id && (
                <div className="border-t border-border p-3 bg-muted/10 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={reply} onChange={e => setReply(e.target.value)}
                      placeholder="Yanit yaz..." className="h-8 text-xs flex-1"
                    />
                    <Button size="sm" className="h-8 text-xs gap-1" onClick={() => { toast({ title: "Yanit gonderildi", duration: 2000 }); setReply(""); }}>
                      <Send className="h-3 w-3" /> Gonder
                    </Button>
                  </div>
                  {t.status !== "kapali" && (
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => close(t.id)}>
                      Talebi Kapat
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
