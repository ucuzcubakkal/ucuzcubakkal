"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ShieldAlert, Clock, CheckCircle2, AlertTriangle, MessageSquare,
  Upload, ChevronRight, Scale, FileText, HeartHandshake,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DISPUTE_REASONS = [
  "Ürün teslim edilmedi",
  "Ürün açıklamayla uyuşmuyor",
  "Ürün hasarlı veya bozuk geldi",
  "Yanlış ürün gönderildi",
  "Satıcı iletişime geçmiyor",
  "Diğer",
];

const MOCK_DISPUTES = [
  { id: "DSP-001", order: "UCB-2026-3102", issue: "Ürün hasarlı geldi", status: "incelemede", date: "10 Mart 2026", amount: 89 },
  { id: "DSP-002", order: "UCB-2026-2741", issue: "Ürün teslim edilmedi", status: "cozuldu", date: "2 Mart 2026", amount: 125 },
];

const STATUS_CONFIG = {
  acildi:     { label: "Açıldı",       color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  incelemede: { label: "İncelemede",   color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  cevap_bekleniyor: { label: "Cevap Bekleniyor", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  cozuldu:    { label: "Çözüldü",      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  reddedildi: { label: "Reddedildi",   color: "bg-destructive/10 text-destructive" },
};

const PROCESS_STEPS = [
  { icon: FileText,      title: "Başvuru",      desc: "Anlaşmazlığı belgeleyerek başvurun" },
  { icon: Scale,         title: "İnceleme",     desc: "Admin ekibi 48 saat içinde inceler" },
  { icon: MessageSquare, title: "Arabuluculuk", desc: "Taraflar arasında çözüm aranır" },
  { icon: HeartHandshake,title: "Sonuç",        desc: "Karar bildirilir, gerekirse iade yapılır" },
];

export default function AnlasmazlikPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"yeni" | "gecmis" | "nasil">("yeni");
  const [step, setStep] = useState<"form" | "success">("form");
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [claimAmount, setClaimAmount] = useState("");

  const handleSubmit = () => {
    if (!orderId.trim() || !reason || !detail.trim()) {
      toast({ title: "Tüm zorunlu alanları doldurun", variant: "destructive" });
      return;
    }
    setStep("success");
    toast({ title: "Anlaşmazlık başvurusu alındı", description: "48 saat içinde dönüş yapılacak." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Anlaşmazlık Çözüm Merkezi</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Alıcı-satıcı uyuşmazlıklarında tarafsız moderasyon</p>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex rounded-xl bg-muted p-1 gap-1">
          {([["yeni", "Yeni Başvuru"], ["gecmis", "Geçmiş"], ["nasil", "Nasıl Çalışır?"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={cn("flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                tab === val ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}>
              {label}
            </button>
          ))}
        </div>

        {/* Yeni başvuru */}
        {tab === "yeni" && (
          step === "form" ? (
            <div className="space-y-4">
              <Card className="border-orange-200/50 bg-orange-50/50 dark:bg-orange-900/10 dark:border-orange-800/50">
                <CardContent className="pt-4 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Lütfen önce satıcıyla iletişime geçmeyi deneyin. Çözüm bulamazsanız bu formu kullanın.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Başvuru Formu</CardTitle>
                  <CardDescription className="text-xs">* zorunlu alan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Sipariş Numarası *</Label>
                    <Input placeholder="UCB-2026-XXXX" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="font-mono text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Sorun Türü *</Label>
                    <Select onValueChange={setReason}>
                      <SelectTrigger className="text-sm h-9"><SelectValue placeholder="Seçin..." /></SelectTrigger>
                      <SelectContent>
                        {DISPUTE_REASONS.map((r) => (
                          <SelectItem key={r} value={r} className="text-sm">{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Detaylı Açıklama *</Label>
                    <Textarea placeholder="Sorunu ayrıntılı anlatın..." value={detail}
                      onChange={(e) => setDetail(e.target.value)} rows={4} className="text-sm resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Talep Ettiğiniz Çözüm</Label>
                    <Select>
                      <SelectTrigger className="text-sm h-9"><SelectValue placeholder="Seçin..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iade" className="text-sm">Tam iade</SelectItem>
                        <SelectItem value="degisim" className="text-sm">Ürün değişimi</SelectItem>
                        <SelectItem value="kismi" className="text-sm">Kısmi iade</SelectItem>
                        <SelectItem value="diger" className="text-sm">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Talep Tutarı (π) — isteğe bağlı</Label>
                    <Input type="number" placeholder="0" value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)} className="text-sm" />
                  </div>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Kanıt yükle (fotoğraf, ekran görüntüsü)</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Maks. 5 dosya, 10MB</p>
                  </div>
                  <Button className="w-full gap-2" onClick={handleSubmit}>
                    <ShieldAlert className="h-4 w-4" />
                    Başvuruyu Gönder
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800/50">
              <CardContent className="pt-6 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                <div>
                  <p className="font-bold text-lg">Başvurunuz Alındı</p>
                  <p className="text-sm text-muted-foreground mt-1">Referans No: <span className="font-mono font-bold">DSP-{Math.floor(Math.random() * 900) + 100}</span></p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 text-left bg-background rounded-xl p-4 border">
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary flex-shrink-0" /><span>48 saat içinde incelemeye alınacak</span></div>
                  <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary flex-shrink-0" /><span>Bildirim ve mesajları takip edin</span></div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => { setStep("form"); setOrderId(""); setReason(""); setDetail(""); setClaimAmount(""); }}>
                  Yeni Başvuru
                </Button>
              </CardContent>
            </Card>
          )
        )}

        {/* Geçmiş */}
        {tab === "gecmis" && (
          <div className="space-y-3">
            {MOCK_DISPUTES.map((d) => (
              <Card key={d.id} className="cursor-pointer hover:border-primary/30 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-mono">{d.id} · {d.order}</p>
                      <p className="font-medium text-sm mt-0.5">{d.issue}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{d.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge className={cn("text-xs border-0", STATUS_CONFIG[d.status as keyof typeof STATUS_CONFIG].color)}>
                        {STATUS_CONFIG[d.status as keyof typeof STATUS_CONFIG].label}
                      </Badge>
                      <span className="text-sm font-bold text-primary">{d.amount}π</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Nasıl çalışır */}
        {tab === "nasil" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROCESS_STEPS.map((s, i) => (
                <Card key={s.title}>
                  <CardContent className="pt-4 flex gap-3 items-start">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-primary">{i + 1}.</span>
                        <p className="font-semibold text-sm">{s.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-dashed">
              <CardContent className="pt-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Önemli Notlar</p>
                {["Başvurudan 48 saat içinde dönüş yapılır.", "Escrow sistemi sayesinde ödeme teslimata kadar güvende tutulur.", "Karara itiraz hakkı 7 gün içinde kullanılabilir."].map((note) => (
                  <div key={note} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    {note}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
