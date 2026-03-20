"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle,
  Tag, Percent, Copy, CheckCheck, Trash2, Plus, RefreshCw,
  Video, Play, X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ─── CSV Toplu Ürün İçe Aktarma ──────────────────────────────────── */
export function CsvImportTool() {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ name: string; price: string; stock: string; status: "ok" | "warn" }[]>([]);
  const [imported, setImported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const SAMPLE_CSV = `isim,fiyat_pi,stok,kategori,aciklama\nEl Dokuma Kilim,125,10,Ev Dekorasyonu,Pamuktan el yapımı\nSeramik Vazo,89,5,Ev Dekorasyonu,Benzersiz tasarım`;

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = (e.target?.result as string).split("\n").slice(1).filter(Boolean).slice(0, 5);
      setPreview(lines.map((l) => {
        const cols = l.split(",");
        return {
          name: cols[0] || "—",
          price: cols[1] ? `${cols[1]}π` : "?",
          stock: cols[2] || "0",
          status: (!cols[1] || isNaN(Number(cols[1]))) ? "warn" : "ok",
        };
      }));
    };
    reader.readAsText(f);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ucb_urun_sablonu.csv"; a.click();
  };

  const handleImport = () => {
    if (!file) return;
    setImported(true);
    toast({ title: `${preview.length} ürün içe aktarıldı`, description: "Ürünler listenize eklendi." });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-primary" />Toplu Ürün İçe Aktarma (CSV)</CardTitle>
        <CardDescription className="text-xs">Excel veya CSV dosyası yükleyerek onlarca ürünü tek seferde ekleyin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <button onClick={downloadSample} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
          <Download className="h-3.5 w-3.5" /> Şablon CSV'yi İndir
        </button>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}
          className={cn("border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">{file ? file.name : "CSV dosyasını sürükleyin veya tıklayın"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Maks. 5MB — UTF-8 kodlaması</p>
          <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {preview.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">ÖN İZLEME ({preview.length} ürün)</p>
            <div className="rounded-xl border overflow-hidden">
              <div className="grid grid-cols-4 bg-muted/60 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b">
                <span>İsim</span><span>Fiyat</span><span>Stok</span><span>Durum</span>
              </div>
              {preview.map((row, i) => (
                <div key={i} className={cn("grid grid-cols-4 px-3 py-2 text-xs items-center", i % 2 === 0 ? "" : "bg-muted/20")}>
                  <span className="truncate">{row.name}</span>
                  <span className="font-mono">{row.price}</span>
                  <span>{row.stock}</span>
                  <span>{row.status === "ok"
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    : <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />}
                  </span>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full gap-2" onClick={handleImport} disabled={imported}>
              {imported ? <><CheckCircle2 className="h-4 w-4" /> İçe Aktarıldı</> : <><Upload className="h-4 w-4" /> {preview.length} Ürünü Aktar</>}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Toplu Fiyat Güncelleme ──────────────────────────────────────── */
export function BulkPriceTool() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [category, setCategory] = useState("all");
  const [done, setDone] = useState(false);

  const apply = () => {
    if (!value || isNaN(Number(value))) { toast({ title: "Geçerli bir değer girin", variant: "destructive" }); return; }
    setDone(true);
    toast({ title: "Fiyatlar güncellendi", description: `${category === "all" ? "Tüm ürünler" : category}: %${value} ${direction === "down" ? "indirim" : "artış"} uygulandı.` });
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2"><Percent className="h-4 w-4 text-primary" />Toplu Fiyat Güncelleme</CardTitle>
        <CardDescription className="text-xs">Seçili kategorideki tüm ürünlerin fiyatını tek seferde güncelleyin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Ürünlerim</SelectItem>
                <SelectItem value="Ev Dekorasyonu">Ev Dekorasyonu</SelectItem>
                <SelectItem value="Giyim">Giyim</SelectItem>
                <SelectItem value="Takı">Takı</SelectItem>
                <SelectItem value="Tekstil">Tekstil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Güncelleme Türü</Label>
            <div className="flex rounded-lg border overflow-hidden">
              {(["percent", "fixed"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={cn("flex-1 py-2 text-xs font-medium transition-colors",
                    mode === m ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                  )}>
                  {m === "percent" ? "Yüzde %" : "Sabit π"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs">Değer</Label>
            <Input type="number" placeholder={mode === "percent" ? "10" : "50"} value={value}
              onChange={(e) => setValue(e.target.value)} className="text-sm h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Yön</Label>
            <div className="flex rounded-lg border overflow-hidden h-9">
              {(["down", "up"] as const).map((d) => (
                <button key={d} onClick={() => setDirection(d)}
                  className={cn("px-3 text-xs font-medium transition-colors",
                    direction === d ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                  )}>
                  {d === "down" ? "İndir" : "Artır"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button className="w-full gap-2" onClick={apply} disabled={done}>
          {done ? <><CheckCircle2 className="h-4 w-4" /> Uygulandı</> : <><RefreshCw className="h-4 w-4" /> Fiyatları Güncelle</>}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Kupon Kodu Üretici ──────────────────────────────────────────── */
export function CouponGenerator() {
  const { toast } = useToast();
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [expiry, setExpiry] = useState("");
  const [usageLimit, setUsageLimit] = useState("50");
  const [coupons, setCoupons] = useState<{ code: string; type: string; value: string; expiry: string; uses: number; limit: number }[]>([
    { code: "BAHAR25", type: "percent", value: "25", expiry: "30 Mart 2026", uses: 12, limit: 50 },
    { code: "UCB50PI", type: "fixed",   value: "50", expiry: "15 Nisan 2026", uses: 3, limit: 20 },
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const generate = () => {
    if (!discountValue || isNaN(Number(discountValue))) { toast({ title: "Geçerli bir indirim değeri girin", variant: "destructive" }); return; }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const newCoupon = { code, type: discountType, value: discountValue, expiry: expiry || "Süresiz", uses: 0, limit: parseInt(usageLimit) || 50 };
    setCoupons((prev) => [newCoupon, ...prev]);
    toast({ title: "Kupon oluşturuldu", description: code });
    setDiscountValue(""); setExpiry("");
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2"><Tag className="h-4 w-4 text-primary" />Kupon Kodu Üretici</CardTitle>
        <CardDescription className="text-xs">Ürünleriniz için indirim kuponu oluşturun ve paylaşın.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">İndirim Türü</Label>
            <div className="flex rounded-lg border overflow-hidden">
              {(["percent", "fixed"] as const).map((t) => (
                <button key={t} onClick={() => setDiscountType(t)}
                  className={cn("flex-1 py-2 text-xs font-medium transition-colors",
                    discountType === t ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                  )}>
                  {t === "percent" ? "%" : "π"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">İndirim Değeri</Label>
            <Input type="number" placeholder={discountType === "percent" ? "20" : "10"} value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)} className="text-sm h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Son Kullanım Tarihi</Label>
            <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="text-sm h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Kullanım Limiti</Label>
            <Input type="number" placeholder="50" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className="text-sm h-9" />
          </div>
        </div>
        <Button size="sm" className="w-full gap-2" onClick={generate}>
          <Plus className="h-4 w-4" /> Kupon Oluştur
        </Button>

        <Separator />

        {/* Liste */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">AKTİF KUPONLAR ({coupons.length})</p>
          {coupons.map((c) => (
            <div key={c.code} className="flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2.5 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-sm font-bold truncate">{c.code}</span>
                <Badge variant="outline" className="text-[10px] flex-shrink-0">
                  {c.type === "percent" ? `%${c.value}` : `${c.value}π`}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{c.uses}/{c.limit}</span>
                <button onClick={() => copy(c.code)} className="text-muted-foreground hover:text-primary transition-colors">
                  {copiedCode === c.code ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <button onClick={() => setCoupons((prev) => prev.filter((x) => x.code !== c.code))}
                  className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Satıcı Vitrin Videosu ───────────────────────────────────────── */
export function StoreFrontVideo() {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!videoUrl.trim()) { toast({ title: "Video URL girin", variant: "destructive" }); return; }
    setSaved(true);
    toast({ title: "Vitrin videosu kaydedildi" });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2"><Video className="h-4 w-4 text-primary" />Vitrin Videosu</CardTitle>
        <CardDescription className="text-xs">Mağazanızın kapak alanına 30-60 saniye tanıtım videosu ekleyin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
          {videoUrl ? (
            <div className="text-center space-y-1">
              <Play className="h-10 w-10 text-primary mx-auto" />
              <p className="text-xs font-medium text-muted-foreground">{videoUrl.length > 40 ? videoUrl.slice(0, 40) + "..." : videoUrl}</p>
              <button onClick={() => { setVideoUrl(""); setSaved(false); }} className="text-xs text-destructive hover:underline flex items-center gap-1 mx-auto">
                <X className="h-3 w-3" /> Kaldır
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Video className="h-10 w-10 text-muted-foreground mx-auto mb-1" />
              <p className="text-sm font-medium text-muted-foreground">Video URL girin</p>
              <p className="text-xs text-muted-foreground">YouTube, Vimeo veya doğrudan .mp4 linki</p>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Video URL</Label>
          <Input placeholder="https://youtube.com/watch?v=..." value={videoUrl}
            onChange={(e) => { setVideoUrl(e.target.value); setSaved(false); }} className="text-sm" />
        </div>
        <Button size="sm" className="w-full gap-2" onClick={save} disabled={saved}>
          {saved ? <><CheckCircle2 className="h-4 w-4" /> Kaydedildi</> : "Videoyu Kaydet"}
        </Button>
      </CardContent>
    </Card>
  );
}
