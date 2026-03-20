"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star, ShoppingBag, Gift, ArrowUpRight, ArrowDownRight,
  Zap, Crown, Award, TrendingUp, ChevronRight, CheckCircle2, X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const CURRENT_POINTS = 1240;
const TOTAL_EARNED = 3850;

const LEVELS = [
  {
    name: "Bronz", min: 0, max: 999, icon: Award, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30",
    perks: ["Her alışverişte 1 puan", "Doğum günü bonusu: 50 puan", "Temel indirim kuponları"],
  },
  {
    name: "Gümüş", min: 1000, max: 2999, icon: Star, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800/50",
    perks: ["Her alışverişte 1.25 puan", "Öncelikli müşteri desteği", "Aylık sürpriz kupon", "Doğum günü bonusu: 100 puan"],
  },
  {
    name: "Altın", min: 3000, max: 7999, icon: Crown, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30",
    perks: ["Her alışverişte 1.5 puan", "Ücretsiz kargo hakkı (ayda 2x)", "Erken erişim kampanyaları", "Özel satıcı indirimleri"],
  },
  {
    name: "Platin", min: 8000, max: Infinity, icon: Zap, color: "text-primary", bg: "bg-primary/10",
    perks: ["Her alışverişte 2 puan", "Sınırsız ücretsiz kargo", "Kişisel alışveriş danışmanı", "Yeni ürünlere ilk erişim", "Yıllık özel hediye"],
  },
];

const TRANSACTIONS = [
  { id: 1, desc: "El Dokuma Kilim Yastık alışverişi", date: "2 Mart 2026", points: +125, type: "kazanildi" },
  { id: 2, desc: "Referans bonusu — Zeynep Y.", date: "2 Mart 2026", points: +50, type: "kazanildi" },
  { id: 3, desc: "Sipariş ORD-001 indirimi olarak kullanıldı", date: "28 Şubat 2026", points: -200, type: "kullanildi" },
  { id: 4, desc: "Seramik Vazo alışverişi", date: "20 Şubat 2026", points: +89, type: "kazanildi" },
  { id: 5, desc: "Yorum bonusu", date: "15 Şubat 2026", points: +20, type: "kazanildi" },
  { id: 6, desc: "Kayıt bonusu", date: "1 Ocak 2026", points: +100, type: "kazanildi" },
];

const REWARDS = [
  { id: "r1", title: "200 Puan — 5π İndirim", points: 200, piValue: 5, desc: "Min. 100π siparişlerde geçerli", type: "discount" },
  { id: "r2", title: "500 Puan — 15π İndirim", points: 500, piValue: 15, desc: "Min. 200π siparişlerde geçerli", type: "discount" },
  { id: "r3", title: "1000 Puan — 35π İndirim", points: 1000, piValue: 35, desc: "Tüm siparişlerde geçerli", type: "discount" },
  { id: "r4", title: "2000 Puan — Ücretsiz Kargo", points: 2000, piValue: 0, desc: "Tek siparişe 1 kez", type: "shipping" },
];

const HOW_TO_EARN = [
  { icon: ShoppingBag, label: "Her 1π alışverişte 1 puan" },
  { icon: Star, label: "Yorum yazınca 20 puan" },
  { icon: Gift, label: "Arkadaş davetinde 50 puan" },
  { icon: TrendingUp, label: "Doğum gününde 100 puan" },
];

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, value, duration]);

  return <span ref={ref}>{count.toLocaleString("tr-TR")}</span>;
}

export default function PuanlarPage() {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [points, setPoints] = useState(CURRENT_POINTS);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [txFilter, setTxFilter] = useState<"all" | "kazanildi" | "kullanildi">("all");
  const [simAmount, setSimAmount] = useState("");

  const currentLevel = LEVELS.findLast((l) => points >= l.min) ?? LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.min > points);
  const progressToNext = nextLevel
    ? ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;
  const LevelIcon = currentLevel.icon;

  // Seviye atlanıp atlanmadığını kontrol et
  const prevLevelRef = useRef(currentLevel.name);
  useEffect(() => {
    if (prevLevelRef.current !== currentLevel.name) {
      setShowLevelUp(true);
      prevLevelRef.current = currentLevel.name;
    }
  }, [currentLevel.name]);

  const handleRedeem = (reward: typeof REWARDS[number]) => {
    if (points < reward.points) return;
    setRedeeming(reward.id);

    setTimeout(() => {
      setPoints((prev) => prev - reward.points);
      setTransactions((prev) => [
        {
          id: Date.now(),
          desc: `${reward.title} kullanıldı`,
          date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
          points: -reward.points,
          type: "kullanildi",
        },
        ...prev,
      ]);
      setRedeeming(null);
      toast({
        title: "Indirim uygulandı!",
        description: reward.type === "shipping"
          ? "Ücretsiz kargo hakkınız bir sonraki siparişe eklendi."
          : `${reward.piValue}π indirim kuponunuz sepete eklendi. Ödeme sayfasında otomatik uygulanacak.`,
        duration: 4000,
      });
    }, 1200);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack title="Bakkal Puanlarım" />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-primary/10 rounded-full p-6 mb-4">
            <Star className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-muted-foreground mb-6 max-w-xs">
            Puanlarınızı görüntülemek için giriş yapın.
          </p>
          <Link href="/giris"><Button size="lg">Giriş Yap</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Bakkal Puanlarım" />

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-5">

        {/* Seviye atlama kutlama banner'ı */}
        {showLevelUp && (
          <div className="relative flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-2xl p-4 animate-in slide-in-from-top-2">
            <div className="bg-primary/20 p-2 rounded-full flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Tebrikler! Yeni seviye: {currentLevel.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentLevel.name} üye avantajlarının keyfini çıkarın.
              </p>
            </div>
            <button
              onClick={() => setShowLevelUp(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Puan Hero Kartı */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-primary-foreground/70 text-sm mb-1">Mevcut Bakkal Puanım</p>
                <p className="text-5xl font-bold tracking-tight">
                  <AnimatedNumber value={points} />
                </p>
              </div>
              <div className={`${currentLevel.bg} ${currentLevel.color} p-3 rounded-2xl`}>
                <LevelIcon className="h-7 w-7" />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <Badge className={`${currentLevel.bg} ${currentLevel.color} border-0 font-semibold`}>
                {currentLevel.name} Üye
              </Badge>
              {nextLevel && (
                <span className="text-primary-foreground/70 text-xs">
                  {nextLevel.min - CURRENT_POINTS} puan daha → {nextLevel.name}
                </span>
              )}
            </div>
            {nextLevel && (
              <Progress value={progressToNext} className="h-2 bg-primary-foreground/20 [&>[data-state]]:bg-primary-foreground" />
            )}
          </div>
          <CardContent className="p-4 flex gap-4 text-center">
            <div className="flex-1">
              <p className="text-lg font-bold text-primary"><AnimatedNumber value={TOTAL_EARNED} /></p>
              <p className="text-xs text-muted-foreground">Toplam Kazanılan</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1">
              <p className="text-lg font-bold text-primary">{TOTAL_EARNED - points}</p>
              <p className="text-xs text-muted-foreground">Kullanılan</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1">
              <p className="text-lg font-bold text-primary">{LEVELS.indexOf(currentLevel) + 1}/{LEVELS.length}</p>
              <p className="text-xs text-muted-foreground">Seviye</p>
            </div>
          </CardContent>
        </Card>

        {/* Nasıl Puan Kazanılır */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nasıl Puan Kazanırsınız?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {HOW_TO_EARN.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 bg-secondary rounded-xl p-3">
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seviye Avantajları */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Seviye Avantajları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {LEVELS.map((level) => {
              const LIcon = level.icon;
              const isActive = currentLevel.name === level.name;
              return (
                <div key={level.name} className={`rounded-xl border-2 p-3 transition-all ${isActive ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`${level.bg} p-1.5 rounded-lg`}>
                      <LIcon className={`h-4 w-4 ${level.color}`} />
                    </div>
                    <span className={`font-semibold text-sm ${level.color}`}>{level.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {level.max === Infinity ? `${level.min.toLocaleString("tr-TR")}+ puan` : `${level.min.toLocaleString("tr-TR")}–${level.max.toLocaleString("tr-TR")} puan`}
                    </span>
                    {isActive && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Mevcut</span>}
                  </div>
                  <ul className="space-y-1">
                    {level.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Puan Simülatörü */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Puan Simülatörü</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Sepet tutarınızı girin, kaç puan kazanacağınızı görün.</p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Sepet tutarı (π)"
                value={simAmount}
                onChange={(e) => setSimAmount(e.target.value)}
                className="flex-1"
              />
            </div>
            {simAmount && parseFloat(simAmount) > 0 && (() => {
              const amount = parseFloat(simAmount);
              const multiplier = currentLevel.name === "Bronz" ? 1 : currentLevel.name === "Gümüş" ? 1.25 : currentLevel.name === "Altın" ? 1.5 : 2;
              const earned = Math.floor(amount * multiplier);
              const newTotal = points + earned;
              const nextLvl = LEVELS.find((l) => l.min > newTotal);
              return (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kazanılacak puan:</span>
                    <span className="font-bold text-primary text-lg">+{earned}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Yeni toplam:</span>
                    <span className="font-medium">{newTotal.toLocaleString("tr-TR")} puan</span>
                  </div>
                  {nextLvl && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{nextLvl.name} seviyesine:</span>
                      <span className="font-medium">{Math.max(0, nextLvl.min - newTotal).toLocaleString("tr-TR")} puan kaldı</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {currentLevel.name} çarpanı: x{multiplier} uygulandı
                  </p>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Ödüller */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Puanlarınızı Kullanın</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {REWARDS.map((reward) => {
              const canRedeem = points >= reward.points;
              const isRedeeming = redeeming === reward.id;
              return (
                <div
                  key={reward.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    canRedeem ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-60"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{reward.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{reward.desc}</p>
                    <p className="text-xs font-bold text-primary mt-1">{reward.points} puan</p>
                  </div>
                  <Button
                    size="sm"
                    className="flex-shrink-0 ml-3"
                    disabled={!canRedeem || !!redeeming}
                    variant={canRedeem ? "default" : "secondary"}
                    onClick={() => handleRedeem(reward)}
                  >
                    {isRedeeming ? "Uygulanıyor..." : "Kullan"}
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* İşlem Geçmişi */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base">İşlem Geçmişi</CardTitle>
              <div className="flex gap-1">
                {([
                  { key: "all" as const,        label: "Tümü"      },
                  { key: "kazanildi" as const,   label: "Kazanılan" },
                  { key: "kullanildi" as const,  label: "Kullanılan"},
                ]).map(({ key, label }) => (
                  <Button key={key} size="sm" variant={txFilter === key ? "default" : "ghost"}
                    className="h-6 text-xs px-2" onClick={() => setTxFilter(key)}>
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            {/* Puan süresi uyarısı */}
            <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
              <TrendingUp className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Hatırlatma:</span> 1 Ocak 2026 öncesi kazanılan puanlar 30 Haziran 2026 tarihinde silinecektir. Şu an etkilenen: <span className="font-bold">100 puan</span>.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(txFilter === "all" ? transactions : transactions.filter((tx) => tx.type === txFilter)).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      tx.type === "kazanildi"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      {tx.type === "kazanildi"
                        ? <ArrowDownRight className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        : <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{tx.desc}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm flex-shrink-0 ml-2 ${
                    tx.points > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"
                  }`}>
                    {tx.points > 0 ? "+" : ""}{tx.points}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Arkadaş davet bağlantısı */}
        <Link href="/referans">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Arkadaşını Getir, 50 Puan Kazan!</p>
                  <p className="text-xs text-muted-foreground">Her başarılı davet için +50 puan</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
