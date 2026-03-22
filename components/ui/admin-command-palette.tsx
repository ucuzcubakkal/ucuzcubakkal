"use client";

import { useState, useEffect, useRef } from "react";
import { Search, LayoutDashboard, ShoppingBag, Package, Users, Store, Wallet, Tag, BarChart2, Settings, RotateCcw, UserCheck, Megaphone, Terminal, MessageSquare, Globe, Sparkles, Layers, Award } from "lucide-react";

type Section = "dashboard"|"orders"|"products"|"sellers"|"members"|"returns"|"finance"|"coupons"|"reports"|"marketing"|"applications"|"logs"|"settings"|"kanban"|"seller-scores"|"broadcast"|"ai-assistant"|"gorusler";

interface CommandItem {
  id: Section;
  label: string;
  group: string;
  icon: React.ReactNode;
  keywords: string[];
}

const COMMANDS: CommandItem[] = [
  { id:"dashboard",     label:"Genel Bakış",              group:"Ana",          icon:<LayoutDashboard className="h-4 w-4"/>, keywords:["dashboard","ana","genel","bakis","ozet"] },
  { id:"orders",        label:"Siparişler",                group:"İşlemler",     icon:<ShoppingBag className="h-4 w-4"/>,     keywords:["siparis","order","kargo","teslim"] },
  { id:"products",      label:"Ürünler",                   group:"İşlemler",     icon:<Package className="h-4 w-4"/>,         keywords:["urun","product","stok","stock"] },
  { id:"sellers",       label:"Satıcılar",                 group:"İşlemler",     icon:<Store className="h-4 w-4"/>,           keywords:["satici","seller","magaza","store"] },
  { id:"members",       label:"Üyeler",                    group:"İşlemler",     icon:<Users className="h-4 w-4"/>,           keywords:["uye","member","kullanici","user"] },
  { id:"applications",  label:"Başvurular",                group:"İşlemler",     icon:<UserCheck className="h-4 w-4"/>,       keywords:["basvuru","application","onay","approve"] },
  { id:"returns",       label:"İade & Şikayet",            group:"İşlemler",     icon:<RotateCcw className="h-4 w-4"/>,       keywords:["iade","return","sikayet","refund"] },
  { id:"finance",       label:"Finans",                    group:"Analiz",       icon:<Wallet className="h-4 w-4"/>,          keywords:["finans","finance","odeme","payment","pi"] },
  { id:"coupons",       label:"Kuponlar",                  group:"Analiz",       icon:<Tag className="h-4 w-4"/>,             keywords:["kupon","coupon","indirim","discount"] },
  { id:"reports",       label:"Raporlar",                  group:"Analiz",       icon:<BarChart2 className="h-4 w-4"/>,       keywords:["rapor","report","analiz","grafik"] },
  { id:"seller-scores", label:"Satıcı Performans Skorları",group:"Analiz",       icon:<Award className="h-4 w-4"/>,           keywords:["skor","score","performans","puan"] },
  { id:"kanban",        label:"Kanban Tahta",              group:"Araçlar",      icon:<Layers className="h-4 w-4"/>,          keywords:["kanban","tahta","board","akis"] },
  { id:"broadcast",     label:"Duyurular",                 group:"Araçlar",      icon:<Megaphone className="h-4 w-4"/>,       keywords:["duyuru","broadcast","bildirim","notification"] },
  { id:"ai-assistant",  label:"AI Asistan",                group:"Sistem",       icon:<Sparkles className="h-4 w-4"/>,        keywords:["ai","asistan","yapay","zeka"] },
  { id:"gorusler",      label:"Görüş & Öneriler",          group:"Sistem",       icon:<MessageSquare className="h-4 w-4"/>,   keywords:["gorus","oneri","yorum","feedback"] },
  { id:"marketing",     label:"Pazarlama",                 group:"Sistem",       icon:<Globe className="h-4 w-4"/>,           keywords:["pazarlama","marketing","kampanya","campaign"] },
  { id:"logs",          label:"Sistem Logları",            group:"Sistem",       icon:<Terminal className="h-4 w-4"/>,        keywords:["log","sistem","hata","error","audit"] },
  { id:"settings",      label:"Ayarlar",                   group:"Sistem",       icon:<Settings className="h-4 w-4"/>,        keywords:["ayar","setting","konfigurasyon","config"] },
];

interface AdminCommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: Section) => void;
}

export function AdminCommandPalette({ open, onClose, onNavigate }: AdminCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim() === ""
    ? COMMANDS
    : COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.keywords.some(k => k.includes(query.toLowerCase()))
      );

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setHighlighted(0); }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && filtered[highlighted]) { select(filtered[highlighted].id); }
    if (e.key === "Escape") { onClose(); }
  };

  const select = (id: Section) => { onNavigate(id); onClose(); };

  const groups = Array.from(new Set(filtered.map(c => c.group)));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKey}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Bolum, islem veya ayar ara..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Sonuc bulunamadi</p>
          ) : (
            groups.map(group => {
              const items = filtered.filter(c => c.group === group);
              return (
                <div key={group}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">{group}</p>
                  {items.map(item => {
                    const idx = filtered.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        onClick={() => select(item.id)}
                        onMouseEnter={() => setHighlighted(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                          ${highlighted === idx ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      >
                        <span className={highlighted === idx ? "text-primary-foreground" : "text-muted-foreground"}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground flex items-center gap-1"><kbd className="bg-muted border rounded px-1">↑↓</kbd> Gezin</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><kbd className="bg-muted border rounded px-1">Enter</kbd> Sec</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><kbd className="bg-muted border rounded px-1">ESC</kbd> Kapat</span>
        </div>
      </div>
    </div>
  );
}
