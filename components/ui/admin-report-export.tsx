"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, FileSpreadsheet, Calendar, Filter, CheckCircle2 } from "lucide-react";

interface ReportConfig {
  dateRange: string; format: "pdf" | "excel"; category: string; seller: string;
  sections: string[];
}

const SECTIONS = [
  { id: "sales",     label: "Satis Ozeti"       },
  { id: "revenue",   label: "Gelir Analizi"      },
  { id: "orders",    label: "Siparis Detaylari"  },
  { id: "sellers",   label: "Satici Performansi" },
  { id: "members",   label: "Uye Istatistigi"    },
  { id: "returns",   label: "Iade Analizi"       },
  { id: "coupons",   label: "Kupon Kullanimi"    },
  { id: "traffic",   label: "Trafik Raporu"      },
];

const PAST_REPORTS = [
  { name: "Mart 2026 Gelir Raporu",     date: "Mar 10", format: "excel", size: "124 KB" },
  { name: "Subat 2026 Tam Rapor",       date: "Mar 1",  format: "pdf",   size: "2.1 MB" },
  { name: "Ocak-Mart Q1 Ozet",          date: "Feb 28", format: "excel", size: "318 KB" },
  { name: "Satici Performansi Q1 2026", date: "Feb 20", format: "pdf",   size: "890 KB" },
];

export function AdminReportExport() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ReportConfig>({
    dateRange: "bu-ay",
    format: "excel",
    category: "hepsi",
    seller: "hepsi",
    sections: ["sales", "revenue", "orders"],
  });
  const [generating, setGenerating] = useState(false);
  const [done,        setDone]       = useState(false);

  const toggleSection = (id: string) =>
    setConfig(c => ({
      ...c,
      sections: c.sections.includes(id) ? c.sections.filter(s => s !== id) : [...c.sections, id],
    }));

  const generate = () => {
    if (config.sections.length === 0) { toast({ title: "En az bir bolum secin.", variant: "destructive" }); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
      toast({ title: `Rapor hazirlandi — ${config.sections.length} bolum, ${config.format.toUpperCase()} formatinda.` });
    }, 1800);
  };

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />Ozellestirilmis Rapor Disa Aktarma
        </CardTitle>
        <CardDescription className="text-xs">Filtrele, bolumleri sec ve PDF veya Excel formatinda indir</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Filtreler */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" />Tarih Araligi</Label>
            <Select value={config.dateRange} onValueChange={v => setConfig(c => ({ ...c, dateRange: v }))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bugun">Bugün</SelectItem>
                <SelectItem value="bu-hafta">Bu Hafta</SelectItem>
                <SelectItem value="bu-ay">Bu Ay</SelectItem>
                <SelectItem value="gecen-ay">Gecen Ay</SelectItem>
                <SelectItem value="q1">Q1 2026</SelectItem>
                <SelectItem value="yil">Yilin Tamami</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1"><Filter className="h-3 w-3" />Kategori</Label>
            <Select value={config.category} onValueChange={v => setConfig(c => ({ ...c, category: v }))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["hepsi","Ev Dekoru","El Sanatlari","Takilar","Giyim","Hediyelik"].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Satici</Label>
            <Select value={config.seller} onValueChange={v => setConfig(c => ({ ...c, seller: v }))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["hepsi","Anatolia Craft","Cini Ustasi","Ipliklerin Dili","Oguz Ahsap","Tac Taki"].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Format</Label>
            <div className="flex gap-2 h-8 items-center">
              {(["pdf", "excel"] as const).map(f => (
                <button key={f} onClick={() => setConfig(c => ({ ...c, format: f }))}
                  className={`flex-1 flex items-center justify-center gap-1 h-8 rounded-lg border text-xs font-medium transition-colors ${config.format === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                  {f === "pdf" ? <FileText className="h-3.5 w-3.5" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bolum secimi */}
        <div>
          <Label className="text-xs mb-2 block">Rapor Bolumleri ({config.sections.length} secili)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SECTIONS.map(s => (
              <label key={s.id} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors text-xs font-medium
                ${config.sections.includes(s.id) ? "border-primary/40 bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}>
                <Checkbox
                  checked={config.sections.includes(s.id)}
                  onCheckedChange={() => toggleSection(s.id)}
                  className="h-3.5 w-3.5"
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>

        {/* Generate butonu */}
        <Button
          className="w-full gap-2"
          onClick={generate}
          disabled={generating || config.sections.length === 0}
        >
          {done ? (
            <><CheckCircle2 className="h-4 w-4" />Rapor Hazir — Indir</>
          ) : generating ? (
            <><span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />Rapor Hazirlaniyor...</>
          ) : (
            <><Download className="h-4 w-4" />Raporu Olustur ve Indir</>
          )}
        </Button>

        {/* Gecmis raporlar */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Onceki Raporlar</p>
          <div className="space-y-1.5">
            {PAST_REPORTS.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  {r.format === "pdf"
                    ? <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                    : <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date} · {r.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
