"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Bell, Send, Users, ShoppingBag, Tag, Megaphone,
  Clock, CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";

const SEGMENTS = [
  { id: "all",       label: "Tüm Kullanıcılar",    icon: Users,       count: "12.847" },
  { id: "buyers",    label: "Alıcılar",             icon: ShoppingBag, count: "8.234"  },
  { id: "sellers",   label: "Satıcılar",            icon: Tag,         count: "1.423"  },
  { id: "inactive",  label: "Pasif Kullanıcılar",   icon: Clock,       count: "3.190"  },
];

const SENT_CAMPAIGNS = [
  { id: 1, title: "Yeni Yıl Kampanyası", segment: "Tüm Kullanıcılar", date: "1 Oca 2025", reach: "12.847", opens: "43%" },
  { id: 2, title: "Satıcı Onboarding Hatırlatması", segment: "Satıcılar", date: "15 Ara 2024", reach: "1.423", opens: "61%" },
  { id: 3, title: "Sepet Terk Hatırlatması", segment: "Alıcılar", date: "10 Ara 2024", reach: "3.891", opens: "29%" },
];

export function AdminCampaign() {
  const [title, setTitle]       = useState("");
  const [body, setBody]         = useState("");
  const [segment, setSegment]   = useState("all");
  const [sending, setSending]   = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const selected = SEGMENTS.find(s => s.id === segment);

  const handleSend = () => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Başlık ve içerik zorunludur", variant: "destructive" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setTitle("");
      setBody("");
      toast({
        title: "Bildirim Gönderildi",
        description: `${selected?.count} kullanıcıya bildirim iletildi.`,
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            Toplu Bildirim Kampanyası
          </CardTitle>
          <CardDescription className="text-xs">
            Seçtiğiniz kullanıcı segmentine anlık bildirim ve duyuru gönderin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Segment seçimi */}
          <div>
            <Label className="text-xs mb-2 block">Hedef Segment</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEGMENTS.map((seg) => {
                const Icon = seg.icon;
                return (
                  <button
                    key={seg.id}
                    onClick={() => setSegment(seg.id)}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                      segment === seg.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full">
                      <Icon className={`h-3.5 w-3.5 ${segment === seg.id ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs font-semibold truncate">{seg.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${segment === seg.id ? "text-primary" : "text-muted-foreground"}`}>
                      {seg.count} kişi
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bildirim içeriği */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-1.5 block">Bildirim Başlığı</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Büyük Kampanya Başladı!"
                maxLength={60}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">{title.length}/60</p>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">İçerik Mesajı</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tüm ürünlerde %10 Pi indirimi sizi bekliyor..."
                rows={3}
                maxLength={160}
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">{body.length}/160</p>
            </div>
          </div>

          {/* Önizleme */}
          {(title || body) && (
            <div className="bg-muted/50 rounded-xl p-3 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide mb-2 flex items-center gap-1.5">
                <Bell className="h-3 w-3" /> Önizleme
              </p>
              <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-primary-foreground">π</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{title || "Bildirim Başlığı"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body || "Bildirim içeriği..."}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleSend} disabled={sending} className="w-full" size="sm">
            {sending ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Gönderiliyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-3.5 w-3.5" />
                {selected?.count} Kişiye Gönder
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Kampanya geçmişi */}
      <Card>
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowHistory(v => !v)}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Gönderim Geçmişi
              <Badge variant="secondary" className="text-xs">{SENT_CAMPAIGNS.length}</Badge>
            </CardTitle>
            {showHistory ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </CardHeader>
        {showHistory && (
          <CardContent className="pt-0 space-y-2">
            {SENT_CAMPAIGNS.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.segment} · {c.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold">{c.reach} ulaşım</p>
                  <p className="text-xs text-green-600">{c.opens} açılma</p>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
