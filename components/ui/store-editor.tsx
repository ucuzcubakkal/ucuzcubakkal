"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GripVertical, Upload, X, Check,
  MapPin, Store, Palette, Video, Image as ImageIcon,
  ChevronUp, ChevronDown, Eye, Link as LinkIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ── Tipler ───────────────────────────────────────────────────────────────────
type CategoryItem = { id: string; label: string; icon: string; active: boolean };

type Theme = {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  previewBg: string;
};

// ── Hazır Temalar ────────────────────────────────────────────────────────────
const THEMES: Theme[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Temiz çizgiler, lacivert tonlar",
    primary: "#1e3a8a",
    secondary: "#dbeafe",
    accent: "#f59e0b",
    bg: "#f8fafc",
    text: "#0f172a",
    previewBg: "bg-gradient-to-br from-blue-900 to-blue-700",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Sıcak toprak tonları, nostaljik his",
    primary: "#92400e",
    secondary: "#fef3c7",
    accent: "#d97706",
    bg: "#fffbeb",
    text: "#1c1917",
    previewBg: "bg-gradient-to-br from-amber-800 to-amber-600",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Sade, monokrom, odaklanmış",
    primary: "#18181b",
    secondary: "#f4f4f5",
    accent: "#71717a",
    bg: "#ffffff",
    text: "#09090b",
    previewBg: "bg-gradient-to-br from-zinc-900 to-zinc-700",
  },
  {
    id: "natural",
    name: "Doğal",
    description: "Yeşil tonlar, organik his",
    primary: "#166534",
    secondary: "#dcfce7",
    accent: "#16a34a",
    bg: "#f0fdf4",
    text: "#14532d",
    previewBg: "bg-gradient-to-br from-green-800 to-green-600",
  },
];

// ── Bileşen ───────────────────────────────────────────────────────────────────
export function StoreEditor({ onSave }: { onSave?: () => void }) {
  const { toast } = useToast();

  // Mağaza bilgileri
  const [storeName, setStoreName] = useState("Ayşe Hanım Atölyesi");
  const [bio, setBio] = useState("Geleneksel el sanatlarını modern tasarımlarla buluşturuyoruz. 15 yıllık tecrübemizle özgün ürünler üretiyoruz.");
  const [location, setLocation] = useState("İstanbul, Türkiye");
  const [website,   setWebsite]   = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook,  setFacebook]  = useState("");
  const [twitterX,  setTwitterX]  = useState("");

  // Logo & kapak
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverVideoUrl, setCoverVideoUrl] = useState<string | null>(null);
  const [coverType, setCoverType] = useState<"image" | "video">("image");
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Tema
  const [selectedTheme, setSelectedTheme] = useState<string>("modern");

  // Tüm site kategorileri — çoklu seçim + sıralama
  const ALL_CATEGORIES: CategoryItem[] = [
    { id: "elektronik",    label: "Elektronik",              icon: "💻", active: false },
    { id: "giyim",         label: "Giyim & Moda",            icon: "👗", active: false },
    { id: "ayakkabi",      label: "Ayakkabı & Çanta",        icon: "👜", active: false },
    { id: "ev-yasam",      label: "Ev & Yaşam",              icon: "🏠", active: false },
    { id: "kozmetik",      label: "Kozmetik & Kişisel Bakım",icon: "💄", active: false },
    { id: "spor",          label: "Spor & Outdoor",          icon: "⚽", active: false },
    { id: "kitap",         label: "Kitap, Müzik & Film",     icon: "📚", active: false },
    { id: "oyuncak",       label: "Oyuncak & Hobi",          icon: "🎮", active: false },
    { id: "otomotiv",      label: "Otomotiv & Aksesuar",     icon: "🚗", active: false },
    { id: "bahce",         label: "Bahçe & Yapı Market",     icon: "🌱", active: false },
    { id: "gida",          label: "Gıda & İçecek",           icon: "🍎", active: false },
    { id: "anne-cocuk",    label: "Anne & Çocuk",            icon: "👶", active: false },
    { id: "ofis",          label: "Ofis & Kırtasiye",        icon: "📎", active: false },
    { id: "seyahat",       label: "Seyahat & Bavul",         icon: "✈️", active: false },
    { id: "muzik-aleti",   label: "Müzik Aletleri",          icon: "🎸", active: false },
    { id: "tekstil",       label: "Tekstil & Dokuma",        icon: "🧵", active: false },
    { id: "seramik",       label: "Seramik & Kil",           icon: "🏺", active: false },
    { id: "ahsap",         label: "Ahşap El Yapımı",         icon: "🪵", active: false },
    { id: "taki",          label: "Takı & Aksesuar",         icon: "💍", active: false },
    { id: "tablo-sanat",   label: "Tablo & Sanat Eseri",     icon: "🎨", active: false },
    { id: "dijital",       label: "Dijital Ürün & NFT",      icon: "🖥️", active: false },
    { id: "koleksiyon",    label: "Koleksiyon & Antika",     icon: "🏛️", active: false },
    { id: "saglik",        label: "Sağlık & Wellness",       icon: "💊", active: false },
    { id: "evcil",         label: "Evcil Hayvan",            icon: "🐾", active: false },
    { id: "parti",         label: "Parti & Etkinlik",        icon: "🎉", active: false },
  ];

  const [categories, setCategories] = useState<CategoryItem[]>(ALL_CATEGORIES);

  const toggleCategoryActive = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  // Sürüklenen öge
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const handleDragStart = (i: number) => { dragIndex.current = i; };
  const handleDragEnter = (i: number) => { dragOverIndex.current = i; };
  const handleDragEnd = () => {
    if (dragIndex.current === null || dragOverIndex.current === null) return;
    const next = [...categories];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(dragOverIndex.current, 0, moved);
    setCategories(next);
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  // Yukarı/aşağı buton sıralaması (mobil için)
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...categories];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setCategories(next);
  };
  const moveDown = (i: number) => {
    if (i === categories.length - 1) return;
    const next = [...categories];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setCategories(next);
  };

  // Dosya yükleme yardımcısı
  const pickFile = useCallback((
    accept: string,
    onResult: (url: string, file: File) => void,
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        onResult(url, file);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, []);

  // Logo yükleme
  const handleLogoPick = () => {
    pickFile("image/jpeg,image/png,image/webp", (url) => setLogoUrl(url));
  };

  // Kapak resim yükleme
  const handleCoverImagePick = () => {
    pickFile("image/jpeg,image/png,image/webp", (url) => {
      setCoverUrl(url);
      setCoverType("image");
      setCoverVideoUrl(null);
    });
  };

  // Kapak video yükleme (max 10 sn)
  const handleCoverVideoPick = () => {
    pickFile("video/mp4,video/webm", (url, file) => {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        if (video.duration > 10) {
          toast({
            title: "Video cok uzun",
            description: "Kapak videosu en fazla 10 saniye olabilir.",
            variant: "destructive",
          });
          return;
        }
        setCoverVideoUrl(url);
        setCoverType("video");
        setCoverUrl(null);
      };
      video.src = url;
    });
  };

  const handleSave = () => {
    toast({
      title: "Magaza guncellendi",
      description: "Tum degisiklikleriniz basariyla kaydedildi.",
      duration: 3000,
    });
    onSave?.();
  };

  const activeTheme = THEMES.find((t) => t.id === selectedTheme) ?? THEMES[0];

  return (
    <div className="space-y-6">

      {/* ── Önizleme Şeridi ─────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-2 border-primary/20">
        <div
          className={cn("relative h-40 w-full", activeTheme.previewBg)}
          style={{ backgroundColor: activeTheme.primary }}
        >
          {/* Kapak içeriği */}
          {coverType === "image" && coverUrl ? (
            <img src={coverUrl} alt="Kapak" className="absolute inset-0 w-full h-full object-cover" />
          ) : coverType === "video" && coverVideoUrl ? (
            <video
              src={coverVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Store className="h-16 w-16 text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Logo */}
          <div className="absolute -bottom-8 left-4">
            <div
              className="h-16 w-16 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: activeTheme.primary }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                storeName.charAt(0)
              )}
            </div>
          </div>

          {/* Önizleme etiketi */}
          <div className="absolute top-2 right-2">
            <Badge className="text-[10px] bg-black/40 text-white border-0 backdrop-blur-sm">
              <Eye className="h-3 w-3 mr-1" /> Önizleme
            </Badge>
          </div>
        </div>

        <CardContent className="pt-10 pb-4 px-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h3 className="font-bold text-base leading-tight" style={{ color: activeTheme.text }}>
                {storeName || "Mağaza Adı"}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {location || "Konum"}
              </p>
            </div>
            <div className="flex gap-1">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: activeTheme.primary }} />
              <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: activeTheme.accent }} />
              <div className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: activeTheme.secondary }} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {bio || "Mağaza açıklaması buraya gelecek..."}
          </p>
        </CardContent>
      </Card>

      {/* ── Logo & Kapak ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" /> Logo & Kapak Görseli
          </CardTitle>
          <CardDescription className="text-xs">
            Logo: kare (1:1), dairesel çerçevede gösterilir. Kapak: 1200x400px önerilir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors flex-shrink-0"
              onClick={handleLogoPick}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mağaza Logosu</p>
              <p className="text-xs text-muted-foreground">PNG veya JPG, min 400x400px</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleLogoPick}>
                  {logoUrl ? "Değiştir" : "Yükle"}
                </Button>
                {logoUrl && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => setLogoUrl(null)}>
                    Kaldır
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Kapak: resim veya video */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Kapak Görseli / Videosu</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={coverType === "image" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={handleCoverImagePick}
              >
                <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                Resim Yükle
              </Button>
              <Button
                variant={coverType === "video" && coverVideoUrl ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={handleCoverVideoPick}
              >
                <Video className="h-3.5 w-3.5 mr-1.5" />
                Video Yükle (maks 10sn)
              </Button>
            </div>
            {coverVideoUrl && coverType === "video" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                <Video className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>Kapak videosu yüklendi — otomatik oynar, sessiz.</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 ml-auto text-destructive"
                  onClick={() => { setCoverVideoUrl(null); setCoverType("image"); }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              Video: MP4/WebM, maks 10 saniye, otomatik döngü ve sessiz oynar. Global etkileşimi artırır.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Mağaza Bilgileri ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" /> Mağaza Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Mağaza Adı</Label>
              <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Atölyenizin adı" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Konum (Şehir / Ülke)</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="İstanbul, Türkiye" className="pl-8" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs flex items-center justify-between">
              Mağaza Açıklaması
              <span className={cn("text-[10px]", bio.length > 140 ? "text-destructive" : "text-muted-foreground")}>
                {bio.length}/150
              </span>
            </Label>
            <Textarea
              value={bio}
              onChange={(e) => { if (e.target.value.length <= 150) setBio(e.target.value); }}
              placeholder="Mağazanızı kısaca tanıtın..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> Sosyal Medya & Web</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Website</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://magazaniz.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Instagram</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">@</span>
                  <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="kullanici_adi" className="pl-7" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Facebook</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">fb/</span>
                  <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="sayfa_adi" className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">X (Twitter)</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">@</span>
                  <Input value={twitterX} onChange={(e) => setTwitterX(e.target.value)} placeholder="kullanici_adi" className="pl-7" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Hazır Temalar ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> Mağaza Teması
          </CardTitle>
          <CardDescription className="text-xs">
            Hazır renk şablonlarından birini seçin. Seçiminiz mağaza önizlemesine anında yansır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={cn(
                  "relative rounded-xl border-2 overflow-hidden transition-all text-left",
                  selectedTheme === theme.id
                    ? "border-primary shadow-md ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40",
                )}
              >
                {/* Renk önizleme */}
                <div className={cn("h-16 w-full", theme.previewBg)} />
                {/* Renk noktaları */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: theme.accent }} />
                  <div className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: theme.secondary }} />
                </div>
                {/* Seçim ikonu */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-1.5 left-1.5 bg-primary rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs font-semibold">{theme.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{theme.description}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Kategori Sıralaması ──────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-primary" /> Kategori Sıralaması
          </CardTitle>
          <CardDescription className="text-xs">
            Satmak istediğiniz kategorileri seçin (çoklu seçim yapabilirsiniz). Seçili kategorileri sürükle-bırak veya oklarla sıralayın. En üstteki mağazanızda ilk sırada görünür.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{categories.filter(c => c.active).length}</span> kategori seçildi
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCategories(prev => prev.map(c => ({ ...c, active: true })))}
                className="text-xs text-primary underline-offset-2 hover:underline"
              >
                Tümünü seç
              </button>
              <span className="text-muted-foreground">·</span>
              <button
                onClick={() => setCategories(prev => prev.map(c => ({ ...c, active: false })))}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Temizle
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                draggable={cat.active}
                onDragStart={() => cat.active && handleDragStart(i)}
                onDragEnter={() => cat.active && handleDragEnter(i)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border bg-card transition-all select-none",
                  cat.active
                    ? "border-primary/40 bg-primary/5 cursor-grab active:cursor-grabbing"
                    : "border-border opacity-60 cursor-default",
                  i === 0 && cat.active ? "ring-1 ring-primary/20" : "",
                )}
              >
                {/* Onay kutusu */}
                <button
                  onClick={() => toggleCategoryActive(cat.id)}
                  className={cn(
                    "h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    cat.active ? "bg-primary border-primary" : "bg-background border-border hover:border-primary/60"
                  )}
                >
                  {cat.active && <Check className="h-3 w-3 text-primary-foreground" />}
                </button>

                {/* Sürükleme ikonu — sadece aktifken */}
                <GripVertical className={cn("h-4 w-4 flex-shrink-0", cat.active ? "text-muted-foreground" : "text-muted-foreground/30")} />

                {/* Sıra no — sadece aktifse */}
                {cat.active && (
                  <span className="text-xs font-bold w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    {categories.filter(c => c.active).findIndex(c => c.id === cat.id) + 1}
                  </span>
                )}

                {/* İkon & isim */}
                <span className="text-lg flex-shrink-0">{cat.icon}</span>
                <span className="text-sm font-medium flex-1">{cat.label}</span>

                {/* Aktif toggle */}
                <button
                  onClick={() => {
                    const next = [...categories];
                    next[i] = { ...cat, active: !cat.active };
                    setCategories(next);
                  }}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors",
                    cat.active
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {cat.active ? "Görünür" : "Gizli"}
                </button>

                {/* Yukarı / Aşağı (mobil) */}
                <div className="flex flex-col gap-0.5 md:hidden">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="text-muted-foreground disabled:opacity-30">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => moveDown(i)} disabled={i === categories.length - 1} className="text-muted-foreground disabled:opacity-30">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Masaüstünde sürükle-bırak, mobilde ok tuşlarını kullanın.
          </p>
        </CardContent>
      </Card>

      {/* ── Kaydet ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-3 pb-4">
        <Button variant="outline" onClick={() => toast({ title: "Degisiklikler iptal edildi", duration: 2000 })}>
          Iptal
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Check className="h-4 w-4" />
          Magaza Ayarlarini Kaydet
        </Button>
      </div>
    </div>
  );
}
