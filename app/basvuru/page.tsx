"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  CheckCircle2, ChevronRight, Wallet, Mail, Phone, MessageCircle,
  Shield, Camera, AlertTriangle, Loader2, Globe, Sparkles, Users,
  Building2, ImageIcon, FileText, Eye, EyeOff, Lock,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

type KycStatus = "idle" | "checking" | "verified" | "not_verified" | "error";
type AuthStatus = "idle" | "authenticating" | "authenticated" | "error";
type VerifStatus = "idle" | "sending" | "sent" | "verified" | "error";

type FormData = {
  // Adım 1 — Pi Auth
  piUsername: string;
  piUid: string;
  walletAddress: string;
  email: string;
  emailCode: string;
  phone: string;
  phoneCode: string;
  // Adım 2 — KYC
  livenessPhoto: string;
  // Adım 3 — Yasal & Mağaza Kurulumu
  sellerType: "individual" | "corporate";
  taxId: string;
  storeName: string;
  storeNameChecked: "idle" | "checking" | "available" | "taken";
  craft: string;
  bio: string;
  city: string;
  country: string;
  shippingCountries: string[];
  ownCargo: boolean;
  socialInstagram: string;
  // Adım 4 — Portföy & Onay
  portfolioImages: string[];
  agreeTerms: boolean;
  agreeKyc: boolean;
};

const STEP_LABELS: Record<Step, string> = {
  1: "Pi Auth & İletişim",
  2: "KYC Doğrulama",
  3: "Mağaza Bilgileri",
  4: "Portföy & Onay",
};

const STEP_ICONS: Record<Step, React.ElementType> = {
  1: Wallet,
  2: Shield,
  3: Building2,
  4: FileText,
};

export default function BasvuruPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { loginWithPi, user } = useAuth();

  // Adım 1 state
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [emailVerif, setEmailVerif] = useState<VerifStatus>("idle");
  const [phoneVerif, setPhoneVerif] = useState<VerifStatus>("idle");
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [showPhoneCode, setShowPhoneCode] = useState(false);

  // Adım 2 state
  const [kycStatus, setKycStatus] = useState<KycStatus>("idle");
  const [livenessCapturing, setLivenessCapturing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [form, setForm] = useState<FormData>({
    piUsername: user?.piUsername ?? "",
    piUid: user?.piUid ?? "",
    walletAddress: "",
    email: "",
    emailCode: "",
    phone: "",
    phoneCode: "",
    livenessPhoto: "",
    sellerType: "individual",
    taxId: "",
    storeName: "",
    storeNameChecked: "idle",
    craft: "",
    bio: "",
    city: "",
    country: "Türkiye",
    shippingCountries: ["Türkiye"],
    ownCargo: false,
    socialInstagram: "",
    portfolioImages: [],
    agreeTerms: false,
    agreeKyc: false,
  });

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Otomatik Taslak Kaydı (localStorage) ────────────────────────────
  const DRAFT_KEY = "ucb_seller_draft";

  // Sayfa açılışında kaydedilmiş taslağı yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { step: Step; form: FormData };
      setForm((prev) => ({ ...prev, ...saved.form, livenessPhoto: "", portfolioImages: [] }));
      setStep(saved.step);
      toast({
        title: "Taslak bulundu",
        description: "Kaldığınız yerden devam ediyorsunuz. Verileriniz otomatik yüklendi.",
        duration: 4000,
      });
    } catch {
      // bozuk veri — yoksay
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Her form değişikliğinde otomatik kaydet (hassas alanlar hariç)
  useEffect(() => {
    try {
      const toSave = {
        step,
        form: {
          ...form,
          // Fotoğrafları localStorage'a kaydetme (büyük base64)
          livenessPhoto: "",
          portfolioImages: [],
          emailCode: "",
          phoneCode: "",
        },
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
    } catch {
      // localStorage dolu olabilir — sessizce geç
    }
  }, [step, form]);

  // ── Pi Auth ─────────────────────────────────────────────────────────
  const handlePiAuth = async () => {
    setAuthStatus("authenticating");
    try {
      await loginWithPi();
      if (user) {
        update("piUsername", user.piUsername);
        update("piUid", user.piUid);
        // Cüzdan adresi: gerçek uygulamada Pi SDK wallet_address scope'undan gelir
        update("walletAddress", `GXXXXXXXXX${user.piUid.slice(-8).toUpperCase()}`);
      }
      setAuthStatus("authenticated");
      toast({ title: "Pi Hesabı Dogrulandi", description: "Cuzdanınız otomatik eslestirildi.", duration: 3000 });
    } catch {
      setAuthStatus("error");
      toast({ title: "Pi Auth Basarisiz", description: "Pi Browser uzerinden tekrar deneyin.", variant: "destructive" });
    }
  };

  // ── E-posta doğrulama ────────────────────────────────────────────────
  const sendEmailCode = async () => {
    if (!form.email.includes("@")) {
      toast({ title: "Gecersiz e-posta", variant: "destructive" }); return;
    }
    setEmailVerif("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setEmailVerif("sent");
    setShowEmailCode(true);
    toast({ title: "Dogrulama kodu gonderildi", description: `${form.email} adresine 6 haneli kod gonderildi.` });
  };

  const verifyEmailCode = async () => {
    if (form.emailCode.length < 4) return;
    setEmailVerif("checking" as VerifStatus);
    await new Promise((r) => setTimeout(r, 800));
    // Demo: herhangi bir 4+ haneli kod gecerli kabul edilir
    setEmailVerif("verified");
    toast({ title: "E-posta dogrulandi", duration: 2000 });
  };

  // ── Telefon doğrulama ────────────────────────────────────────────────
  const sendPhoneCode = async () => {
    if (!form.phone || form.phone.length < 8) {
      toast({ title: "Gecersiz telefon numarasi", variant: "destructive" }); return;
    }
    setPhoneVerif("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setPhoneVerif("sent");
    setShowPhoneCode(true);
    toast({ title: "SMS gonderildi", description: `${form.phone} numarasina WhatsApp/SMS kodu gonderildi.` });
  };

  const verifyPhoneCode = async () => {
    if (form.phoneCode.length < 4) return;
    setPhoneVerif("checking" as VerifStatus);
    await new Promise((r) => setTimeout(r, 800));
    setPhoneVerif("verified");
    toast({ title: "Telefon dogrulandi", duration: 2000 });
  };

  // ── Pi KYC kontrolü ─────────────────────────────────────────────────
  const checkPiKyc = async () => {
    setKycStatus("checking");
    await new Promise((r) => setTimeout(r, 2000));
    // Gercek uygulamada: Pi SDK veya backend'e istek atilir
    // Ornek: const res = await fetch("/api/pi-kyc-check", { body: { uid: form.piUid } })
    setKycStatus("verified"); // Demo: her zaman verified
    toast({ title: "Pi KYC dogrulandi", description: "Pi Network KYC surecinizi tamamlamissınız.", duration: 3000 });
  };

  // ── Kamera / Canlılık testi ──────────────────────────────────────────
  const openCamera = useCallback(async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      toast({ title: "Kamera acılamadi", description: "Tarayıcı kamera iznini kontrol edin.", variant: "destructive" });
      setCameraOpen(false);
    }
  }, [toast]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    setLivenessCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    update("livenessPhoto", dataUrl);
    // Stream kapat
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setLivenessCapturing(false);
    toast({ title: "Selfie cekıldı", description: "Canlilik testi fotografı kaydedildi.", duration: 2000 });
  }, [toast]);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }, []);

  // ── Mağaza adı benzersizlik kontrolü ────────────────────────────────
  const checkStoreName = async () => {
    if (form.storeName.trim().length < 3) {
      toast({ title: "En az 3 karakter girin", variant: "destructive" }); return;
    }
    update("storeNameChecked", "checking");
    await new Promise((r) => setTimeout(r, 1000));
    // Demo: "test" ve "deneme" alınmış kabul edilir
    const taken = ["test", "deneme", "mağaza"].includes(form.storeName.trim().toLowerCase());
    update("storeNameChecked", taken ? "taken" : "available");
    if (taken) toast({ title: "Bu isim alınmış", description: "Farklı bir mağaza adı deneyin.", variant: "destructive" });
    else toast({ title: "Mağaza adı uygun!", description: "Bu isim kullanılabilir.", duration: 2000 });
  };

  // ── Kargo ülkesi toggle ──────────────────────────────────────────────
  const SHIPPING_REGIONS = [
    "Türkiye", "Avrupa", "ABD & Kanada", "Orta Doğu", "Asya", "Afrika", "Güney Amerika", "Tüm Dünya",
  ];

  const toggleShippingCountry = (region: string) => {
    const current = form.shippingCountries;
    if (region === "Tüm Dünya") {
      update("shippingCountries", ["Tüm Dünya"]);
      return;
    }
    const next = current.includes(region)
      ? current.filter((c) => c !== region && c !== "Tüm Dünya")
      : [...current.filter((c) => c !== "Tüm Dünya"), region];
    update("shippingCountries", next.length === 0 ? ["Türkiye"] : next);
  };

  // ── Adım validasyonları ──────────────────────────────────────────────
  const validateStep1 = () => {
    if (authStatus !== "authenticated") {
      toast({ title: "Pi hesabinizi dogrulayin", variant: "destructive" }); return false;
    }
    if (emailVerif !== "verified") {
      toast({ title: "E-posta dogrulaması tamamlanmadı", variant: "destructive" }); return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (kycStatus !== "verified") {
      toast({ title: "Pi KYC kontrolu yapılmadı", variant: "destructive" }); return false;
    }
    if (!form.livenessPhoto) {
      toast({ title: "Canlilik testi zorunludur", description: "El yazisi kagidiyla selfie cekin.", variant: "destructive" }); return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!form.storeName.trim() || !form.craft.trim() || !form.bio.trim()) {
      toast({ title: "Eksik bilgi", description: "Mağaza adı, kategori ve tanıtım zorunludur.", variant: "destructive" }); return false;
    }
    if (form.storeNameChecked === "taken") {
      toast({ title: "Bu mağaza adı alınmış", description: "Farklı bir isim seçin.", variant: "destructive" }); return false;
    }
    if (form.storeNameChecked !== "available") {
      toast({ title: "Mağaza adını kontrol edin", description: "Devam etmeden önce benzersizlik kontrolü yapın.", variant: "destructive" }); return false;
    }
    if (form.bio.trim().length < 50) {
      toast({ title: "Tanıtım çok kısa", description: "En az 50 karakter yazın.", variant: "destructive" }); return false;
    }
    if (form.shippingCountries.length === 0) {
      toast({ title: "En az bir kargo bölgesi seçin", variant: "destructive" }); return false;
    }
    return true;
  };

  const router = useRouter();

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    localStorage.removeItem(DRAFT_KEY);
    router.push("/basvuru/tamamlandi");
  };

  // ── Başarı ekranı ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack title="Basvuru" />
        <div className="container mx-auto px-4 py-16 max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold">Basvurunuz Alindı!</h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            <strong className="text-foreground">@{form.piUsername}</strong> Pi hesabiniz dogrulandi.
            Mağazanız inceleme sürecine alındı. <strong className="text-foreground">3-5 is gunu</strong> icinde
            sonuç bildirilecektir.
          </p>

          {/* KYC özet rozetleri */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: Wallet, label: "Pi Auth", color: "text-primary" },
              { icon: Shield, label: "KYC Gecti", color: "text-green-600" },
              { icon: Camera, label: "Canlilik OK", color: "text-blue-600" },
              { icon: CheckCircle2, label: "Sartlar Onaylandi", color: "text-amber-600" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 bg-muted/50 rounded-xl p-3 border border-border">
                <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="bg-muted/40 rounded-xl p-4 text-sm text-left space-y-2 border border-border">
            <p className="font-semibold">Sonraki adimlar:</p>
            <p className="text-muted-foreground">1. E-posta onayı bekleyin</p>
            <p className="text-muted-foreground">2. Magaza paneline erisim saglayın</p>
            <p className="text-muted-foreground">3. Ilk urunlerinizi ekleyin</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Satici Ol" />

      {/* Fayda banner */}
      <div className="bg-primary/5 border-b border-border py-5 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Globe, text: "28 ulkede sat" },
              { icon: Sparkles, text: "Pi ile guvenli odeme" },
              { icon: Users, text: "35.000+ alıcı" },
              { icon: Shield, text: "Alici guvencesi" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">

        {/* 4 Adım ilerleme çubuğu */}
        <div className="mb-8 space-y-3">
          {/* Üst satır: adım etiketi + yüzde */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {STEP_LABELS[step]}
            </p>
            <span className="text-xs font-bold text-primary">
              {step} / 4 tamamlandi ({Math.round(((step - 1) / 4) * 100)}%)
            </span>
          </div>

          {/* Dolduran progress bar */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>

          {/* Adım göstergeleri */}
          <div className="flex items-center justify-between">
            {([1, 2, 3, 4] as Step[]).map((s, idx) => {
              const Icon = STEP_ICONS[s];
              const done = step > s;
              const active = step === s;
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      done ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/30" :
                      active ? "bg-background border-primary text-primary ring-4 ring-primary/10" :
                      "bg-muted border-border text-muted-foreground"
                    }`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-[10px] font-medium mt-1.5 text-center leading-tight w-16 ${
                      active ? "text-primary" : done ? "text-primary/70" : "text-muted-foreground"
                    }`}>
                      {STEP_LABELS[s]}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-5 transition-colors duration-500 ${done ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Taslak kaydı göstergesi */}
          <p className="text-[11px] text-muted-foreground text-right flex items-center justify-end gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Taslak otomatik kaydediliyor
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-5">

            {/* ═══════════════════════════════════════════════════════
                ADIM 1: Pi Auth, Cüzdan & İletişim
            ═══════════════════════════════════════════════════════ */}
            {step === 1 && (
              <>
                <div className="space-y-1">
                  <h2 className="font-bold text-lg">Pi Hesabı & İletişim Bilgileri</h2>
                  <p className="text-sm text-muted-foreground">Pi Browser ile kimliğinizi doğrulayın ve iletişim bilgilerinizi ekleyin.</p>
                </div>

                {/* Pi Auth kutusu */}
                <div className={`rounded-xl border-2 p-4 transition-colors ${
                  authStatus === "authenticated" ? "border-green-500 bg-green-50 dark:bg-green-950/30" :
                  authStatus === "error" ? "border-destructive bg-destructive/5" :
                  "border-border bg-muted/30"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Wallet className={`h-5 w-5 ${authStatus === "authenticated" ? "text-green-600 dark:text-green-400" : "text-primary"}`} />
                      <span className="font-semibold text-sm">Pi Hesabı Doğrulama</span>
                    </div>
                    {authStatus === "authenticated" && (
                      <Badge className="bg-green-500 text-white text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Dogrulandi
                      </Badge>
                    )}
                  </div>

                  {authStatus === "authenticated" ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Pi kullanici adi: <strong>@{form.piUsername}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Wallet className="h-3.5 w-3.5" />
                        <span className="font-mono text-xs truncate">Cuzdanı: {form.walletAddress}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pi Browser uzerinden tek tıkla giriş yapın. Odeme cuzdanınız otomatik eşleştirilecektir.
                      </p>
                      <Button
                        onClick={handlePiAuth}
                        disabled={authStatus === "authenticating"}
                        className="w-full gap-2"
                        variant="default"
                      >
                        {authStatus === "authenticating" ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Dogrulanıyor...</>
                        ) : (
                          <><Wallet className="h-4 w-4" /> Pi ile Oturum Aç</>
                        )}
                      </Button>
                      {authStatus === "error" && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Pi Browser'ı kullandığınızdan emin olun.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* E-posta */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    E-posta Adresi <span className="text-destructive">*</span>
                    {emailVerif === "verified" && <Badge className="ml-auto bg-green-500 text-white text-xs">Dogrulandi</Badge>}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="ornek@email.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      disabled={emailVerif === "verified"}
                    />
                    {emailVerif !== "verified" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={sendEmailCode}
                        disabled={emailVerif === "sending" || emailVerif === "sent" as VerifStatus}
                      >
                        {emailVerif === "sending" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Kod Gonder"}
                      </Button>
                    )}
                  </div>
                  {showEmailCode && emailVerif !== "verified" && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="6 haneli dogrulama kodu"
                        value={form.emailCode}
                        onChange={(e) => update("emailCode", e.target.value)}
                        maxLength={6}
                      />
                      <Button variant="outline" size="sm" className="flex-shrink-0" onClick={verifyEmailCode}>
                        Dogrula
                      </Button>
                    </div>
                  )}
                </div>

                {/* Telefon */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    WhatsApp / Telegram Numarası
                    {phoneVerif === "verified" && <Badge className="ml-auto bg-green-500 text-white text-xs">Dogrulandi</Badge>}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="+90 5xx xxx xx xx"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      disabled={phoneVerif === "verified"}
                    />
                    {phoneVerif !== "verified" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={sendPhoneCode}
                        disabled={phoneVerif === "sending" || phoneVerif === "sent" as VerifStatus}
                      >
                        {phoneVerif === "sending" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "SMS Gonder"}
                      </Button>
                    )}
                  </div>
                  {showPhoneCode && phoneVerif !== "verified" && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Dogrulama kodu"
                        value={form.phoneCode}
                        onChange={(e) => update("phoneCode", e.target.value)}
                        maxLength={6}
                      />
                      <Button variant="outline" size="sm" className="flex-shrink-0" onClick={verifyPhoneCode}>
                        Dogrula
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> Alıcılardan gelen sorular bu numaraya iletilecektir.
                  </p>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════
                ADIM 2: KYC — Pi Network & Canlılık Testi
            ═══════════════════════════════════════════════════════ */}
            {step === 2 && (
              <>
                <div className="space-y-1">
                  <h2 className="font-bold text-lg">Kimlik Dogrulama (KYC)</h2>
                  <p className="text-sm text-muted-foreground">Sahte hesapların onune gecmek icin iki adimli dogrulama yapılmaktadır.</p>
                </div>

                {/* Pi KYC kontrolü */}
                <div className={`rounded-xl border-2 p-4 space-y-3 transition-colors ${
                  kycStatus === "verified" ? "border-green-500 bg-green-50 dark:bg-green-950/30" :
                  kycStatus === "not_verified" ? "border-destructive bg-destructive/5" :
                  "border-border"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className={`h-5 w-5 ${kycStatus === "verified" ? "text-green-600 dark:text-green-400" : "text-primary"}`} />
                      <span className="font-semibold text-sm">Pi Network KYC Durumu</span>
                    </div>
                    {kycStatus === "verified" && (
                      <Badge className="bg-green-500 text-white text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" /> KYC Gecti
                      </Badge>
                    )}
                  </div>

                  {kycStatus === "idle" && (
                    <>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pi Network KYC surecini tamamlamis olmalisiniz. Sisteminiz
                        Pi SDK uzerinden durumunuzu otomatik kontrol edecektir.
                      </p>
                      <Button onClick={checkPiKyc} className="w-full gap-2" variant="outline">
                        <Shield className="h-4 w-4" /> Pi KYC Durumunu Kontrol Et
                      </Button>
                    </>
                  )}

                  {kycStatus === "checking" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Pi SDK uzerinden KYC durumu sorgulanıyor...
                    </div>
                  )}

                  {kycStatus === "verified" && (
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Pi Network KYC dogrulamanız onaylandı. Mağaza acabilirsiniz.
                    </div>
                  )}

                  {kycStatus === "not_verified" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        Pi Network KYC surecinizi henuz tamamlamamissiniz.
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lutfen Pi Network uygulamasindan KYC islemini tamamlayip tekrar deneyin.
                        KYC tamamlanmadan magaza acilamazı.
                      </p>
                      <Button onClick={checkPiKyc} variant="outline" size="sm" className="gap-2">
                        <Loader2 className="h-3.5 w-3.5" /> Tekrar Kontrol Et
                      </Button>
                    </div>
                  )}
                </div>

                {/* Canlılık Testi */}
                <div className={`rounded-xl border-2 p-4 space-y-3 transition-colors ${
                  form.livenessPhoto ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-border"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className={`h-5 w-5 ${form.livenessPhoto ? "text-green-600 dark:text-green-400" : "text-primary"}`} />
                      <span className="font-semibold text-sm">Canlilik Testi (Liveness Check)</span>
                    </div>
                    {form.livenessPhoto && (
                      <Badge className="bg-green-500 text-white text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Tamamlandi
                      </Badge>
                    )}
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium mb-1">
                      Talimat:
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      Bir kagit alın ve uzerine el yazisiyla su metni yazın:
                    </p>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mt-1.5 font-mono bg-amber-100 dark:bg-amber-900/50 rounded px-2 py-1">
                      Ucuzcu Bakkal — {new Date().toLocaleDateString("tr-TR")}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5">
                      Bu kagidi elinizde tutarken selfie cekin. Yuz ve yazi acikca gorulmeli.
                    </p>
                  </div>

                  {form.livenessPhoto ? (
                    <div className="space-y-2">
                      <img src={form.livenessPhoto} alt="Canlilik selfie" className="w-full max-h-48 object-cover rounded-lg border border-border" />
                      <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => { update("livenessPhoto", ""); openCamera(); }}>
                        <Camera className="h-3.5 w-3.5" /> Yeniden Cek
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={openCamera} className="w-full gap-2" variant="outline">
                      <Camera className="h-4 w-4" /> Kamerayi Ac ve Selfie Cek
                    </Button>
                  )}
                </div>

                {/* Kamera modal */}
                {cameraOpen && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl">
                      <div className="p-3 border-b border-border flex items-center justify-between">
                        <span className="font-semibold text-sm flex items-center gap-2">
                          <Camera className="h-4 w-4 text-primary" /> Selfie Cek
                        </span>
                        <button onClick={closeCamera} className="text-xs text-muted-foreground hover:text-foreground">Kapat</button>
                      </div>
                      <div className="relative bg-black">
                        <video ref={videoRef} className="w-full" autoPlay muted playsInline />
                        <div className="absolute inset-0 border-4 border-dashed border-white/30 m-6 rounded-xl pointer-events-none" />
                        <p className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-xs">
                          Yuzunuzu ve elinzdeki kagidi cerceve icine alin
                        </p>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="p-4">
                        <Button onClick={capturePhoto} disabled={livenessCapturing} className="w-full gap-2">
                          {livenessCapturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                          Fotograf Cek
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ═══════════════════════════════════════════════════════
                ADIM 3: Yasal Kimlik & Mağaza Kurulumu
            ═══════════════════════════════════════════════════════ */}
            {step === 3 && (
              <>
                <div className="space-y-1">
                  <h2 className="font-bold text-lg">Yasal Kimlik & Mağaza Kurulumu</h2>
                  <p className="text-sm text-muted-foreground">Yasal bilgilerinizi girin ve mağaza vitrinizi oluşturun.</p>
                </div>

                {/* ── Bireysel / Kurumsal Seçimi ── */}
                <div className="space-y-2">
                  <Label>Satıcı Tipi <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { value: "individual", icon: Users, title: "Bireysel", desc: "El işi, hobi veya küçük çaplı satış" },
                      { value: "corporate", icon: Building2, title: "Kurumsal", desc: "Tescilli şirket veya marka" },
                    ] as const).map(({ value, icon: Icon, title, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update("sellerType", value)}
                        className={`flex flex-col items-start gap-1.5 p-3.5 rounded-xl border-2 text-left transition-all ${
                          form.sellerType === value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${form.sellerType === value ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`font-semibold text-sm ${form.sellerType === value ? "text-primary" : "text-foreground"}`}>{title}</span>
                          {form.sellerType === value && <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Vergi / Kimlik No ── */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {form.sellerType === "corporate" ? "Vergi Numarası" : "TC Kimlik No"}
                    <Badge variant="outline" className="text-[10px] font-normal px-1.5">Opsiyonel</Badge>
                  </Label>
                  <Input
                    placeholder={form.sellerType === "corporate" ? "10 haneli vergi numaranız" : "TC Kimlik No (11 hane)"}
                    value={form.taxId}
                    onChange={(e) => update("taxId", e.target.value)}
                    maxLength={form.sellerType === "corporate" ? 10 : 11}
                  />
                  {/* Şeffaf Satıcı rozeti teşviki */}
                  <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5">
                    <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      Vergi/Kimlik numarası giren satıcılar{" "}
                      <strong className="text-amber-900 dark:text-amber-200">Şeffaf Satıcı</strong> rozeti kazanır.
                      Bu rozet, global alıcılarda güven oranını %34 artırır.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mağaza Vitrini</p>

                  {/* ── Mağaza Adı + Benzersizlik Kontrolü ── */}
                  <div className="space-y-2">
                    <Label>Mağaza Adı <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Örn: Anadolu El Sanatları"
                          value={form.storeName}
                          onChange={(e) => {
                            update("storeName", e.target.value);
                            update("storeNameChecked", "idle");
                          }}
                          className={
                            form.storeNameChecked === "available" ? "border-green-500 focus-visible:ring-green-500" :
                            form.storeNameChecked === "taken" ? "border-destructive focus-visible:ring-destructive" : ""
                          }
                        />
                        {form.storeNameChecked === "available" && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={checkStoreName}
                        disabled={form.storeNameChecked === "checking" || form.storeName.trim().length < 3}
                        className="flex-shrink-0"
                      >
                        {form.storeNameChecked === "checking" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : "Kontrol Et"}
                      </Button>
                    </div>
                    {form.storeNameChecked === "taken" && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Bu isim zaten kullanılıyor.
                      </p>
                    )}
                    {form.storeNameChecked === "available" && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Bu isim kullanılabilir.
                      </p>
                    )}
                  </div>

                  {/* ── Kategori Seçimi ── */}
                  <div className="space-y-2">
                    <Label>Ana Satış Kategorisi <span className="text-destructive">*</span></Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "El Sanatları", "Elektronik", "Moda & Giyim",
                        "Ev & Yaşam", "Gıda & İçecek", "Spor & Outdoor",
                        "Kitap & Hobi", "Mücevher", "Diğer",
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => update("craft", cat)}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                            form.craft === cat
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50 text-foreground"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Mağaza Tanıtımı ── */}
                  <div className="space-y-2">
                    <Label>Mağaza Tanıtımı <span className="text-destructive">*</span></Label>
                    <Textarea
                      placeholder="Sattığınız ürünleri, hedef kitlenizi ve mağazanızın hikayesini anlatın... (en az 50 karakter)"
                      rows={3}
                      value={form.bio}
                      onChange={(e) => update("bio", e.target.value)}
                    />
                    <p className={`text-xs text-right transition-colors ${form.bio.length >= 50 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {form.bio.length} / 50 min
                    </p>
                  </div>

                  {/* ── Konum ── */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Şehir</Label>
                      <Input placeholder="İstanbul" value={form.city} onChange={(e) => update("city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Ülke</Label>
                      <Input placeholder="Türkiye" value={form.country} onChange={(e) => update("country", e.target.value)} />
                    </div>
                  </div>

                  {/* ── Lojistik Tercihleri ── */}
                  <div className="space-y-3">
                    <Label>Kargo Gönderi Bölgeleri <span className="text-destructive">*</span></Label>
                    <div className="flex flex-wrap gap-2">
                      {SHIPPING_REGIONS.map((region) => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => toggleShippingCountry(region)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            form.shippingCountries.includes(region) || form.shippingCountries.includes("Tüm Dünya")
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50 text-foreground"
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Seçili: {form.shippingCountries.join(", ")}
                    </p>

                    {/* Kargo yöntemi */}
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border hover:border-primary/40 transition-colors">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary flex-shrink-0"
                        checked={form.ownCargo}
                        onChange={(e) => update("ownCargo", e.target.checked)}
                      />
                      <div>
                        <p className="text-sm font-medium">Kendi anlaşmalı kargom var</p>
                        <p className="text-xs text-muted-foreground">Kendi kargo firmanızı veya özel kurye kullanacaksanız işaretleyin.</p>
                      </div>
                    </label>
                  </div>

                  {/* ── Instagram ── */}
                  <div className="space-y-2">
                    <Label>Instagram (opsiyonel)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                      <Input className="pl-7" placeholder="instagram_kullanici" value={form.socialInstagram} onChange={(e) => update("socialInstagram", e.target.value)} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══════════════════════════════════════════════════════
                ADIM 4: Portföy & Onay
            ═══════════════════════════════════════════════════════ */}
            {step === 4 && (
              <>
                <div className="space-y-1">
                  <h2 className="font-bold text-lg">Portfoy & Son Onay</h2>
                  <p className="text-sm text-muted-foreground">Ornek urun fotograflarini ekleyip basyurunuzu gonderin.</p>
                </div>

                {/* Portföy — Mobil kamera + galeri yükleme */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    Portföy Görselleri
                    <Badge variant="outline" className="text-[10px] font-normal px-1.5 ml-1">
                      {form.portfolioImages.length} / 5
                    </Badge>
                  </Label>

                  {/* Yüklenen görseller */}
                  {form.portfolioImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.portfolioImages.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img}
                            alt={`Portföy ${i + 1}`}
                            className="h-20 w-20 rounded-xl object-cover border border-border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const imgs = form.portfolioImages.filter((_, idx) => idx !== i);
                              update("portfolioImages", imgs);
                            }}
                            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Yükleme butonları — kamera ve galeri */}
                  {form.portfolioImages.length < 5 && (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Doğrudan kamera ile çek */}
                      <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/60 cursor-pointer transition-colors text-center">
                        <Camera className="h-6 w-6 text-primary" />
                        <span className="text-xs font-medium text-foreground">Kamera ile Çek</span>
                        <span className="text-[11px] text-muted-foreground">Anında çek & yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const url = ev.target?.result as string;
                              if (form.portfolioImages.length < 5) {
                                update("portfolioImages", [...form.portfolioImages, url]);
                              }
                            };
                            reader.readAsDataURL(file);
                            e.target.value = "";
                          }}
                        />
                      </label>

                      {/* Galeriden seç */}
                      <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/60 cursor-pointer transition-colors text-center">
                        <ImageIcon className="h-6 w-6 text-primary" />
                        <span className="text-xs font-medium text-foreground">Galeriden Seç</span>
                        <span className="text-[11px] text-muted-foreground">Cihazından yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            const remaining = 5 - form.portfolioImages.length;
                            files.slice(0, remaining).forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const url = ev.target?.result as string;
                                setForm((prev) => ({
                                  ...prev,
                                  portfolioImages: [...prev.portfolioImages, url].slice(0, 5),
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    En az 1 portföy görseli ekleyin. Min. 1080x1080px, JPG/PNG.
                  </p>
                </div>

                {/* Basvuru ozeti */}
                <div className="bg-muted/40 rounded-xl p-4 space-y-2 text-sm border border-border">
                  <p className="font-semibold">Basvuru Ozeti</p>
                  {[
                    { label: "Pi Hesabı", value: `@${form.piUsername}` },
                    { label: "E-posta", value: form.email },
                    { label: "Satıcı Tipi", value: form.sellerType === "individual" ? "Bireysel" : "Kurumsal" },
                    { label: "Mağaza Adı", value: form.storeName },
                    { label: "Kategori", value: form.craft },
                    { label: "Konum", value: `${form.city}, ${form.country}` },
                    { label: "Kargo Bölgeleri", value: form.shippingCountries.join(", ") },
                    { label: "Kendi Kargo", value: form.ownCargo ? "Evet" : "Hayır" },
                    { label: "Vergi/Kimlik No", value: form.taxId || "Girilmedi" },
                    { label: "KYC", value: kycStatus === "verified" ? "Doğrulandı" : "Beklemede" },
                    { label: "Canlılık Testi", value: form.livenessPhoto ? "Tamamlandı" : "Eksik" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Kurallar onayı */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-primary flex-shrink-0" checked={form.agreeTerms} onChange={(e) => update("agreeTerms", e.target.checked)} />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Platformun <strong className="text-foreground">kullanim sartlarini</strong> ve satici kurallarini okudum, kabul ediyorum. Urunlerimin gercek ve yasal oldugunu taahhut ediyorum.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-primary flex-shrink-0" checked={form.agreeKyc} onChange={(e) => update("agreeKyc", e.target.checked)} />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">KYC / Kisisel Veri</strong> politikasini onaylıyorum. Selfie ve kimlik bilgilerimin dogrulama amaciyla islenmesine izin veriyorum.
                  </span>
                </label>
              </>
            )}

            {/* Navigasyon butonları */}
            <div className="flex gap-3 pt-2 border-t border-border">
              {step > 1 && (
                <Button variant="outline" className="flex-1" onClick={() => setStep((s) => (s - 1) as Step)}>
                  Geri
                </Button>
              )}
              {step < 4 ? (
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (step === 1 && !validateStep1()) return;
                    if (step === 2 && !validateStep2()) return;
                    if (step === 3 && !validateStep3()) return;
                    setStep((s) => (s + 1) as Step);
                  }}
                >
                  Devam Et <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gonderiliyor...</> : <><Lock className="h-4 w-4" /> Basvuruyu Gonder</>}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
