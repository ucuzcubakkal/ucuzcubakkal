"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Package, Heart, MessageCircle, Bell, Settings,
  ChevronRight, ChevronDown, Star, MapPin, LogOut, ShoppingBag, Camera, Trash2,
  Download, AlertTriangle, Share2, Wallet, Edit, Plus, Home, Sparkles, MessageSquarePlus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Header } from "@/components/header";
import dynamic from "next/dynamic";
const AiChatPanel        = dynamic(() => import("@/components/ai-chat-panel").then(m => ({ default: m.AiChatPanel })), { ssr: false });
const ForumGorusPanel    = dynamic(() => import("@/components/forum-gorus-panel").then(m => ({ default: m.ForumGorusPanel })), { ssr: false });
const EscrowPaymentPanel = dynamic(() => import("@/components/escrow-payment").then(m => ({ default: m.EscrowPaymentPanel })), { ssr: false });
const QuickReorder       = dynamic(() => import("@/components/quick-reorder").then(m => ({ default: m.QuickReorder })), { ssr: false });
const SecuritySettings   = dynamic(() => import("@/components/security-settings").then(m => ({ default: m.SecuritySettings })), { ssr: false });

// ─── Mock veri ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: "ORD-001", date: "28 Şubat 2026", status: "kargoda", statusLabel: "Kargoda",
    items: [{ name: "El Dokuma Kilim Yastık", qty: 2, price: 125 }],
    total: 265, trackingNo: "TR123456789", artisan: "Ayşe Hanım Atölyesi",
  },
  {
    id: "ORD-002", date: "20 Şubat 2026", status: "teslim_edildi", statusLabel: "Teslim Edildi",
    items: [{ name: "Seramik Vazo - Turkuaz", qty: 1, price: 89 }],
    total: 104, trackingNo: "TR987654321", artisan: "Çömlek Sanatı",
  },
  {
    id: "ORD-003", date: "10 Şubat 2026", status: "hazirlaniyor", statusLabel: "Hazırlanıyor",
    items: [{ name: "Ahşap Tepsi", qty: 1, price: 156 }],
    total: 171, trackingNo: null, artisan: "Ahşap Dünyası",
  },
];

const statusColors: Record<string, string> = {
  hazirlaniyor: "bg-yellow-100 text-yellow-800",
  kargoda:      "bg-blue-100 text-blue-800",
  teslim_edildi: "bg-green-100 text-green-800",
  iptal:        "bg-red-100 text-red-800",
};

const MOCK_REVIEWS = [
  { id: "r1", product: "El Dokuma Kilim Yastık", artisan: "Ayşe Hanım Atölyesi", rating: 5, text: "Harika kalite, tam beklediğim gibi geldi. Teşekkürler!", date: "1 Mart 2026" },
  { id: "r2", product: "Seramik Vazo - Turkuaz", artisan: "Çömlek Sanatı", rating: 4, text: "Güzel ürün, kargo biraz uzun sürdü ama değdi.", date: "20 Şubat 2026" },
];

const MOCK_PROFILE_FAVORITES = [
  { id: "1", name: "El Dokuma Kilim Yastık",  artisan: "Ayşe Hanım Atölyesi", price: 125, image: "/placeholder.svg?height=200&width=200", rating: 4.9 },
  { id: "3", name: "Seramik Kupa",  artisan: "Toprak & Ateş",        price: 45,  image: "/placeholder.svg?height=200&width=200", rating: 4.8 },
  { id: "5", name: "Geleneksel Bakır Tabak",  artisan: "Bakırcı Mehmet Usta",  price: 210, image: "/placeholder.svg?height=200&width=200", rating: 4.7 },
];

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  line: string;
  isDefault: boolean;
};

const MOCK_ADDRESSES: Address[] = [
  { id: "a1", label: "Ev", fullName: "Ahmet Yılmaz", phone: "+90 532 000 0000", city: "İstanbul", district: "Kadıköy", line: "Moda Cad. No:12 D:5", isDefault: true },
  { id: "a2", label: "İş", fullName: "Ahmet Yılmaz", phone: "+90 532 000 0000", city: "İstanbul", district: "Beşiktaş", line: "Barbaros Blv. No:44 K:3", isDefault: false },
];

// ─── Suspense wrapper ─────────────────────────────────────────────────────────
export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
      <ProfilePage />
    </Suspense>
  );
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────────
function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn, logout } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const urlTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(urlTab ?? "orders");

  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);

  const [activeOrder, setActiveOrder]         = useState<string | null>(null);
  const [profileFavorites, setProfileFavorites] = useState(MOCK_PROFILE_FAVORITES);
  const [notifications, setNotifications] = useState({
    siparis: true, mesaj: true, kampanya: false, haftalik: false,
  });
  const [cancelOrderId, setCancelOrderId]     = useState<string | null>(null);
  const [orders, setOrders]                   = useState(MOCK_ORDERS);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [avatarUrl, setAvatarUrl]             = useState<string | null>(null);

  // Profil düzenleme
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileName, setProfileName]         = useState(user?.name ?? user?.piUsername ?? "");

  // Yorum yazma
  const [reviewOrder, setReviewOrder]     = useState<typeof MOCK_ORDERS[0] | null>(null);
  const [reviewRating, setReviewRating]   = useState(5);
  const [reviewText, setReviewText]       = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Yorum geçmişi düzenleme
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [editReview, setEditReview] = useState<typeof MOCK_REVIEWS[0] | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);

  // Adres defteri
  const [addresses, setAddresses]         = useState<Address[]>(MOCK_ADDRESSES);
  const [addressDialog, setAddressDialog] = useState(false);
  const [editAddress, setEditAddress]     = useState<Address | null>(null);
  const [newAddress, setNewAddress]       = useState<Omit<Address, "id" | "isDefault">>({
    label: "", fullName: "", phone: "", city: "", district: "", line: "",
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-4">
          <p className="text-xl font-semibold">Giriş yapmanız gerekiyor</p>
          <Link href="/giris"><Button>Giriş Yap</Button></Link>
        </div>
      </div>
    );
  }

  const initials = (user?.piUsername ?? "U").slice(0, 2).toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleExportData = () => {
    const data = {
      kullanici: { ad: user?.name ?? user?.piUsername, piKullanici: user?.piUsername, piId: user?.piUid, rol: user?.role },
      siparisler: orders, favoriler: profileFavorites,
      dışaAktarilmaTarihi: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ucuzcubakkal-verilerim-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Verileriniz indirildi", duration: 3000 });
  };

  const handleDeleteAccount = () => {
    logout();
    router.push("/");
    toast({ title: "Hesap silindi", duration: 4000 });
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) =>
      o.id === orderId ? { ...o, status: "iptal", statusLabel: "İptal Edildi" } : o
    ));
    setCancelOrderId(null);
    toast({ title: "Sipariş iptal edildi", duration: 3000 });
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim() || !reviewOrder) return;
    setReviewSubmitting(true);
    setTimeout(() => {
      setReviewSubmitting(false);
      setReviewOrder(null);
      setReviewText("");
      setReviewRating(5);
      toast({ title: "Yorumunuz gönderildi", description: "Teşekkürler! Yorumunuz incelendikten sonra yayınlanacak.", duration: 4000 });
    }, 1000);
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Yorum silindi", duration: 2000 });
  };

  const handleEditReviewOpen = (review: typeof MOCK_REVIEWS[0]) => {
    setEditReview(review);
    setEditReviewText(review.text);
    setEditReviewRating(review.rating);
  };

  const handleSaveEditReview = () => {
    if (!editReview) return;
    setReviews((prev) => prev.map((r) => r.id === editReview.id ? { ...r, text: editReviewText, rating: editReviewRating } : r));
    setEditReview(null);
    toast({ title: "Yorum güncellendi", duration: 2000 });
  };

  // Profil tamamlanma yüzdesi
  const profileFields = [
    !!avatarUrl,
    !!(profileName || user?.piUsername),
    addresses.length > 0,
    orders.length > 0,
    reviews.length > 0,
  ];
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  // Fatura indirme
  const handleDownloadInvoice = (order: typeof MOCK_ORDERS[0]) => {
    const lines = [
      "UCUZCU BAKKAL - SİPARİŞ FATURASI",
      "=".repeat(40),
      `Sipariş No : ${order.id}`,
      `Tarih      : ${order.date}`,
      `Satici     : ${order.artisan}`,
      "-".repeat(40),
      ...order.items.map((i) => `${i.name} x${i.qty}  ${i.price * i.qty}π`),
      "-".repeat(40),
      `TOPLAM     : ${order.total}π`,
      "=".repeat(40),
      "Teşekkürler! ucuzcubakkal.com",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fatura-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Fatura indirildi", description: `${order.id} nolu fatura kaydedildi.`, duration: 2500 });
  };

  const handleAddAllToCart = () => {
    profileFavorites.forEach((item) => {
      addItem({ productId: Number(item.id), name: item.name, artisan: item.artisan, price: item.price, quantity: 1, image: item.image });
    });
    toast({ title: `${profileFavorites.length} ürün sepete eklendi`, duration: 2500 });
  };

  const handleSaveAddress = () => {
    if (editAddress) {
      setAddresses((prev) => prev.map((a) => a.id === editAddress.id ? editAddress : a));
      toast({ title: "Adres güncellendi", duration: 2000 });
    } else {
      setAddresses((prev) => [...prev, { ...newAddress, id: String(Date.now()), isDefault: prev.length === 0 }]);
      toast({ title: "Adres eklendi", duration: 2000 });
    }
    setAddressDialog(false);
    setEditAddress(null);
    setNewAddress({ label: "", fullName: "", phone: "", city: "", district: "", line: "" });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Adres silindi", duration: 2000 });
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Profil düzenleme dialogu */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Profili Düzenle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Görünen Ad</Label>
              <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Adınız" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Vazgec</Button></DialogClose>
            <Button onClick={() => { setEditProfileOpen(false); toast({ title: "Profil güncellendi", duration: 2000 }); }}>
              Kaydet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Yorum yazma dialogu */}
      <Dialog open={!!reviewOrder} onOpenChange={(o) => { if (!o) { setReviewOrder(null); setReviewText(""); setReviewRating(5); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yorum Yaz</DialogTitle>
          </DialogHeader>
          {reviewOrder && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{reviewOrder.items[0]?.name}</span> — {reviewOrder.artisan}
              </p>
              {/* Yıldız puanı */}
              <div className="space-y-2">
                <Label>Puanınız</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setReviewRating(n)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={`h-7 w-7 ${n <= reviewRating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium self-center">{reviewRating}/5</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Yorumunuz *</Label>
                <Textarea
                  rows={4}
                  placeholder="Ürün hakkında deneyiminizi paylaşın..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">{reviewText.length}/500</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Vazgec</Button></DialogClose>
            <Button onClick={handleSubmitReview} disabled={!reviewText.trim() || reviewSubmitting}>
              {reviewSubmitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Yorum düzenleme dialogu */}
      <Dialog open={!!editReview} onOpenChange={(o) => { if (!o) setEditReview(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Yorumu Düzenle</DialogTitle></DialogHeader>
          {editReview && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground font-medium">{editReview.product}</p>
              <div className="space-y-2">
                <Label>Puanınız</Label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} onClick={() => setEditReviewRating(n)} className="transition-transform hover:scale-110">
                      <Star className={`h-7 w-7 ${n <= editReviewRating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Yorumunuz</Label>
                <Textarea rows={4} value={editReviewText} onChange={(e) => setEditReviewText(e.target.value)} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Vazgec</Button></DialogClose>
            <Button onClick={handleSaveEditReview} disabled={!editReviewText.trim()}>Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sipariş iptal onayı */}
      <AlertDialog open={!!cancelOrderId} onOpenChange={(o) => { if (!o) setCancelOrderId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siparişi iptal etmek istediğinizden emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Sipariş hazırlanma aşamasındadır. İptal sonrası para iadesi 3-5 iş günü içinde yapılır.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Geri Don</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelOrderId && handleCancelOrder(cancelOrderId)}
            >
              Evet, İptal Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Adres ekleme / düzenleme dialogu */}
      <Dialog open={addressDialog} onOpenChange={(o) => { setAddressDialog(o); if (!o) { setEditAddress(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {(["label", "fullName", "phone", "city", "district", "line"] as const).map((field) => {
              const labels: Record<string, string> = {
                label: "Adres Etiketi (Ev, İş...)", fullName: "Ad Soyad", phone: "Telefon",
                city: "Şehir", district: "İlçe", line: "Açık Adres",
              };
              const val = editAddress ? editAddress[field] : newAddress[field];
              const onChange = (v: string) => {
                if (editAddress) setEditAddress({ ...editAddress, [field]: v });
                else setNewAddress({ ...newAddress, [field]: v });
              };
              return (
                <div key={field} className="space-y-1.5">
                  <Label>{labels[field]}</Label>
                  {field === "line"
                    ? <Textarea rows={2} value={val} onChange={(e) => onChange(e.target.value)} />
                    : <Input value={val} onChange={(e) => onChange(e.target.value)} />
                  }
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Vazgec</Button></DialogClose>
            <Button onClick={handleSaveAddress}>Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-4">

        {/* Profil kartı */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-18 w-18 h-[72px] w-[72px]">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow"
                >
                  <Camera className="h-3 w-3" />
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold">{profileName || user?.piUsername}</h2>
                <p className="text-muted-foreground text-sm flex items-center gap-1">
                  <span className="text-primary font-bold">π</span>
                  @{user?.piUsername ?? "—"}
                </p>
                {user?.piUid && (
                  <Badge variant="secondary" className="mt-1 text-xs font-mono">
                    Pi ID: {user.piUid.slice(0, 10)}…
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditProfileOpen(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Duzenle
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Sipariş</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{profileFavorites.length}</p>
                <p className="text-xs text-muted-foreground">Favori</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground">Yorum</p>
              </div>
            </div>

            {/* Profil tamamlanma */}
            {profileCompletion < 100 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Profil Tamamlanma</span>
                  <span className="text-xs font-bold text-primary">%{profileCompletion}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {!avatarUrl && "Profil fotoğrafı ekle · "}
                  {addresses.length === 0 && "Adres ekle · "}
                  {reviews.length === 0 && "İlk yorumunu yaz"}
                </p>
              </div>
            )}

            {/* Pi cüzdan özeti */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Pi Cüzdanı</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Toplam Harcanan", value: `${orders.reduce((s, o) => s + o.total, 0)}π` },
                  { label: "Bakkal Puanı",    value: "1.250" },
                  { label: "Aktif Kupon",     value: "2 adet" },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/40 rounded-lg p-2.5 text-center">
                    <p className="font-bold text-sm text-primary">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-4">
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="favorites">Favoriler</TabsTrigger>
            <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
            <TabsTrigger value="addresses">Adresler</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            <TabsTrigger value="ai-asistan" className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Asistan</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center gap-1">
              <MessageSquarePlus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Görüş</span>
              <span className="sm:hidden">Görüş</span>
            </TabsTrigger>
          </TabsList>

          {/* Siparişler */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex gap-1.5 flex-wrap">
              {[
                { key: "all", label: "Tümü" },
                { key: "hazirlaniyor", label: "Hazırlanıyor" },
                { key: "kargoda", label: "Kargoda" },
                { key: "teslim_edildi", label: "Teslim Edildi" },
                { key: "iptal", label: "İptal" },
              ].map(({ key, label }) => (
                <Button key={key} size="sm" variant={orderStatusFilter === key ? "default" : "ghost"}
                  className="h-7 text-xs px-2.5"
                  onClick={() => setOrderStatusFilter(key)}>
                  {label}
                  {key !== "all" && (
                    <span className="ml-1 opacity-60 text-[10px]">({orders.filter((o) => o.status === key).length})</span>
                  )}
                </Button>
              ))}
            </div>
            {(orderStatusFilter === "all" ? orders : orders.filter((o) => o.status === orderStatusFilter)).map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setActiveOrder(activeOrder === order.id ? null : order.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/siparis/${order.id}`} onClick={(e) => e.stopPropagation()} className="font-semibold text-sm text-primary hover:underline">
                        {order.id}
                      </Link>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                          {order.statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">{order.total}π</span>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${activeOrder === order.id ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {activeOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{item.name} x{item.qty}</span>
                          <span className="font-medium">{item.price * item.qty}π</span>
                        </div>
                      ))}
                      <Separator className="my-3" />
                      {order.trackingNo ? (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Takip No:</span>
                          <a
                            href={`https://www.ptt.gov.tr/tr/bireysel/gonderitakip?barcode=${order.trackingNo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary underline-offset-2 hover:underline"
                          >
                            {order.trackingNo}
                          </a>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Kargo henüz oluşturulmadı</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline" size="sm" className="flex-1"
                          onClick={() => {
                            order.items.forEach((item) => {
                              addItem({ productId: Number(order.id.replace("ORD-", "")), name: item.name, artisan: order.artisan, price: item.price, quantity: item.qty, image: "/placeholder.svg?height=200&width=200" });
                            });
                          }}
                        >
                          Tekrar Sipariş Ver
                        </Button>
                        <Button
                          variant="ghost" size="sm" className="px-2"
                          title="Faturayı İndir"
                          onClick={() => handleDownloadInvoice(order)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="sm" className="px-2"
                          title="Siparişi Paylaş"
                          onClick={() => {
                            const text = `Ucuzcu Bakkal'dan ${order.items[0]?.name} aldım! ${order.total}π değerinde. #UcuzcuBakkal #PiNetwork`;
                            if (navigator.share) {
                              navigator.share({ title: "Ucuzcu Bakkal Siparişim", text });
                            } else {
                              navigator.clipboard.writeText(text);
                              toast({ title: "Panoya kopyalandı", duration: 2000 });
                            }
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        {order.status === "teslim_edildi" && (
                          <Button size="sm" className="flex-1" onClick={() => setReviewOrder(order)}>
                            Yorum Yaz
                          </Button>
                        )}
                        {order.status === "hazirlaniyor" && (
                          <Button variant="destructive" size="sm" className="flex-1" onClick={() => setCancelOrderId(order.id)}>
                            İptal Et
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Guvenli Emanet Sistemi */}
            <EscrowPaymentPanel />

            {/* Hizli Yeniden Siparis */}
            <QuickReorder />

          </TabsContent>

          {/* Favoriler */}
          <TabsContent value="favorites" className="space-y-3">
            {profileFavorites.length > 1 && (
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleAddAllToCart}>
                <ShoppingBag className="h-4 w-4" />
                Tümünü Sepete Ekle ({profileFavorites.length} ürün)
              </Button>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{profileFavorites.length} ürün kaydedildi</p>
              <Link href="/favoriler" className="text-xs text-primary font-medium hover:underline">Tümünü gör</Link>
            </div>
            {profileFavorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="bg-accent p-4 rounded-full">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium">Henüz favori ürün yok</p>
                <p className="text-sm text-muted-foreground">Beğendiğiniz ürünleri favorilere ekleyin</p>
                <Link href="/"><Button size="sm" variant="outline">Ürünleri Keşfet</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profileFavorites.map((fav) => (
                  <Card key={fav.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/urun/${fav.id}`}>
                          <img src={fav.image} alt={fav.name} className="h-16 w-16 rounded-lg object-cover bg-muted flex-shrink-0" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/urun/${fav.id}`}>
                            <p className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors">{fav.name}</p>
                          </Link>
                          <p className="text-xs text-muted-foreground">{fav.artisan}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-xs font-medium">{fav.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-primary text-sm">{fav.price}π</span>
                          <div className="flex gap-1">
                            <Button size="icon" variant="outline" className="h-7 w-7"
                              onClick={() => addItem({ productId: Number(fav.id), name: fav.name, artisan: fav.artisan, price: fav.price, quantity: 1, image: fav.image })}
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => setProfileFavorites((prev) => prev.filter((f) => f.id !== fav.id))}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Yorum Geçmişi */}
          <TabsContent value="reviews" className="space-y-3">
            <p className="text-sm text-muted-foreground">{reviews.length} yorum yazıldı</p>
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="bg-accent p-4 rounded-full">
                  <Star className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium">Henüz yorum yazılmadı</p>
                <p className="text-sm text-muted-foreground">Aldığınız ürünlere yorum yazarak diğer kullanıcılara yardımcı olun</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{review.product}</p>
                          <p className="text-xs text-muted-foreground">{review.artisan}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map((n) => (
                              <Star key={n} className={`h-3.5 w-3.5 ${n <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-primary"
                            onClick={() => handleEditReviewOpen(review)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteReview(review.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Adres Defteri */}
          <TabsContent value="addresses" className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{addresses.length} kayıtlı adres</p>
              <Button size="sm" variant="outline" onClick={() => { setEditAddress(null); setAddressDialog(true); }}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Yeni Adres
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="bg-accent p-4 rounded-full">
                  <Home className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium">Kayıtlı adres yok</p>
                <Button size="sm" variant="outline" onClick={() => setAddressDialog(true)}>Adres Ekle</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <Card key={addr.id} className={addr.isDefault ? "border-primary/40" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{addr.label}</span>
                            {addr.isDefault && <Badge variant="secondary" className="text-xs h-4 px-1.5">Varsayılan</Badge>}
                          </div>
                          <p className="text-sm">{addr.fullName}</p>
                          <p className="text-xs text-muted-foreground">{addr.phone}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{addr.line}, {addr.district} / {addr.city}</p>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <Button size="sm" variant="ghost" className="h-7 text-xs"
                            onClick={() => { setEditAddress({ ...addr }); setAddressDialog(true); }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Duzenle
                          </Button>
                          {!addr.isDefault && (
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleSetDefault(addr.id)}>
                              Varsayılan Yap
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAddress(addr.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Sil
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ayarlar */}
          <TabsContent value="settings" className="space-y-3">

            {/* Bildirim tercihleri */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Bildirim Tercihleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { key: "siparis" as const,  label: "Sipariş Güncellemeleri", desc: "Kargo ve teslimat bildirimleri" },
                  { key: "mesaj"   as const,  label: "Yeni Mesaj",             desc: "Satıcıdan gelen mesajlar"       },
                  { key: "kampanya" as const, label: "Kampanyalar",             desc: "İndirim ve fırsat bildirimleri" },
                  { key: "haftalik" as const, label: "Haftalık Özet",           desc: "Sipariş ve puan özeti maili"   },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={notifications[key]}
                      onCheckedChange={(v) => {
                        setNotifications((prev) => ({ ...prev, [key]: v }));
                        toast({ title: `${label} bildirimleri ${v ? "açıldı" : "kapatıldı"}`, duration: 2000 });
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {[
              { icon: MessageCircle, label: "Mesajlarım",         href: "/mesajlar"    },
              { icon: Star,          label: "Bakkal Puanlarım",   href: "/puanlar"     },
              { icon: Package,       label: "İade ve Değişim",    href: "/iade"        },
              { icon: Heart,         label: "Arkadaşını Getir",   href: "/referans"    },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent p-2 rounded-full">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Veri dışa aktarma */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-accent p-2 rounded-full flex-shrink-0">
                    <Download className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Verilerimi İndir</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sipariş geçmişi ve favoriler JSON formatında.</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleExportData}>İndir</Button>
                </div>
              </CardContent>
            </Card>

            {/* Güvenlik Ayarları (2FA + Pi Cüzdanı) */}
            <SecuritySettings />

            <Button variant="outline" className="w-full" onClick={() => { logout(); router.push("/"); }}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Hesabımı Sil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hesabınızı silmek istediğinizden emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem geri alınamaz. Tüm siparişleriniz, favorileriniz ve puan geçmişiniz kalıcı olarak silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Vazgec</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteAccount}>
                    Evet, Hesabımı Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* ── AI Asistan ── */}
          <TabsContent value="ai-asistan" className="mt-0">
            <Card>
              <CardContent className="p-4 h-[560px] flex flex-col">
                <AiChatPanel
                  apiEndpoint="/api/musteri-ai"
                  userName={user?.name ?? user?.piUsername}
                  userGender="male"
                  title="Müşteri AI Asistanı"
                  subtitle="Siparişler, iadeler, hesap işlemleri hakkında yardımcı olabilirim."
                  quickQuestions={[
                    "Siparişimi nasıl takip ederim?",
                    "İade nasıl yapabilirim?",
                    "Pi ile nasıl ödeme yaparım?",
                    "Favorilerimi nasıl yönetirim?",
                    "Bakkal puanlarım nerede?",
                    "Hesabımı nasıl güvence altına alırım?",
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Forum / Görüş & Öneri ── */}
          <TabsContent value="forum" className="mt-0">
            <Card>
              <CardContent className="p-4">
                <ForumGorusPanel
                  from="musteri"
                  userName={user?.name ?? user?.piUsername ?? ""}
                  userId={user?.piUid ?? ""}
                />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
