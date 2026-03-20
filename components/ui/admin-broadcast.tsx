"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Bell, Mail, MessageSquare, Users, Store, Star, Eye, CheckCircle2, Clock, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string; title: string; message: string; channel: string; target: string; sentAt: string; reach: number; opened: number; status: "gonderildi" | "taslak" | "planli";
}

const INIT_CAMPAIGNS: Campaign[] = [
  { id: "C001", title: "Bahar Kampanyası", message: "Bahara özel %15 indirim sizi bekliyor!", channel: "push", target: "Tüm Üyeler", sentAt: "2026-03-08 10:00", reach: 1248, opened: 612, status: "gonderildi" },
  { id: "C002", title: "VIP Üye Özel Teklif", message: "Değerli VIP üyemiz, size özel fırsat!", channel: "email", target: "VIP Üyeler", sentAt: "2026-03-07 14:30", reach: 3, opened: 3, status: "gonderildi" },
  { id: "C003", title: "Yeni Satıcı Duyurusu", message: "Platforma yeni satıcılar katıldı!", channel: "push", target: "Tüm Üyeler", sentAt: "—", reach: 0, opened: 0, status: "taslak" },
];

const CHANNELS = [
  { value: "push",    label: "Push Bildirimi",  icon: <Bell className="h-4 w-4 text-blue-500" /> },
  { value: "email",   label: "E-posta",         icon: <Mail className="h-4 w-4 text-purple-500" /> },
  { value: "sms",     label: "SMS",             icon: <MessageSquare className="h-4 w-4 text-green-500" /> },
];

const TARGETS = [
  { value: "all",     label: "Tüm Üyeler",      icon: <Users className="h-4 w-4" /> },
  { value: "vip",     label: "VIP Üyeler",       icon: <Star className="h-4 w-4 text-yellow-500" /> },
  { value: "passive", label: "Pasif Üyeler",     icon: <Clock className="h-4 w-4 text-gray-500" /> },
  { value: "sellers", label: "Satıcılar",        icon: <Store className="h-4 w-4 text-orange-500" /> },
];

const statusColor: Record<string, string> = {
  gonderildi: "bg-green-100 text-green-700",
  taslak:     "bg-gray-100 text-gray-600",
  planli:     "bg-blue-100 text-blue-700",
};
const statusLabel: Record<string, string> = { gonderildi: "Gönderildi", taslak: "Taslak", planli: "Planlı" };

export function AdminBroadcast({ memberCount, sellerCount }: { memberCount: number; sellerCount: number }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INIT_CAMPAIGNS);
  const [form, setForm] = useState({ title: "", message: "", channel: "push", target: "all", scheduleDate: "", scheduleTime: "" });
  const [preview, setPreview] = useState(false);
  const { toast } = useToast();

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const estimatedReach = form.target === "all" ? memberCount : form.target === "vip" ? 3 : form.target === "passive" ? 2 : sellerCount;

  const handleSend = (draft = false) => {
    if (!form.title || !form.message) { toast({ title: "Başlık ve mesaj zorunludur", variant: "destructive" }); return; }
    const newC: Campaign = {
      id: `C${Date.now()}`, title: form.title, message: form.message, channel: form.channel,
      target: TARGETS.find(t => t.value === form.target)?.label || "—",
      sentAt: draft ? "—" : new Date().toLocaleString("tr-TR"),
      reach: draft ? 0 : estimatedReach, opened: 0,
      status: draft ? "taslak" : "gonderildi",
    };
    setCampaigns(p => [newC, ...p]);
    setForm({ title: "", message: "", channel: "push", target: "all", scheduleDate: "", scheduleTime: "" });
    toast({ title: draft ? "Taslak kaydedildi" : `Bildirim ${estimatedReach} kişiye gönderildi` });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Composer */}
        <Card className="border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><Megaphone className="h-4 w-4 text-primary" />Yeni Duyuru Oluştur</CardTitle>
            <CardDescription className="text-xs">Seçili segmente anlık bildirim veya e-posta gönderin</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Başlık</Label>
              <Input className="h-9 text-sm" placeholder="Duyuru başlığı..." value={form.title} onChange={e => update("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mesaj</Label>
              <Textarea placeholder="Mesaj içeriğini yazın..." rows={4} className="resize-none text-sm" value={form.message} onChange={e => update("message", e.target.value)} />
              <p className="text-xs text-muted-foreground text-right">{form.message.length}/160</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Kanal</Label>
                <Select value={form.channel} onValueChange={v => update("channel", v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{CHANNELS.map(c => <SelectItem key={c.value} value={c.value} className="text-xs"><div className="flex items-center gap-2">{c.icon}{c.label}</div></SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hedef Kitle</Label>
                <Select value={form.target} onValueChange={v => update("target", v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{TARGETS.map(t => <SelectItem key={t.value} value={t.value} className="text-xs"><div className="flex items-center gap-2">{t.icon}{t.label}</div></SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
              <div className="text-xs"><span className="text-muted-foreground">Tahmini erişim: </span><span className="font-bold text-primary">{estimatedReach.toLocaleString()} kişi</span></div>
              <button onClick={() => setPreview(!preview)} className="text-xs text-primary hover:underline flex items-center gap-1"><Eye className="h-3 w-3" />Önizleme</button>
            </div>
            {preview && form.message && (
              <div className={`rounded-xl p-4 border ${form.channel === "push" ? "bg-gray-900 text-white border-gray-700" : "bg-white border-gray-200 shadow"}`}>
                <p className="text-xs font-bold mb-1">{form.channel === "email" ? "Konu: " : ""}{form.title || "Başlık"}</p>
                <p className="text-xs opacity-80">{form.message}</p>
                {form.channel === "push" && <p className="text-xs opacity-50 mt-2">ucuzcubakkal.com • Şimdi</p>}
              </div>
            )}
            <div className="flex gap-2">
              <Button className="flex-1 h-9 text-xs" onClick={() => handleSend(false)} disabled={!form.title || !form.message}>
                <Send className="h-3.5 w-3.5 mr-1.5" />Gönder
              </Button>
              <Button variant="outline" className="h-9 text-xs" onClick={() => handleSend(true)} disabled={!form.title || !form.message}>Taslak</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Toplam Gönderim",  value: campaigns.filter(c => c.status === "gonderildi").length, icon: <Send className="h-5 w-5 text-blue-500" />,   color: "text-blue-600"  },
              { label: "Toplam Erişim",    value: campaigns.reduce((s, c) => s + c.reach, 0).toLocaleString(), icon: <Users className="h-5 w-5 text-purple-500" />, color: "text-purple-600" },
              { label: "Açılma Oranı",     value: `%${campaigns.filter(c=>c.reach>0).length>0?Math.round(campaigns.reduce((s,c)=>s+c.opened,0)/Math.max(campaigns.reduce((s,c)=>s+c.reach,0),1)*100):0}`, icon: <Eye className="h-5 w-5 text-green-500" />,   color: "text-green-600"  },
              { label: "Planlı Kampanya",  value: campaigns.filter(c => c.status === "planli").length, icon: <Clock className="h-5 w-5 text-amber-500" />,  color: "text-amber-600"  },
            ].map(s => (
              <Card key={s.label} className="border border-border shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">{s.icon}</div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign history */}
      <Card className="border border-border shadow-none">
        <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">Kampanya Geçmişi</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>{["Başlık", "Kanal", "Hedef", "Erişim", "Açılma", "Oran", "Tarih", "Durum"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map(c => {
                const rate = c.reach > 0 ? Math.round((c.opened / c.reach) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold">{c.title}</td>
                    <td className="px-4 py-3 text-xs">{CHANNELS.find(ch => ch.value === c.channel)?.label || c.channel}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.target}</td>
                    <td className="px-4 py-3 text-xs font-medium">{c.reach.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">{c.opened.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${rate}%` }} /></div>
                        <span className="text-xs font-medium">%{rate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.sentAt}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{statusLabel[c.status]}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
