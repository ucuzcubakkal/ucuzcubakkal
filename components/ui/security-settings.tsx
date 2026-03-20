"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck, ShieldAlert, Smartphone, Mail, KeyRound,
  CheckCircle2, Wallet, TrendingUp, ArrowUpRight, Copy, CheckCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

/* ─── İki Faktörlü Doğrulama ─────────────────────────────────────── */
export function TwoFactorAuth() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<"idle" | "verify" | "done">("idle");
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [code, setCode] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const MOCK_CODE = "847291";

  const handleToggle = (val: boolean) => {
    if (val) { setStep("verify"); }
    else {
      setEnabled(false); setStep("idle");
      toast({ title: "2FA devre dışı bırakıldı", variant: "destructive" });
    }
  };

  const handleVerify = () => {
    if (code === MOCK_CODE) {
      setEnabled(true); setStep("done");
      toast({ title: "İki faktörlü doğrulama aktif!", description: "Hesabınız artık daha güvenli." });
    } else {
      toast({ title: "Hatalı kod", description: `Demo kodu: ${MOCK_CODE}`, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          İki Faktörlü Doğrulama (2FA)
          {enabled && <Badge className="ml-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-[10px]">Aktif</Badge>}
        </CardTitle>
        <CardDescription className="text-xs">
          Hesabınıza giriş yaparken ek doğrulama kodu istenir. Güvenliğinizi artırır.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {enabled
              ? <ShieldCheck className="h-8 w-8 text-green-500" />
              : <ShieldAlert className="h-8 w-8 text-muted-foreground" />
            }
            <div>
              <p className="text-sm font-medium">{enabled ? "2FA Aktif" : "2FA Kapalı"}</p>
              <p className="text-xs text-muted-foreground">{enabled ? "Hesabınız korunuyor" : "Etkinleştirmenizi öneririz"}</p>
            </div>
          </div>
          <Switch checked={enabled || step === "verify"} onCheckedChange={handleToggle} />
        </div>

        {step === "verify" && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">DOĞRULAMA YÖNTEMİ</p>
              <div className="grid grid-cols-2 gap-2">
                {(["email", "sms"] as const).map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm transition-all",
                      method === m ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                    )}>
                    {m === "email" ? <Mail className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                    {m === "email" ? "E-posta" : "SMS"}
                  </button>
                ))}
              </div>

              {method === "email" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">E-posta Adresi</Label>
                  <Input placeholder="ornek@email.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="text-sm" />
                </div>
              )}

              <Button size="sm" variant="outline" className="w-full gap-2" onClick={() =>
                toast({ title: `Doğrulama kodu gönderildi`, description: `Demo kodu: ${MOCK_CODE}` })
              }>
                <KeyRound className="h-3.5 w-3.5" />
                Kod Gönder
              </Button>

              <div className="space-y-1.5">
                <Label className="text-xs">Doğrulama Kodu</Label>
                <div className="flex gap-2">
                  <Input placeholder="6 haneli kod" value={code} onChange={(e) => setCode(e.target.value)}
                    maxLength={6} className="font-mono text-center text-lg tracking-widest" />
                  <Button onClick={handleVerify} className="shrink-0">Onayla</Button>
                </div>
              </div>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/10 rounded-xl p-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>2FA başarıyla etkinleştirildi. Bir sonraki girişten itibaren geçerli.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Pi Cüzdanı Bakiye Göstergesi ───────────────────────────────── */
export function PiWalletWidget() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const MOCK_WALLET = {
    balance: 1_247.5,
    locked: 312.0,
    available: 935.5,
    address: "GBXKUUF...7YNZ4",
    lastTx: [
      { type: "in",  amount: 125,  label: "Satış geliri",     date: "13 Mart" },
      { type: "out", amount: 89,   label: "Alışveriş",        date: "12 Mart" },
      { type: "in",  amount: 50,   label: "Referans ödülü",   date: "10 Mart" },
    ],
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(MOCK_WALLET.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Cüzdan adresi kopyalandı" });
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-orange-500 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-semibold">Pi Cüzdanım</span>
          </div>
          <Badge className="bg-white/20 text-white border-0 text-xs hover:bg-white/30">Pi Network</Badge>
        </div>
        <p className="text-3xl font-black tracking-tight">{MOCK_WALLET.balance.toLocaleString("tr-TR")}π</p>
        <p className="text-xs opacity-80 mt-0.5">Toplam Bakiye</p>
        <button onClick={copyAddress} className="flex items-center gap-1.5 mt-2 text-xs opacity-70 hover:opacity-100 transition-opacity">
          <span className="font-mono">{MOCK_WALLET.address}</span>
          {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Kullanılabilir</p>
            <p className="text-lg font-bold text-green-600">{MOCK_WALLET.available.toLocaleString("tr-TR")}π</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Kilitli</p>
            <p className="text-lg font-bold text-muted-foreground">{MOCK_WALLET.locked.toLocaleString("tr-TR")}π</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" /> SON İŞLEMLER
          </p>
          {MOCK_WALLET.lastTx.map((tx, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={cn("h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0",
                  tx.type === "in" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                )}>
                  <ArrowUpRight className={cn("h-3.5 w-3.5", tx.type === "in" ? "text-green-600 rotate-180" : "text-red-500")} />
                </div>
                <div>
                  <p className="font-medium text-xs">{tx.label}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <p className={cn("font-bold text-sm", tx.type === "in" ? "text-green-600" : "text-destructive")}>
                {tx.type === "in" ? "+" : "-"}{tx.amount}π
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── SecuritySettings — Birlesik export ─────────────────────────── */
export function SecuritySettings() {
  return (
    <div className="space-y-4">
      <TwoFactorAuth />
      <PiWalletWidget />
    </div>
  );
}

/* ─── Satıcı Sertifika Kartı ──────────────────────────────────────── */
export function SellerCertificateBadge({ totalSales, rating, memberMonths }: { totalSales: number; rating: number; memberMonths: number }) {
  const level = totalSales >= 500 && rating >= 4.8 ? "platinum"
    : totalSales >= 100 && rating >= 4.5 ? "gold"
    : totalSales >= 20  && rating >= 4.0 ? "silver"
    : "bronze";

  const LEVELS = {
    platinum: { label: "Platin Satıcı",  color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",   icon: "💎" },
    gold:     { label: "Altın Satıcı",   color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: "🏅" },
    silver:   { label: "Gümüş Satıcı",  color: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",  icon: "🥈" },
    bronze:   { label: "Bronz Satıcı",  color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: "🥉" },
  };

  const cfg = LEVELS[level];

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-0", cfg.color)}>
      <span>{cfg.icon}</span>
      {cfg.label}
      <span className="opacity-60">· {totalSales} satış · {memberMonths}ay üye</span>
    </div>
  );
}
