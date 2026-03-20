"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, MessageSquarePlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForumGorusPanelProps {
  from: "musteri" | "satici";
  userName?: string;
  userId?: string;
}

export function ForumGorusPanel({ from, userName = "", userId = "" }: ForumGorusPanelProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<string>("oneri");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Lütfen konu ve mesaj alanlarını doldurun.", variant: "destructive", duration: 3000 });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/forum-gorusu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, userName, userId, subject, message, category }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        throw new Error("Gönderim hatası");
      }
    } catch {
      toast({ title: "Bir hata oluştu, lütfen tekrar deneyin.", variant: "destructive", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setSubject("");
    setMessage("");
    setCategory("oneri");
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-base">Görüşünüz iletildi!</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Geri bildiriminiz yönetim ekibimize ulaştı. Teşekkür ederiz.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Yeni Görüş Gönder
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MessageSquarePlus className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">Görüş ve Önerileriniz</p>
          <p className="text-xs text-muted-foreground">Yorumunuz yönetim ekibimize iletilir.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Kategori</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="oneri">Öneri</SelectItem>
            <SelectItem value="sikayet">Şikayet</SelectItem>
            <SelectItem value="tesekkur">Teşekkür</SelectItem>
            <SelectItem value="diger">Diğer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Konu</Label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Görüşünüzün konusu"
          className="h-9 text-sm"
          maxLength={120}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Mesajınız</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Detaylı görüş veya önerinizi yazın..."
          rows={5}
          className="text-sm resize-none"
          maxLength={2000}
        />
        <p className="text-[10px] text-muted-foreground text-right">{message.length}/2000</p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !subject.trim() || !message.trim()}
        className="w-full"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Gönderiliyor...</>
        ) : (
          "Görüşü Gönder"
        )}
      </Button>
    </div>
  );
}
