"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck, Star, Package, TrendingDown, Calendar,
  Clock, CheckCircle2, AlertTriangle, Users, MessageCircle,
  BellOff, BellRing,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/* ─── Seffaflik Karti ──────────────────────────────────────────────────── */
interface SellerTransparencyProps {
  name: string;
  memberSince: string;
  totalSales: number;
  returnRate: number; // yüzde
  responseTime: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

export function SellerTransparencyCard({
  name, memberSince, totalSales, returnRate,
  responseTime, rating, reviewCount, verified,
}: SellerTransparencyProps) {
  const stats = [
    { icon: Package,      label: "Toplam Satış",   value: `${totalSales.toLocaleString()}+`,          color: "text-blue-500"   },
    { icon: Star,         label: "Ortalama Puan",  value: `${rating} / 5`,                            color: "text-yellow-500" },
    { icon: MessageCircle,label: "Yanıt Süresi",   value: responseTime,                               color: "text-green-500"  },
    { icon: TrendingDown, label: "Iade Oranı",     value: `%${returnRate}`,                           color: returnRate < 3 ? "text-green-500" : "text-orange-500" },
    { icon: Calendar,     label: "Üye Since",      value: memberSince,                                color: "text-purple-500" },
    { icon: Users,        label: "Degerlendirme",  value: `${reviewCount} yorum`,                     color: "text-primary"    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Satıcı Seffaflık Kartı
          {verified && (
            <Badge className="ml-auto text-[10px] h-5 bg-green-100 text-green-700 border-0 gap-1">
              <CheckCircle2 className="h-2.5 w-2.5" /> Dogrulandi
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="text-xs text-muted-foreground mb-3">
          Bu bilgiler platform tarafından doğrulanmış ve kamuya açıktır.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-muted/40 p-2.5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <s.icon className={cn("h-3.5 w-3.5", s.color)} />
                <span className="text-[10px] text-muted-foreground font-medium">{s.label}</span>
              </div>
              <span className="text-sm font-bold">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/5 p-2.5 border border-primary/10">
          <AlertTriangle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Iade oranı, son 6 aydaki confirmed siparislere göre hesaplanır. Tüm satislar platform tarafından onaylanmistır.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Tatil Modu ────────────────────────────────────────────────────────── */
export function HolidayModeCard() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("Mağazam geçici olarak kapalıdır. Belirtilen tarihte geri döneceğim.");

  const handleToggle = (val: boolean) => {
    setEnabled(val);
    toast({
      title: val ? "Tatil Modu Aktif" : "Tatil Modu Kapatıldı",
      description: val
        ? "Mağazanız ziyaretçilere kapalı görünüyor."
        : "Mağazanız tekrar açık.",
    });
  };

  return (
    <Card className={cn("border-2 transition-colors", enabled ? "border-orange-300 dark:border-orange-800" : "border-border")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {enabled ? (
              <BellOff className="h-4 w-4 text-orange-500" />
            ) : (
              <BellRing className="h-4 w-4 text-muted-foreground" />
            )}
            Tatil Modu
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-3 pt-0">
          <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-2.5">
            <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">Mağazanız simdi kapalı görünüyor</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Geri Donus Tarihi</Label>
            <Input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Ziyaretçilere Mesaj</Label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-8 text-sm"
              placeholder="Kısa bir mesaj yazın..."
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 text-xs"
            onClick={() => toast({ title: "Tatil modu güncellendi" })}
          >
            Kaydet
          </Button>
        </CardContent>
      )}
      {!enabled && (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            Tatil veya izin dönemlerinde mağazanızı geçici kapatabilirsiniz. Ziyaretçiler geri dönüs tarihinizi görür.
          </p>
        </CardContent>
      )}
    </Card>
  );
}

/* ─── Stok Uyarısı Ayarları ─────────────────────────────────────────────── */
export function StockAlertSettings() {
  const { toast } = useToast();
  const [threshold, setThreshold] = useState("3");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush,  setNotifyPush]  = useState(true);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Stok Uyarı Ayarları
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Bir ürünün stoğu belirlediğiniz eşiğin altına düştüğünde bildirim alırsınız.
        </p>
        <div className="space-y-1.5">
          <Label className="text-xs">Eşik Stok Adedi</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="99"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="h-8 w-24 text-sm"
            />
            <span className="text-xs text-muted-foreground">adede düştüğünde uyar</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">E-posta Bildirimi</Label>
            <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Push Bildirimi</Label>
            <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
          </div>
        </div>
        <Button
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => toast({ title: "Stok uyarı ayarları kaydedildi" })}
        >
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
}
