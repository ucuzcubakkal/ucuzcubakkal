"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Edit, Save, Eye, CheckCircle2 } from "lucide-react";

interface EmailTemplate {
  id: string; name: string; trigger: string; subject: string; body: string; active: boolean;
}

const INIT_TEMPLATES: EmailTemplate[] = [
  {
    id: "T1", name: "Siparis Onay", trigger: "Siparis olusturuldu", active: true,
    subject: "Siparisini aldik! #{orderId}",
    body: `Merhaba {name},\n\n#{orderId} numarali siparisini basariyla aldik.\n\nUrun: {product}\nTutar: {amount} π\nTahmini Teslim: {deliveryDate}\n\nTesekkurler!\nUcuzcubakkal Ekibi`,
  },
  {
    id: "T2", name: "Kargo Bildir.", trigger: "Siparis kargoya verildi", active: true,
    subject: "Siparisini yola cikti! — #{trackingNo}",
    body: `Merhaba {name},\n\nSiparisini kargoya verdik.\n\nTakip No: #{trackingNo}\nKargo: {cargoName}\n\nSiparisini takip et: {trackingUrl}\n\nUcuzcubakkal`,
  },
  {
    id: "T3", name: "Teslim Onay", trigger: "Siparis teslim edildi", active: true,
    subject: "Siparisini teslim edildi — Deneyimini paylasir misin?",
    body: `Merhaba {name},\n\nSiparisini teslim edildi. Umarız memnun kalmissındir!\n\nDeneyimini yorumla paylas: {reviewUrl}\n\nTesekkurler!\nUcuzcubakkal`,
  },
  {
    id: "T4", name: "Iade Onay", trigger: "Iade talebi onaylandi", active: true,
    subject: "Iade talebiniz onaylandi",
    body: `Merhaba {name},\n\nIade talebiniz onaylandi.\n\nIade Tutari: {amount} π\nIsleme Suresi: 1-3 is gunu\n\nUcuzcubakkal`,
  },
  {
    id: "T5", name: "Hosgeldin", trigger: "Yeni uye kaydi", active: true,
    subject: "Ucuzcubakkal'a hosgeldin!",
    body: `Merhaba {name},\n\nToplulugumuzun bir parcasi oldugun icin cok mutluyuz!\n\nKesfetmeye basla: {siteUrl}\n\nUcuzcubakkal Ekibi`,
  },
  {
    id: "T6", name: "Sifre Sifirlama", trigger: "Sifre sifirlama istegi", active: true,
    subject: "Sifrenizi sifirlayin",
    body: `Merhaba {name},\n\nSifre sifirlama baglantiniz:\n{resetUrl}\n\nBu baglanti 1 saat gecerlidir.\n\nEger bu islemi siz yapmadıysaniz dikkate almayiniz.\n\nUcuzcubakkal`,
  },
];

export function AdminEmailTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(INIT_TEMPLATES);
  const [editing, setEditing]     = useState<string | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [draft,   setDraft]       = useState<Partial<EmailTemplate>>({});

  const startEdit = (t: EmailTemplate) => { setEditing(t.id); setDraft({ subject: t.subject, body: t.body }); };
  const save = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...draft } : t));
    setEditing(null);
    toast({ title: "Sablon kaydedildi." });
  };
  const toggle = (id: string) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />E-posta Sablon Yoneticisi
        </CardTitle>
        <CardDescription className="text-xs">Sistem e-postalarini ozellestir. {"{"}deger{"}"} seklindeki alanlar otomatik doldurulur.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map(t => (
          <div key={t.id} className="border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/20">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${t.active ? "bg-green-500" : "bg-muted-foreground"}`} />
                <p className="text-sm font-semibold truncate">{t.name}</p>
                <Badge className="text-xs bg-muted text-muted-foreground hidden sm:flex">{t.trigger}</Badge>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggle(t.id)}
                  className={`text-xs px-2 py-1 rounded-lg border font-medium transition-colors ${t.active ? "bg-green-50 border-green-200 text-green-700" : "bg-muted border-border text-muted-foreground"}`}>
                  {t.active ? "Aktif" : "Kapali"}
                </button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreview(preview === t.id ? null : t.id)}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(t.id)}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Edit form */}
            {editing === t.id && (
              <div className="p-4 space-y-3 border-t border-border bg-card">
                <div className="space-y-1">
                  <Label className="text-xs">Konu</Label>
                  <Input className="h-8 text-sm" value={draft.subject ?? ""} onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Icerik</Label>
                  <Textarea rows={6} className="text-xs resize-none font-mono" value={draft.body ?? ""} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setEditing(null)}>Iptal</Button>
                  <Button size="sm" className="text-xs h-8 gap-1" onClick={() => save(t.id)}>
                    <Save className="h-3.5 w-3.5" />Kaydet
                  </Button>
                </div>
              </div>
            )}

            {/* Preview */}
            {preview === t.id && editing !== t.id && (
              <div className="p-4 border-t border-border bg-muted/10">
                <p className="text-xs font-semibold text-muted-foreground mb-1">KONU:</p>
                <p className="text-sm mb-3 font-medium">{t.subject}</p>
                <p className="text-xs font-semibold text-muted-foreground mb-1">ICERIK:</p>
                <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed text-foreground">{t.body}</pre>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
