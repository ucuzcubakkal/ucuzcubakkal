"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Building2, MapPin, Phone, MessageCircle, Mail,
  Clock, Send, ChevronRight, Loader2,
} from "lucide-react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const CONTACT_ITEMS = [
  {
    icon: Building2,
    label: "Şirket Ünvanı",
    value: "Seyirevi Reklam ve Bilişim San. Tic. Ltd. Şti.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Konak Mah. Lefkoşe Cad. Barış Sok. No: 3 Kat:1 Nilüfer / Bursa",
    color: "bg-amber-100 dark:bg-amber-950/40 text-amber-600",
    href: "https://maps.google.com/?q=Nilüfer+Bursa",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "0543 202 78 08",
    color: "bg-green-100 dark:bg-green-950/40 text-green-600",
    href: "tel:+905432027808",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "0543 202 78 08",
    color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600",
    href: "https://wa.me/905432027808",
  },
  {
    icon: Mail,
    label: "E-posta",
    value: "iletisim@ucuzcubakkal.com",
    color: "bg-blue-100 dark:bg-blue-950/40 text-blue-600",
    href: "mailto:iletisim@ucuzcubakkal.com",
  },
  {
    icon: Clock,
    label: "Çalışma Saatleri",
    value: "Pazartesi – Cuma: 09:00 – 18:00",
    color: "bg-violet-100 dark:bg-violet-950/40 text-violet-600",
  },
];

const SUBJECTS = [
  "Genel Bilgi",
  "Satıcı Başvurusu",
  "Sipariş / İade",
  "Teknik Destek",
  "Reklam & İş Birliği",
  "Diğer",
];

export default function IletisimPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Eksik alan", description: "Ad, e-posta ve mesaj zorunludur.", variant: "destructive" });
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast({ title: "Mesajınız gönderildi!", description: "En kısa sürede size dönüş yapacağız.", duration: 4000 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="İletişim" />

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <ChevronRight className="h-3 w-3" />
          <span>İletişim</span>
        </nav>

        {/* Başlık */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Bize Ulaşın</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sorularınız, önerileriniz veya iş birliği teklifleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz.
          </p>
        </div>

        {/* İletişim kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTACT_ITEMS.map((item) => {
            const Icon = item.icon;
            const content = (
              <Card className={`overflow-hidden border-border transition-shadow hover:shadow-md ${item.href ? "cursor-pointer" : ""}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-foreground leading-snug">{item.value}</p>
                    {item.href && (
                      <span className="text-xs text-primary mt-0.5 inline-block">Tıklayın →</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );

            return item.href ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>

        {/* Hızlı iletişim butonları */}
        <div className="flex gap-3">
          <a
            href="tel:+905432027808"
            className="flex-1"
          >
            <Button variant="outline" className="w-full gap-2">
              <Phone className="h-4 w-4 text-green-600" />
              Hemen Ara
            </Button>
          </a>
          <a
            href="https://wa.me/905432027808"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </div>

        {/* İletişim formu */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-bold text-base mb-4">Mesaj Gönderin</h2>

            {sent ? (
              <div className="py-10 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
                  <Send className="h-7 w-7 text-green-600" />
                </div>
                <p className="font-semibold">Mesajınız iletildi!</p>
                <p className="text-sm text-muted-foreground">En kısa sürede size dönüş yapacağız.</p>
                <Button variant="outline" size="sm" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                  Yeni Mesaj Gönder
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Adınız Soyadınız *</Label>
                    <Input
                      id="name"
                      placeholder="Ahmet Yılmaz"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-posta Adresiniz *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ahmet@ornek.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Konu</Label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => (
                      <Badge
                        key={s}
                        variant={form.subject === s ? "default" : "outline"}
                        className="cursor-pointer select-none text-xs py-1 px-3"
                        onClick={() => handleChange("subject", s)}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Mesajınız *</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Mesajınızı buraya yazın..."
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground text-right">{form.message.length}/1000</p>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={sending}>
                  {sending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Gönderiliyor...</>
                  ) : (
                    <><Send className="h-4 w-4" />Mesajı Gönder</>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Harita placeholder */}
        <Card className="overflow-hidden">
          <div className="bg-muted h-48 flex items-center justify-center relative">
            <a
              href="https://maps.google.com/?q=Konak+Mah+Lefkoşe+Cad+Barış+Sok+No+3+Nilüfer+Bursa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <MapPin className="h-10 w-10" />
              <span className="text-sm font-medium">Google Maps'te Görüntüle</span>
              <span className="text-xs">Konak Mah. Lefkoşe Cad. Barış Sok. No: 3 Kat:1 Nilüfer / Bursa</span>
            </a>
          </div>
        </Card>

      </main>
    </div>
  );
}
