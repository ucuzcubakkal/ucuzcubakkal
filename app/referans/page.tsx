"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, Gift, Copy, CheckCheck, Share2,
  ArrowRight, Check, Clock, Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

const REFERRAL_CODE = "UCUZCU-A3F9K";
const REFERRAL_LINK = `https://ucuzcubakkal.com/giris?ref=${REFERRAL_CODE}`;
const REWARD_PER_REFERRAL = 10; // π

const MOCK_REFERRALS = [
  { name: "Zeynep Y.", date: "2 Mart 2026", status: "tamamlandi", reward: REWARD_PER_REFERRAL },
  { name: "Ali K.", date: "25 Şubat 2026", status: "tamamlandi", reward: REWARD_PER_REFERRAL },
  { name: "Fatma A.", date: "18 Şubat 2026", status: "bekliyor", reward: 0 },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Linkinizi Paylaşın", desc: "Özel referans linkinizi arkadaşlarınızla paylaşın" },
  { step: "2", title: "Arkadaşınız Kayıt Olsun", desc: "Arkadaşınız linkinizle kayıt olup ilk alışverişini yapsın" },
  { step: "3", title: "İkiniz de Kazanın", desc: `Her iki tarafa da ${REWARD_PER_REFERRAL}π indirim tanımlanır` },
];

export default function ReferansPage() {
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const completedReferrals = MOCK_REFERRALS.filter((r) => r.status === "tamamlandi").length;
  const totalEarned = MOCK_REFERRALS.filter((r) => r.status === "tamamlandi")
    .reduce((s, r) => s + r.reward, 0);

  const copy = (type: "code" | "link") => {
    const text = type === "code" ? REFERRAL_CODE : REFERRAL_LINK;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    toast({
      title: type === "code" ? "Kod kopyalandı!" : "Link kopyalandı!",
      description: "Arkadaşlarınızla paylaşmaya hazır.",
      duration: 2000,
    });
    setTimeout(() => setCopied(null), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Ucuzcubakkal'da 10π İndirim Kazan!",
        text: `El yapımı ürünlerde 10π indirim kazanmak için referans kodum: ${REFERRAL_CODE}`,
        url: REFERRAL_LINK,
      });
    } else {
      copy("link");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack title="Arkadaşını Getir" />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-primary/10 rounded-full p-6 mb-4">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-muted-foreground mb-6 max-w-xs">
            Referans sisteminizi görüntülemek için giriş yapın.
          </p>
          <Link href="/giris">
            <Button size="lg">Giriş Yap</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Arkadaşını Getir" />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-10 px-4 text-center">
        <div className="bg-primary-foreground/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Gift className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">
          Her Arkadaşa {REWARD_PER_REFERRAL}π
        </h1>
        <p className="opacity-90 text-sm max-w-sm mx-auto">
          Arkadaşını davet et, her iki tarafa da {REWARD_PER_REFERRAL}π indirim tanımlansın.
          Sınırsız davet, sınırsız kazanç!
        </p>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-5">

        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Davetlenen", value: MOCK_REFERRALS.length, icon: Users, suffix: " kişi" },
            { label: "Tamamlanan", value: completedReferrals, icon: Check, suffix: " kişi" },
            { label: "Toplam Kazanç", value: totalEarned, icon: Star, suffix: "π" },
          ].map(({ label, value, icon: Icon, suffix }) => (
            <Card key={label}>
              <CardContent className="p-4 text-center">
                <Icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-xl font-bold text-primary">{value}{suffix}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Referans Kodu ve Link */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Referans Kodunuz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Kod */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-primary/40 rounded-xl py-3 bg-primary/5">
                <span className="font-mono font-bold text-xl tracking-widest text-primary">
                  {REFERRAL_CODE}
                </span>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 flex-shrink-0"
                onClick={() => copy("code")}
                aria-label="Kodu kopyala"
              >
                {copied === "code" ? (
                  <CheckCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Link */}
            <div className="flex items-center gap-2">
              <div className="flex-1 text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2 truncate font-mono">
                {REFERRAL_LINK}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 flex-shrink-0"
                onClick={() => copy("link")}
                aria-label="Linki kopyala"
              >
                {copied === "link" ? (
                  <CheckCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Paylaş butonu */}
            <Button className="w-full gap-2 h-11" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Arkadaşlarınla Paylaş
            </Button>
          </CardContent>
        </Card>

        {/* Nasıl çalışır */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nasıl Çalışır?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground self-center ml-auto flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Davet listesi */}
        {MOCK_REFERRALS.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Davetlerim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_REFERRALS.map((ref, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-accent w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                        {ref.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ref.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {ref.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ref.status === "tamamlandi" ? (
                        <>
                          <span className="text-sm font-bold text-primary">+{ref.reward}π</span>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">
                            Kazanıldı
                          </Badge>
                        </>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-xs">
                          Bekleniyor
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Koşullar */}
        <p className="text-xs text-muted-foreground text-center pb-4">
          Referans indirimi, arkadaşınızın ilk alışverişini tamamlamasının ardından her iki tarafa
          otomatik olarak tanımlanır. İndirim, minimum 50π tutarındaki siparişlerde geçerlidir.
        </p>
      </div>
    </div>
  );
}
