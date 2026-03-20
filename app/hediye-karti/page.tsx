"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gift, Copy, CheckCheck, Send, Sparkles, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AMOUNTS = [10, 25, 50, 100, 200, 500];

const MOCK_BALANCE_CARD = { code: "GIFT-UCB-7F3K2", amount: 50, from: "Ali Veli", message: "İyi alışverişler!", expires: "Mart 2027" };

function GiftCardVisual({ amount, from, message }: { amount: number; from: string; message: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-orange-600 p-5 text-white shadow-xl aspect-[1.6/1] flex flex-col justify-between select-none">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium opacity-80">UCUZCUBAKKAL</p>
          <p className="text-xs opacity-60">Hediye Kartı</p>
        </div>
        <Gift className="h-6 w-6 opacity-80" />
      </div>
      <div>
        <p className="text-3xl font-black tracking-tight">{amount}<span className="text-xl">π</span></p>
        {message && <p className="text-xs opacity-80 mt-1 line-clamp-1 italic">"{message}"</p>}
        {from && <p className="text-xs opacity-60 mt-0.5">— {from}</p>}
      </div>
      {/* Dekoratif daireler */}
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
    </div>
  );
}

export default function HediyeKartiPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"satin-al" | "kullan">("satin-al");
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Kullan
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemed, setRedeemed] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || amount : amount;

  const handleBuy = () => {
    if (!to.trim() || !from.trim()) {
      toast({ title: "Alıcı ve gönderici adı zorunludur", variant: "destructive" });
      return;
    }
    const code = `GIFT-UCB-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    setGeneratedCode(code);
    setStep("success");
    toast({ title: "Hediye kartı oluşturuldu!", description: `${finalAmount}π değerinde kart hazır.` });
  };

  const handleRedeem = () => {
    if (redeemCode.trim().toUpperCase() === MOCK_BALANCE_CARD.code) {
      setRedeemed(true);
      toast({ title: `${MOCK_BALANCE_CARD.amount}π bakiyenize eklendi!`, description: `Gönderen: ${MOCK_BALANCE_CARD.from}` });
    } else {
      toast({ title: "Geçersiz kod", description: "Lütfen kodu kontrol edin.", variant: "destructive" });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Gift className="h-6 w-6 text-primary" /> Hediye Kartı</h1>
          <p className="text-sm text-muted-foreground mt-1">Sevdiklerinize Pi ile hediye kartı gönderin</p>
        </div>

        {/* Sekme */}
        <div className="flex rounded-xl bg-muted p-1 gap-1">
          {([["satin-al", "Satın Al"], ["kullan", "Kodu Kullan"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                tab === val ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}>
              {label}
            </button>
          ))}
        </div>

        {tab === "satin-al" ? (
          step === "form" ? (
            <div className="space-y-5">
              {/* Önizleme */}
              <GiftCardVisual amount={finalAmount} from={from || "Gönderici"} message={message || "Harika alışverişler!"} />

              {/* Tutar */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tutar (π)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {AMOUNTS.map((a) => (
                    <button key={a} onClick={() => { setAmount(a); setCustomAmount(""); }}
                      className={cn("py-2 rounded-lg text-sm font-bold border transition-all",
                        amount === a && !customAmount ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/50"
                      )}>
                      {a}π
                    </button>
                  ))}
                </div>
                <Input type="number" placeholder="Özel tutar girin..." value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="text-sm" min={1}
                />
              </div>

              <Separator />

              {/* Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Gönderici Adı *</Label>
                    <Input placeholder="Adınız" value={from} onChange={(e) => setFrom(e.target.value)} className="text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Alıcı Adı *</Label>
                    <Input placeholder="Alıcının adı" value={to} onChange={(e) => setTo(e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mesaj (isteğe bağlı)</Label>
                  <Textarea placeholder="Kişisel mesajınızı yazın..." value={message}
                    onChange={(e) => setMessage(e.target.value)} rows={2} className="text-sm resize-none" />
                </div>
              </div>

              <Button className="w-full gap-2 h-11" onClick={handleBuy}>
                <Sparkles className="h-4 w-4" />
                {finalAmount}π Hediye Kartı Oluştur
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="h-3.5 w-3.5" />
                Pi ağı ile güvenli ödeme
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center">
              <GiftCardVisual amount={finalAmount} from={from} message={message || "Harika alışverişler!"} />
              <div className="space-y-2">
                <p className="font-semibold text-green-600 flex items-center justify-center gap-1.5">
                  <CheckCheck className="h-5 w-5" /> Hediye Kartı Hazır!
                </p>
                <p className="text-sm text-muted-foreground">Alıcıya bu kodu iletin:</p>
                <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3 justify-between">
                  <span className="font-mono font-bold text-lg tracking-widest">{generatedCode}</span>
                  <button onClick={copyCode} className="text-muted-foreground hover:text-primary transition-colors">
                    {copied ? <CheckCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={() => { setStep("form"); setGeneratedCode(""); setTo(""); setFrom(""); setMessage(""); }}>
                <Gift className="h-4 w-4" /> Yeni Kart Oluştur
              </Button>
              <Button className="w-full gap-2">
                <Send className="h-4 w-4" /> Alıcıya Gönder
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-5">
            {redeemed ? (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
                <CardContent className="pt-5 text-center space-y-3">
                  <CheckCheck className="h-10 w-10 text-green-600 mx-auto" />
                  <p className="font-bold text-green-700 dark:text-green-400">Kod başarıyla kullanıldı!</p>
                  <p className="text-sm text-muted-foreground">{MOCK_BALANCE_CARD.amount}π bakiyenize eklendi.</p>
                  <p className="text-xs text-muted-foreground italic">"{MOCK_BALANCE_CARD.message}" — {MOCK_BALANCE_CARD.from}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Hediye Kartı Kodunu Girin</CardTitle>
                  <CardDescription className="text-xs">Kodu girerek bakiyenizi artırın ve alışveriş yapın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Örn: GIFT-UCB-7F3K2"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    className="font-mono text-sm uppercase"
                    onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                  />
                  <Button className="w-full gap-2" onClick={handleRedeem}>
                    <Gift className="h-4 w-4" /> Kodu Kullan
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Demo kodu: <button onClick={() => setRedeemCode(MOCK_BALANCE_CARD.code)}
                      className="font-mono text-primary hover:underline">{MOCK_BALANCE_CARD.code}</button>
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="border-dashed">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[["Geçerli Süre", "12 Ay"], ["Min. Tutar", "10π"], ["Kullanım", "Tüm Ürünler"]].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-bold">{val}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
