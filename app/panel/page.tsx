"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus, Package, ShoppingCart, MessageSquare, BarChart3,
  Edit, Trash2, TrendingUp, Star, ArrowUpRight, ArrowDownRight,
  Users, Eye, ChevronDown, CheckCircle2, Truck, Moon, Download,
  Copy, Search, Upload, FileCode, AlertCircle, CheckCircle, X,
  Loader2, Link2, Image as ImageIcon,
  RefreshCw, Clock, ArrowRightLeft, GripVertical, AlertTriangle, Rss,
  Play, Pause, CheckCircle2 as CheckCircle2Icon, XCircle, Info, Sparkles, MessageSquarePlus,
} from "lucide-react";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import dynamic from "next/dynamic";
const AiChatPanel       = dynamic(() => import("@/components/ai-chat-panel").then(m => ({ default: m.AiChatPanel })), { ssr: false });
const ForumGorusPanel   = dynamic(() => import("@/components/forum-gorus-panel").then(m => ({ default: m.ForumGorusPanel })), { ssr: false });
const SalesForecast     = dynamic(() => import("@/components/sales-forecast").then(m => ({ default: m.SalesForecast })), { ssr: false });
const CustomerSegments  = dynamic(() => import("@/components/customer-segments").then(m => ({ default: m.CustomerSegments })), { ssr: false });
const BundleManager     = dynamic(() => import("@/components/bundle-product").then(m => ({ default: m.BundleProductManager })), { ssr: false });
const SeoMetaEditor     = dynamic(() => import("@/components/seo-meta-editor").then(m => ({ default: m.SeoMetaEditor })), { ssr: false });
const HolidayModeCard    = dynamic(() => import("@/components/seller-trust").then(m => ({ default: m.HolidayModeCard })), { ssr: false });
const StockAlertSettings = dynamic(() => import("@/components/seller-trust").then(m => ({ default: m.StockAlertSettings })), { ssr: false });
const CsvImportTool      = dynamic(() => import("@/components/panel-tools").then(m => ({ default: m.CsvImportTool })), { ssr: false });
const BulkPriceTool      = dynamic(() => import("@/components/panel-tools").then(m => ({ default: m.BulkPriceTool })), { ssr: false });
const CouponGenerator    = dynamic(() => import("@/components/panel-tools").then(m => ({ default: m.CouponGenerator })), { ssr: false });
const StoreFrontVideo    = dynamic(() => import("@/components/panel-tools").then(m => ({ default: m.StoreFrontVideo })), { ssr: false });
const SellerCertificate  = dynamic(() => import("@/components/seller-certificate").then(m => ({ default: m.SellerCertificate })), { ssr: false });
const AutoTranslate      = dynamic(() => import("@/components/auto-translate").then(m => ({ default: m.AutoTranslate })), { ssr: false });
import { MediaUpload, type MediaUploadValue } from "@/components/media-upload";
import { StoreEditor } from "@/components/store-editor";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// ── Tipler ────────────────────────────────────────────────────────
type Product = {
  id: number; name: string; description?: string;
  price: number; stock: number; sold: number; rating: number;
  category?: string; subcategory?: string;
  status: "active" | "draft";
  image: string; images?: string[]; video?: string | null;
  views: number;
};

type Order = {
  id: number; product: string; customer: string;
  quantity: number; total: number;
  status: "pending" | "shipped" | "delivered";
  date: string; customerNote?: string;
  productImage: string; trackingNo?: string;
};

const STATUS_MAP = {
  pending:   { label: "Bekliyor",       variant: "outline"    as const },
  shipped:   { label: "Gönderildi",     variant: "default"    as const },
  delivered: { label: "Teslim Edildi",  variant: "secondary"  as const },
};

const STATUS_TRANSITIONS: Record<Order["status"], { next: Order["status"]; label: string } | null> = {
  pending:   { next: "shipped",   label: "Gönder"     },
  shipped:   { next: "delivered", label: "Teslim Et"  },
  delivered: null,
};

const MONTHLY_DATA = [
  { label: "Ağu", sales: 12, revenue: 1440, views: 320 },
  { label: "Eyl", sales: 18, revenue: 2160, views: 490 },
  { label: "Eki", sales: 15, revenue: 1800, views: 410 },
  { label: "Kas", sales: 22, revenue: 2640, views: 580 },
  { label: "Ara", sales: 30, revenue: 3600, views: 740 },
  { label: "Oca", sales: 28, revenue: 3360, views: 690 },
];
const MAX_SALES = Math.max(...MONTHLY_DATA.map((m) => m.sales));

// ── ProfileForm bileşeni (hook kuralı: üst düzey) ────────────────
function ProfileForm({ onSave }: { onSave: () => void }) {
  const [data, setData] = useState({
    name: "Ayşe Hanım Atölyesi",
    phone: "+90 555 123 4567",
    about: "Geleneksel el sanatlarını modern tasarımlarla buluşturuyoruz. 15 yıllık tecrübemizle özgün ürünler üretiyoruz.",
    location: "İstanbul, Türkiye",
    specialties: "Kilim, Tekstil, El Dokuması",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave(); }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Atölye Adı</Label>
          <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Telefon</Label>
          <Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Hakkında</Label>
        <Textarea rows={4} value={data.about} onChange={(e) => setData({ ...data, about: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Konum</Label>
        <Input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Uzmanlaştığı Alanlar</Label>
        <Input value={data.specialties} placeholder="Virgülle ayırın" onChange={(e) => setData({ ...data, specialties: e.target.value })} />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </div>
  );
}

// ── Suspense wrapper — useSearchParams requires it ────────────────
export default function ArtisanPanelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
      <ArtisanPanel />
    </Suspense>
  );
}

// ── Ana bileşen ──────────────────────────────────────────────────
function ArtisanPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();

  // Auth guard — giriş yapılmamışsa /giris'e yönlendir
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/giris?redirect=/panel");
    }
  }, [isLoggedIn, router]);

  // URL'den tab parametresi oku: /panel?tab=xml-feed
  const urlTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    urlTab === "xml-feed" ? "xml-feed" : "products"
  );

  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);

  // ── State ──────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "El Dokuma Kilim Yastık",  price: 125, stock: 8,  sold: 45, rating: 4.9, status: "active", image: "/placeholder.svg?height=40&width=40", views: 312 },
    { id: 2, name: "Seramik Vazo",             price: 89,  stock: 3,  sold: 23, rating: 4.7, status: "active", image: "/placeholder.svg?height=40&width=40", views: 187 },
    { id: 3, name: "El Örgüsü Çanta",          price: 160, stock: 12, sold: 17, rating: 4.8, status: "active", image: "/placeholder.svg?height=40&width=40", views: 243 },
    { id: 4, name: "Ahşap Oyma Çerçeve",       price: 75,  stock: 2,  sold: 9,  rating: 4.6, status: "draft",  image: "/placeholder.svg?height=40&width=40", views: 54  },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 1001, product: "El Dokuma Kilim Yastık", customer: "Mehmet K.", quantity: 2, total: 250, status: "pending",   date: "2024-01-15", productImage: "/placeholder.svg?height=40&width=40", customerNote: "Sarı tonlarda tercih ederim, hediye paketleme lütfen." },
    { id: 1002, product: "Seramik Vazo",           customer: "Ayşe Y.",   quantity: 1, total: 89,  status: "shipped",   date: "2024-01-14", productImage: "/placeholder.svg?height=40&width=40", trackingNo: "1Z999AA10123456784" },
    { id: 1003, product: "El Örgüsü Çanta",        customer: "Zeynep A.", quantity: 1, total: 160, status: "delivered", date: "2024-01-10", productImage: "/placeholder.svg?height=40&width=40" },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", category: "", subcategory: "" });
  const [productMedia, setProductMedia] = useState<MediaUploadValue>({ images: [], video: null });
  const [dialogOpen, setDialogOpen] = useState(false);
  // Inline fiyat düzenleme: { id, value }
  const [inlinePrice, setInlinePrice] = useState<{ id: number; value: string } | null>(null);

  const handleInlinePriceSave = (productId: number) => {
    const val = parseFloat(inlinePrice?.value ?? "");
    if (!inlinePrice || isNaN(val) || val <= 0) { setInlinePrice(null); return; }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: val } : p));
    setInlinePrice(null);
    toast({ title: "Fiyat güncellendi", description: `Yeni fiyat: ${val}π`, duration: 2000 });
  };
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [orderFilter, setOrderFilter] = useState<"all" | Order["status"]>("all");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [trackingDialog, setTrackingDialog] = useState<number | null>(null);
  const [trackingInput, setTrackingInput] = useState("");

  // Ürün arama
  const [productSearch, setProductSearch] = useState("");

  // Ürün sıralama
  type SortKey = "name" | "price" | "stock" | "sold" | "views";
  const [sortKey, setSortKey] = useState<SortKey>("sold");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Kazanç hedefi
  const [earningGoal, setEarningGoal] = useState(5000);
  const [earningGoalInput, setEarningGoalInput] = useState("");
  const [earningGoalDialog, setEarningGoalDialog] = useState(false);

  // Tatil modu
  const [holidayMode, setHolidayMode] = useState(false);
  const [holidayMessage, setHolidayMessage] = useState("Şu an tatildeyim, siparişleri 10 Şubat'tan itibaren karşılayacağım.");
  const [holidayEndDate, setHolidayEndDate] = useState("");

  // Analitik bar seçimi
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  // ── XML Feed: Cron Job & Eşleştirme ──────────────────────────────
  type CronFreq = "hourly" | "every6h" | "every12h" | "daily";
  type FeedStatus = "active" | "paused" | "error" | "never";

  type XmlFeed = {
    id: string;
    url: string;
    label: string;
    frequency: CronFreq;
    status: FeedStatus;
    lastRun: string | null;
    nextRun: string | null;
    lastImported: number;
    lastErrors: number;
    autoOutOfStock: boolean;
  };

  // UCB standart etiketleri — sol sütun (hedef)
  const UCB_FIELDS = [
    { key: "product_name", label: "product_name",  required: true,  hint: "Ürün adı" },
    { key: "price_pi",     label: "price_pi",       required: true,  hint: "Pi cinsinden fiyat" },
    { key: "category",     label: "category",       required: true,  hint: "Kategori yolu (> ile)" },
    { key: "stock",        label: "stock",          required: true,  hint: "Stok adedi" },
    { key: "images",       label: "images > image", required: true,  hint: "Görsel URL'leri" },
    { key: "description",  label: "description",    required: false, hint: "Ürün açıklaması" },
    { key: "status",       label: "status",         required: false, hint: "active veya draft" },
  ];

  const [feeds, setFeeds] = useState<XmlFeed[]>([
    {
      id: "F001", url: "https://magazam.com/urunler.xml",
      label: "Ana Ürün Feed'i",
      frequency: "every6h", status: "active",
      lastRun: "2026-03-10 08:00", nextRun: "2026-03-10 14:00",
      lastImported: 142, lastErrors: 3, autoOutOfStock: true,
    },
    {
      id: "F002", url: "https://depo.magazam.com/sezon.xml",
      label: "Sezon Ürünleri",
      frequency: "daily", status: "paused",
      lastRun: "2026-03-09 00:00", nextRun: null,
      lastImported: 58, lastErrors: 0, autoOutOfStock: true,
    },
  ]);

  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const [feedForm, setFeedForm] = useState<Partial<XmlFeed>>({ frequency: "every6h", autoOutOfStock: true });
  const [feedRunning, setFeedRunning] = useState<string | null>(null);

  // Eşleştirme (Mapping) state
  const [mappingFeedId, setMappingFeedId] = useState<string | null>(null);
  const [vendorFields, setVendorFields] = useState<string[]>([
    "urun_adi", "fiyat", "kategori", "stok_miktari", "gorseller", "tanim", "durum",
  ]);
  const [mappings, setMappings] = useState<Record<string, string>>({
    product_name: "urun_adi",
    price_pi:     "fiyat",
    category:     "kategori",
    stock:        "stok_miktari",
    images:       "gorseller",
  });
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  const FREQ_LABELS: Record<CronFreq, string> = {
    hourly:   "Her saat",
    every6h:  "6 saatte bir",
    every12h: "12 saatte bir",
    daily:    "Günde bir",
  };

  const simulateFeedRun = async (feedId: string) => {
    setFeedRunning(feedId);
    await new Promise((r) => setTimeout(r, 2000));
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setFeeds((prev) => prev.map((f) => f.id === feedId ? {
      ...f, status: "active", lastRun: ts,
      nextRun: "Hesaplanıyor...",
      lastImported: f.lastImported + Math.floor(Math.random() * 10),
      lastErrors: Math.floor(Math.random() * 3),
    } : f));
    setFeedRunning(null);
    toast({ title: "Feed senkronize edildi", description: "Stoklar ve fiyatlar güncellendi.", duration: 2500 });
  };

  // XML toplu yükleme
  const [xmlDialogOpen, setXmlDialogOpen] = useState(false);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlUrl, setXmlUrl] = useState("");
  const [xmlInputTab, setXmlInputTab] = useState<"file" | "url">("file");
  const [xmlPreview, setXmlPreview] = useState<Omit<Product, "id" | "sold" | "rating" | "views">[]>([]);
  const [xmlErrors, setXmlErrors] = useState<string[]>([]);
  const [xmlStep, setXmlStep] = useState<"upload" | "preview" | "done">("upload");
  const [xmlLoading, setXmlLoading] = useState(false);
  const [xmlTotalCount, setXmlTotalCount] = useState(0);
  // Görsel optimizasyon simülasyon istatistikleri
  const [xmlImgStats, setXmlImgStats] = useState<{ total: number; converted: number; saved: string } | null>(null);

  // Ucuzcu Bakkal Standart XML Şablonu v1.0
  const XML_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  ╔══════════════════════════════════════════════════════╗
  ║   UCUZCU BAKKAL — Standart Ürün XML Şablonu v1.0    ║
  ║   Zorunlu etiketler: product_name, price_pi,        ║
  ║   category, stock, images (min 1 adet)              ║
  ╚══════════════════════════════════════════════════════╝
-->
<products>
  <product>
    <!-- ZORUNLU ALANLAR -->
    <product_name>El Yapımı Seramik Kupa</product_name>
    <price_pi>12.50</price_pi>
    <category>Ev ve Yaşam > Mutfak > Seramik</category>
    <stock>25</stock>
    <!-- En az 1, en fazla 6 resim URL -->
    <images>
      <image>https://ornek.com/resim1.jpg</image>
      <image>https://ornek.com/resim2.jpg</image>
    </images>

    <!-- İSTEGE BAGLI ALANLAR -->
    <description>El çarkında şekillendirilmiş, kurşunsuz sır kullanılarak 1280°C'de pişirilmiştir. Dishwasher safe.</description>
    <status>active</status>
    <!-- İsteğe bağlı: max 10 saniyelik yapım aşaması videosu -->
    <video>https://ornek.com/yapim-videosu.mp4</video>
  </product>

  <product>
    <!-- ZORUNLU ALANLAR -->
    <product_name>Doğal Zeytinyağı Sabunu</product_name>
    <price_pi>5.00</price_pi>
    <category>Kozmetik > Cilt Bakımı > Sabun</category>
    <stock>100</stock>
    <images>
      <image>https://ornek.com/sabun1.jpg</image>
    </images>

    <!-- İSTEGE BAGLI ALANLAR -->
    <description>%100 saf zeytinyağı ile soğuk presleme yöntemiyle üretilmiştir. Paraben ve SLS içermez.</description>
    <status>draft</status>
  </product>
</products>`;

  const handleDownloadTemplate = () => {
    const blob = new Blob([XML_TEMPLATE], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "urun-sablonu.xml";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "XML şablonu indirildi", description: "Dosyayı doldurup tekrar yükleyin.", duration: 3000 });
  };

  // ── XML core parser (dosya veya URL metnini alır) ───────────────
  const parseXmlText = (text: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      setXmlErrors(["XML dosyası geçersiz format içeriyor. Lütfen UCB standart şablonunu kullanın."]);
      setXmlLoading(false);
      return;
    }
    const productNodes = doc.querySelectorAll("product");
    if (productNodes.length === 0) {
      setXmlErrors(["Hiç ürün bulunamadı. Lütfen <product> etiketlerini kontrol edin."]);
      setXmlLoading(false);
      return;
    }
    setXmlTotalCount(productNodes.length);
    const errors: string[] = [];
    const parsed: Omit<Product, "id" | "sold" | "rating" | "views">[] = [];
    let totalImages = 0;

    productNodes.forEach((node, i) => {
      const get = (tag: string) => node.querySelector(tag)?.textContent?.trim() ?? "";
      const name     = get("product_name") || get("name");
      const priceRaw = get("price_pi")     || get("price");
      const price    = parseFloat(priceRaw);
      const categoryRaw   = get("category");
      const categoryParts = categoryRaw.split(">").map((s) => s.trim()).filter(Boolean);
      const categorySlug  = categoryParts[0]?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-ığüşöçİĞÜŞÖÇ]/g, "") || "";
      const stock  = parseInt(get("stock")) || 0;
      const status = (get("status") === "active" ? "active" : "draft") as "active" | "draft";

      if (!name) { errors.push(`Ürün ${i + 1}: <product_name> etiketi boş olamaz.`); return; }
      if (isNaN(price) || price <= 0) { errors.push(`Ürün ${i + 1} (${name}): <price_pi> geçerli bir sayı olmalıdır (örn: 12.50).`); return; }
      if (!categoryRaw) { errors.push(`Ürün ${i + 1} (${name}): <category> etiketi zorunludur (örn: Moda > Ayakkabı).`); return; }

      const imageNodes = node.querySelectorAll("images > image");
      let imageList: string[] = Array.from(imageNodes).map((n) => n.textContent?.trim() ?? "").filter(Boolean).slice(0, 6);
      if (imageList.length === 0) { const s = get("image"); if (s) imageList = [s]; }
      if (imageList.length === 0) { errors.push(`Ürün ${i + 1} (${name}): <images> içinde en az 1 adet <image> URL'si zorunludur.`); return; }
      if (imageList.length > 6)  { errors.push(`Ürün ${i + 1} (${name}): En fazla 6 resim yükleyebilirsiniz — ilk 6'sı alındı.`); imageList = imageList.slice(0, 6); }

      totalImages += imageList.length;
      const video = get("video") || null;
      parsed.push({
        name, description: get("description"), price, stock,
        category: categorySlug || categoryParts.join(" > "),
        subcategory: categoryParts[1]?.toLowerCase().replace(/\s+/g, "-") || undefined,
        status, image: imageList[0], images: imageList, video,
      });
    });

    // Görsel optimizasyon simülasyonu
    const converted = totalImages;
    const savedKb   = Math.round(totalImages * 47.3); // ortalama %40 tasarruf
    setXmlImgStats({ total: totalImages, converted, saved: savedKb > 1024 ? `${(savedKb / 1024).toFixed(1)} MB` : `${savedKb} KB` });

    setXmlErrors(errors);
    setXmlPreview(parsed);
    if (parsed.length > 0) setXmlStep("preview");
    setXmlLoading(false);
  };

  // ── URL'den XML çekme ────────────────────────────────────────────
  const handleFetchXmlUrl = async () => {
    if (!xmlUrl.trim()) return;
    setXmlLoading(true);
    setXmlErrors([]);
    try {
      const res = await fetch(xmlUrl.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      parseXmlText(text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setXmlErrors([`URL'den dosya çekilemedi: ${msg}. CORS kısıtlaması olabilir; lütfen dosyayı indirip yükleyin.`]);
      setXmlLoading(false);
    }
  };

  const handleXmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".xml")) {
      setXmlErrors(["Sadece .xml uzantılı dosya yükleyebilirsiniz."]);
      return;
    }
    setXmlFile(file);
    setXmlErrors([]);
    setXmlPreview([]);
  };

  const handleParseXml = () => {
    if (!xmlFile) return;
    setXmlLoading(true);
    setXmlErrors([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        parseXmlText(e.target?.result as string);
      } catch {
        setXmlErrors(["Dosya okunurken bir hata oluştu."]);
        setXmlLoading(false);
      }
    };
    reader.readAsText(xmlFile, "UTF-8");
  };

  const handleXmlImport = () => {
    const newProducts: Product[] = xmlPreview.map((p) => ({
      ...p,
      id: Date.now() + Math.random(),
      sold: 0,
      rating: 0,
      views: 0,
    }));
    setProducts((prev) => [...newProducts, ...prev]);
    setXmlStep("done");
    toast({
      title: `${newProducts.length} ürün başarıyla içe aktarıldı`,
      description: "Ürünler listenize eklendi.",
      duration: 4000,
    });
  };

  const handleXmlDialogClose = () => {
    setXmlDialogOpen(false);
    setTimeout(() => {
      setXmlFile(null);
      setXmlUrl("");
      setXmlInputTab("file");
      setXmlPreview([]);
      setXmlErrors([]);
      setXmlStep("upload");
      setXmlLoading(false);
      setXmlTotalCount(0);
      setXmlImgStats(null);
    }, 300);
  };

  // ── Hesaplamalı değerler ──────────────────────────────────────
  const stats = [
    { title: "Toplam Satış",    value: `${products.reduce((s, p) => s + p.sold, 0)}`,          sub: "tüm zamanlar",       icon: ShoppingCart },
    { title: "Toplam Gelir",    value: `${products.reduce((s, p) => s + p.sold * p.price, 0)}π`, sub: "tüm zamanlar",       icon: TrendingUp   },
    { title: "Ortalama Puan",   value: (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1), sub: "ürün ortalaması", icon: Star         },
    { title: "Toplam Görüntülenme", value: `${products.reduce((s, p) => s + p.views, 0)}`,     sub: "bu ay",              icon: Eye          },
  ];

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);

  // Arama + sıralanmış ürünler
  const filteredProducts = productSearch.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase()))
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortKey as keyof Product] as number | string;
    const bVal = b[sortKey as keyof Product] as number | string;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal, "tr") : bVal.localeCompare(aVal, "tr");
    }
    return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className={`ml-0.5 text-[10px] ${sortKey === k ? "text-primary" : "text-muted-foreground/40"}`}>
      {sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  // Toplam bu aylık gelir (mock: tüm zamanlar yerine gerçek veri olur)
  const currentMonthRevenue = products.reduce((s, p) => s + p.sold * p.price, 0);
  const goalProgress = Math.min(100, (currentMonthRevenue / earningGoal) * 100);

  // ── Handlers ──────────────────────────────────────────────────
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    if (productMedia.images.length === 0) {
      toast({ title: "En az 1 fotoğraf gerekli", description: "Lütfen en az bir ürün fotoğrafı yükleyin.", variant: "destructive" });
      return;
    }
    const p: Product = {
      id: Date.now(), name: newProduct.name, description: newProduct.description,
      price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0,
      sold: 0, rating: 0,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      status: "draft",
      image: productMedia.images[0] ?? "/placeholder.svg?height=40&width=40",
      images: productMedia.images,
      video: productMedia.video,
      views: 0,
    };
    setProducts((prev) => [p, ...prev]);
    setNewProduct({ name: "", description: "", price: "", stock: "", category: "", subcategory: "" });
    setProductMedia({ images: [], video: null });
    setDialogOpen(false);
    toast({ title: "Ürün eklendi", description: `${p.name} taslak olarak kaydedildi.`, duration: 3000 });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Ürün silindi", duration: 2000 });
  };

  const handleEditOpen = (product: Product) => {
    setEditProduct({ ...product });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editProduct) return;
    setProducts((prev) => prev.map((p) => p.id === editProduct.id ? editProduct : p));
    setEditDialogOpen(false);
    setEditProduct(null);
    toast({ title: "Ürün güncellendi", duration: 2000 });
  };

  const handleOrderStatus = (orderId: number) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const transition = STATUS_TRANSITIONS[o.status];
      if (!transition) return o;
      toast({ title: `Sipariş #${orderId}: ${STATUS_MAP[transition.next].label}`, duration: 2500 });
      return { ...o, status: transition.next };
    }));
  };

  // Kargo takip no kaydet
  const handleSaveTracking = () => {
    if (!trackingDialog || !trackingInput.trim()) return;
    setOrders((prev) => prev.map((o) => o.id === trackingDialog ? { ...o, trackingNo: trackingInput.trim() } : o));
    toast({ title: "Kargo takip numarası kaydedildi", duration: 2500 });
    setTrackingDialog(null);
    setTrackingInput("");
  };

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === products.length) setSelectedProducts(new Set());
    else setSelectedProducts(new Set(products.map((p) => p.id)));
  };

  const handleBulkStatusChange = (status: "active" | "draft") => {
    setProducts((prev) => prev.map((p) => selectedProducts.has(p.id) ? { ...p, status } : p));
    toast({ title: `${selectedProducts.size} ürün ${status === "active" ? "aktif" : "taslak"} yapıldı`, duration: 2000 });
    setSelectedProducts(new Set());
  };

  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedProducts.has(p.id)));
    toast({ title: `${selectedProducts.size} ürün silindi`, duration: 2000 });
    setSelectedProducts(new Set());
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicate: Product = {
      ...product,
      id: Date.now(),
      name: `${product.name} (Kopya)`,
      status: "draft",
      sold: 0,
      views: 0,
    };
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      const next = [...prev];
      next.splice(idx + 1, 0, duplicate);
      return next;
    });
    toast({ title: `"${product.name}" kopyalandı`, description: "Taslak olarak eklendi.", duration: 2500 });
  };

  const handleExportCSV = () => {
    const header = ["Siparis No", "Urun", "Musteri", "Adet", "Toplam (π)", "Durum", "Tarih"];
    const rows = orders.map((o) => [o.id, o.product, o.customer, o.quantity, o.total, STATUS_MAP[o.status].label, o.date]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siparisler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Siparişler CSV olarak indirildi", duration: 2500 });
  };

  // ── JSX ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Tatil modu banner'ı */}
      {holidayMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 space-y-2">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800 flex-1">{holidayMessage}</p>
            <Button size="sm" variant="ghost" className="h-6 text-xs text-amber-700 hover:text-amber-900 px-2"
              onClick={() => setHolidayMode(false)}>
              Kapat
            </Button>
          </div>
          <div className="flex items-center gap-2 pl-6">
            <label className="text-xs text-amber-700 font-medium whitespace-nowrap">Dönüş tarihi:</label>
            <input
              type="date"
              value={holidayEndDate}
              onChange={(e) => setHolidayEndDate(e.target.value)}
              className="text-xs border border-amber-300 rounded px-2 py-0.5 bg-white text-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            {holidayEndDate && (
              <span className="text-xs text-amber-600 font-medium">
                {Math.max(0, Math.ceil((new Date(holidayEndDate).getTime() - Date.now()) / 86400000))} gün kaldı
              </span>
            )}
          </div>
        </div>
      )}

      {/* Kargo takip no dialog */}
      <Dialog open={!!trackingDialog} onOpenChange={(o) => { if (!o) { setTrackingDialog(null); setTrackingInput(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Kargo Takip Numarası</DialogTitle>
            <DialogDescription>Sipariş #{trackingDialog} için takip numarasını girin</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="Örn: 1Z999AA10123456784"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTracking()}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Vazgec</Button></DialogClose>
            <Button onClick={handleSaveTracking} disabled={!trackingInput.trim()}>Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
              <h2 className="font-serif text-2xl font-bold">Satıcı Paneli</h2>
            <p className="text-muted-foreground text-sm">Mağazanızı yönetin ve büyütün</p>
          </div>
          {/* Tatil modu toggle */}
          <div className="flex items-center gap-2">
            <Moon className={`h-4 w-4 ${holidayMode ? "text-amber-500" : "text-muted-foreground"}`} />
            <Switch
              checked={holidayMode}
              onCheckedChange={(v) => {
                setHolidayMode(v);
                toast({ title: v ? "Tatil modu açıldı" : "Tatil modu kapatıldı", description: v ? "Yeni sipariş almayı durdurdunuz." : "Mağazanız tekrar aktif.", duration: 3000 });
              }}
            />
            <span className="text-xs text-muted-foreground hidden sm:inline">Tatil Modu</span>
          </div>
        </div>

        {/* Kazanç hedefi dialog */}
        <Dialog open={earningGoalDialog} onOpenChange={setEarningGoalDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Aylık Kazanç Hedefi</DialogTitle>
              <DialogDescription>Bu ay ulaşmak istediğiniz geliri belirleyin</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Input
                type="number"
                placeholder={`Mevcut hedef: ${earningGoal}π`}
                value={earningGoalInput}
                onChange={(e) => setEarningGoalInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild><Button variant="outline">Vazgec</Button></DialogClose>
              <Button onClick={() => {
                const v = parseInt(earningGoalInput);
                if (v > 0) { setEarningGoal(v); toast({ title: `Hedef ${v}π olarak güncellendi`, duration: 2000 }); }
                setEarningGoalDialog(false);
                setEarningGoalInput("");
              }}>Kaydet</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Kazanç hedefi progress bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold">Aylık Kazanç Hedefi</p>
                <p className="text-xs text-muted-foreground">
                  {currentMonthRevenue.toLocaleString("tr-TR")}π / {earningGoal.toLocaleString("tr-TR")}π
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">%{goalProgress.toFixed(0)}</span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEarningGoalDialog(true)}>
                  Hedef Belirle
                </Button>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            {goalProgress >= 100 && (
              <p className="text-xs text-primary font-semibold mt-1.5">Hedefe ulastiniz! Tebrikler.</p>
            )}
          </CardContent>
        </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:grid-cols-8 sm:flex gap-0.5">
            <TabsTrigger value="products">Ürünlerim</TabsTrigger>
            <TabsTrigger value="orders">
              Siparişler
              {pendingOrders > 0 && (
                <Badge className="ml-1.5 h-4 px-1 text-[10px]">{pendingOrders}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
            <TabsTrigger value="xml-feed" className="flex items-center gap-1.5">
              <Rss className="h-3.5 w-3.5" />XML Feed
            </TabsTrigger>
            <TabsTrigger value="store-editor">Mağaza Düzenle</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="ai-asistan" className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Asistan</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center gap-1.5">
              <MessageSquarePlus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Görüş</span>
              <span className="sm:hidden">Görüş</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Ürünler ── */}
          <TabsContent value="products" className="space-y-4">

            {products.some((p) => p.stock < 5) && (
              <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-3">
                <Package className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Kritik Stok Uyarısı</p>
                  <p className="text-xs text-destructive/80 mt-0.5">
                    {products.filter((p) => p.stock < 5).map((p) => p.name).join(", ")} — stok 5 adedin altında.
                  </p>
                </div>
              </div>
            )}

            {selectedProducts.size > 0 && (
              <div className="flex items-center gap-2 bg-accent border border-border rounded-xl px-4 py-2.5">
                <span className="text-sm font-medium flex-1">{selectedProducts.size} ürün seçildi</span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleBulkStatusChange("active")}>Aktif Yap</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleBulkStatusChange("draft")}>Taslak Yap</Button>
                <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleBulkDelete}>Sil</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelectedProducts(new Set())}>Vazgec</Button>
              </div>
            )}

            {/* Ürün düzenleme dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Ürünü Düzenle</DialogTitle>
                  <DialogDescription>Ürün bilgilerini güncelleyin</DialogDescription>
                </DialogHeader>
                {editProduct && (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Ürün Adı *</Label>
                      <Input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama</Label>
                      <Textarea rows={3} value={editProduct.description ?? ""} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fiyat (π) *</Label>
                        <Input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Stok</Label>
                        <Input type="number" value={editProduct.stock} onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Durum</Label>
                      <div className="flex gap-2">
                        {(["active", "draft"] as const).map((s) => (
                          <Button key={s} size="sm" variant={editProduct.status === s ? "default" : "outline"}
                            onClick={() => setEditProduct({ ...editProduct, status: s })}>
                            {s === "active" ? "Aktif" : "Taslak"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <DialogClose asChild><Button variant="outline">Vazgec</Button></DialogClose>
                  <Button onClick={handleEditSave} disabled={!editProduct?.name}>Kaydet</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* XML Toplu Yükleme Dialog */}
            <Dialog open={xmlDialogOpen} onOpenChange={(o) => { if (!o) handleXmlDialogClose(); }}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    XML ile Toplu Ürün Yükleme
                  </DialogTitle>
                  <DialogDescription>
                    XML dosyası yükleyerek birden fazla ürünü aynı anda mağazanıza ekleyin.
                  </DialogDescription>
                </DialogHeader>

                {/* Adım göstergesi */}
                <div className="flex items-center gap-2 py-2">
                  {[
                    { key: "upload", label: "Dosya Yükle" },
                    { key: "preview", label: "Önizleme" },
                    { key: "done", label: "Tamamlandı" },
                  ].map((step, i, arr) => (
                    <div key={step.key} className="flex items-center gap-2 flex-1">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 transition-colors ${
                        xmlStep === step.key ? "bg-primary text-primary-foreground" :
                        (arr.findIndex(s => s.key === xmlStep) > i) ? "bg-primary/20 text-primary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {arr.findIndex(s => s.key === xmlStep) > i ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${xmlStep === step.key ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                      {i < arr.length - 1 && <div className="flex-1 h-px bg-border" />}
                    </div>
                  ))}
                </div>

                {/* Adım 1: Dosya yükleme */}
                {xmlStep === "upload" && (
                  <div className="space-y-4">
                    {/* Şablon indirme */}
                    <div className="flex items-center justify-between p-3 bg-accent rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <FileCode className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">UCB Standart XML Şablonu v1.0</p>
                          <p className="text-xs text-muted-foreground">Doğru formatta doldurmak için şablonu indirin.</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Şablonu İndir
                      </Button>
                    </div>

                    {/* UCB Standart XML v1.0 — etiket tablosu */}
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="bg-muted/60 px-3 py-2 flex items-center justify-between border-b border-border">
                        <span className="text-xs font-bold text-foreground">Ucuzcu Bakkal Standart XML v1.0 — Etiket Referansı</span>
                        <Badge variant="outline" className="text-[10px] px-1.5">5 zorunlu · 3 isteğe bağlı</Badge>
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border">
                            <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Etiket</th>
                            <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Zorunlu</th>
                            <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Açıklama</th>
                            <th className="text-left px-3 py-2 font-semibold text-muted-foreground hidden sm:table-cell">Örnek</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border font-mono">
                          {[
                            { tag:"product_name", req:true,  desc:"Ürün adı",               ex:"El Yapımı Kupa" },
                            { tag:"price_pi",     req:true,  desc:"Pi cinsinden fiyat",      ex:"12.50" },
                            { tag:"category",     req:true,  desc:"Kategori yolu (> ile)",   ex:"Moda > Ayakkabı" },
                            { tag:"stock",        req:true,  desc:"Stok adedi (tam sayı)",   ex:"25" },
                            { tag:"images > image",req:true, desc:"Min 1, maks 6 resim URL", ex:"https://..." },
                            { tag:"description",  req:false, desc:"Ürün açıklaması",         ex:"Handmade..." },
                            { tag:"status",       req:false, desc:"active veya draft",        ex:"active" },
                            { tag:"video",        req:false, desc:"Yapım videosu (maks 10s)", ex:"https://..." },
                          ].map(({ tag, req, desc, ex }) => (
                            <tr key={tag} className="hover:bg-muted/20 transition-colors">
                              <td className="px-3 py-2">
                                <code className={`${req ? "text-primary" : "text-blue-500"}`}>
                                  &lt;{tag}&gt;
                                </code>
                              </td>
                              <td className="px-3 py-2">
                                {req
                                  ? <span className="text-primary font-bold">Zorunlu</span>
                                  : <span className="text-muted-foreground">Opsiyonel</span>
                                }
                              </td>
                              <td className="px-3 py-2 font-sans text-muted-foreground">{desc}</td>
                              <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{ex}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Dosya / URL sekme seçici */}
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {(["file", "url"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => { setXmlInputTab(tab); setXmlErrors([]); }}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                            xmlInputTab === tab
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {tab === "file" ? <Upload className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                          {tab === "file" ? "Dosya Yükle (.xml)" : "URL ile Yükle"}
                        </button>
                      ))}
                    </div>

                    {/* Dosya seçici */}
                    {xmlInputTab === "file" && (
                      <div className="space-y-2">
                        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                          xmlFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/50"
                        }`}>
                          <input type="file" accept=".xml" className="hidden" onChange={handleXmlFileChange} />
                          {xmlFile ? (
                            <div className="flex items-center gap-3">
                              <FileCode className="h-8 w-8 text-primary flex-shrink-0" />
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{xmlFile.name}</p>
                                <p className="text-xs text-muted-foreground">{(xmlFile.size / 1024).toFixed(1)} KB</p>
                              </div>
                              <Button size="icon" variant="ghost" className="h-6 w-6 flex-shrink-0"
                                onClick={(e) => { e.preventDefault(); setXmlFile(null); setXmlErrors([]); }}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm font-medium">Dosyayı buraya sürukleyin</p>
                              <p className="text-xs text-muted-foreground mt-1">veya secmek icin tiklayin (.xml)</p>
                            </div>
                          )}
                        </label>
                      </div>
                    )}

                    {/* URL girişi */}
                    {xmlInputTab === "url" && (
                      <div className="space-y-2">
                        <Label className="text-xs">XML Dosyası URL Adresi</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                              className="pl-9 text-sm"
                              placeholder="https://magazaniz.com/urunler.xml"
                              value={xmlUrl}
                              onChange={(e) => setXmlUrl(e.target.value)}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleFetchXmlUrl}
                            disabled={!xmlUrl.trim() || xmlLoading}
                          >
                            {xmlLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Getir"}
                          </Button>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Sunucu CORS politikası nedeniyle bazı URL'ler doğrudan yuklenemeyebilir. Bu durumda dosyayı indirip "Dosya Yukle" ile yukleyin.
                        </p>
                      </div>
                    )}

                    {/* Hatalar */}
                    {xmlErrors.length > 0 && (
                      <div className="space-y-1.5 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        {xmlErrors.map((err, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-destructive">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={handleXmlDialogClose}>Vazgec</Button>
                      {xmlInputTab === "file" && (
                        <Button onClick={handleParseXml} disabled={!xmlFile || xmlLoading}>
                          {xmlLoading ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Isleniyor...</> : "Devam Et"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Adım 2: Önizleme */}
                {xmlStep === "preview" && (
                  <div className="space-y-4">

                    {/* Yükleme raporu — "X üründen Y'si yüklendi, Z hatalı" */}
                    <div className="rounded-xl border border-border overflow-hidden">
                      <div className="grid grid-cols-3 divide-x divide-border">
                        <div className="p-3 text-center">
                          <p className="text-xl font-black text-foreground">{xmlTotalCount}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Toplam Ürün</p>
                        </div>
                        <div className="p-3 text-center">
                          <p className="text-xl font-black text-green-600">{xmlPreview.length}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Yuklendi</p>
                        </div>
                        <div className="p-3 text-center">
                          <p className={`text-xl font-black ${xmlErrors.length > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {xmlErrors.length}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Hatali / Atlandi</p>
                        </div>
                      </div>
                      {/* Yüzde progress bar */}
                      <div className="px-3 pb-3 pt-1">
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all"
                            style={{ width: `${xmlTotalCount > 0 ? (xmlPreview.length / xmlTotalCount) * 100 : 0}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground text-right mt-1">
                          {xmlTotalCount > 0 ? Math.round((xmlPreview.length / xmlTotalCount) * 100) : 0}% basariyla islendi
                        </p>
                      </div>
                    </div>

                    {/* Görsel optimizasyon raporu */}
                    {xmlImgStats && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                        <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-700 dark:text-blue-400 space-y-0.5">
                          <p className="font-semibold text-blue-900 dark:text-blue-200">Gorsel Optimizasyon</p>
                          <p>{xmlImgStats.total} gorsel CDN sunucusuna aktarilacak ve <strong>WebP formatina</strong> donusturulecek.</p>
                          <p>Tahmini boyut tasarrufu: <strong>{xmlImgStats.saved}</strong> (~%40 kucultme)</p>
                          <p className="text-[10px] opacity-75">Pi Browser kullanicilari icin 480px, 720px, 1080px variants otomatik uretilir.</p>
                        </div>
                      </div>
                    )}

                    {/* Hatalı ürünler listesi */}
                    {xmlErrors.length > 0 && (
                      <div className="space-y-1.5 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5" />Atlanan urunler ({xmlErrors.length}):
                        </p>
                        {xmlErrors.map((err, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                            <span className="flex-shrink-0 font-bold">{i + 1}.</span>
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-72">
                        <table className="w-full text-xs">
                          <thead className="bg-muted sticky top-0">
                            <tr>
                              <th className="text-left p-2.5 font-semibold">#</th>
                              <th className="text-left p-2.5 font-semibold">Ürün Adı</th>
                              <th className="text-left p-2.5 font-semibold">Fiyat</th>
                              <th className="text-left p-2.5 font-semibold">Stok</th>
                              <th className="text-left p-2.5 font-semibold">Kategori</th>
                              <th className="text-left p-2.5 font-semibold">Durum</th>
                            </tr>
                          </thead>
                          <tbody>
                            {xmlPreview.map((p, i) => (
                              <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                                <td className="p-2.5 text-muted-foreground">{i + 1}</td>
                                <td className="p-2.5 font-medium max-w-[180px] truncate">{p.name}</td>
                                <td className="p-2.5 text-primary font-semibold">{p.price}π</td>
                                <td className="p-2.5">{p.stock}</td>
                                <td className="p-2.5 text-muted-foreground">{p.category || "—"}</td>
                                <td className="p-2.5">
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    p.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                                  }`}>
                                    {p.status === "active" ? "Aktif" : "Taslak"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 pt-2">
                      <Button variant="outline" onClick={() => setXmlStep("upload")}>Geri</Button>
                      <Button onClick={handleXmlImport}>
                        <Upload className="h-4 w-4 mr-2" />
                        {xmlPreview.length} Ürünü İçe Aktar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Adım 3: Tamamlandı */}
                {xmlStep === "done" && (
                  <div className="space-y-5 py-2">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="h-7 w-7 text-green-600" />
                      </div>
                      <div>
                        <p className="text-base font-bold">Aktarma tamamlandi!</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {xmlPreview.length} urün mağazanıza basariyla eklendi.
                        </p>
                      </div>
                    </div>

                    {/* Özet istatistik kartları */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border p-3 text-center">
                        <p className="text-2xl font-black text-green-600">{xmlPreview.length}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Yuklenen Urun</p>
                      </div>
                      <div className="rounded-xl border border-border p-3 text-center">
                        <p className={`text-2xl font-black ${xmlErrors.length > 0 ? "text-amber-500" : "text-muted-foreground"}`}>
                          {xmlErrors.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Atlanan / Hatali</p>
                      </div>
                      {xmlImgStats && (
                        <>
                          <div className="rounded-xl border border-border p-3 text-center">
                            <p className="text-2xl font-black text-blue-600">{xmlImgStats.converted}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">WebP Gorsel</p>
                          </div>
                          <div className="rounded-xl border border-border p-3 text-center">
                            <p className="text-2xl font-black text-primary">{xmlImgStats.saved}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Boyut Tasarrufu</p>
                          </div>
                        </>
                      )}
                    </div>

                    {xmlImgStats && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-400">
                        <ImageIcon className="h-4 w-4 flex-shrink-0" />
                        Tum gorseller CDN sunucusuna aktarildi ve Pi Browser icin 3 boyut varyanti olusturuldu (480 · 720 · 1080 px WebP).
                      </div>
                    )}

                    <div className="flex justify-center pt-2">
                      <Button onClick={handleXmlDialogClose}>Kapat</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">Ürünlerim</h3>
              <div className="flex items-center gap-2 flex-1 sm:justify-end">
                <div className="relative flex-1 sm:flex-none sm:w-52">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Ürün ara..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-9 h-8 text-sm"
                  />
                </div>
                <Button size="sm" variant="outline" onClick={() => setXmlDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  XML ile Yükle
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-2" />Yeni Ürün</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                    <DialogDescription>Ürün bilgilerini doldurun, kategori & alt kategori seçin, fotoğraf ve video yükleyin</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-2">

                    {/* Temel bilgiler */}
                    <div className="space-y-2">
                      <Label>Ürün Adı <span className="text-destructive">*</span></Label>
                      <Input placeholder="Örn: Seramik Çay Bardağı" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama</Label>
                      <Textarea placeholder="Ürünü kısaca tanıtın..." rows={3} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fiyat (π) <span className="text-destructive">*</span></Label>
                        <Input type="number" min="0" placeholder="0.00" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Stok Adedi</Label>
                        <Input type="number" min="0" placeholder="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                      </div>
                    </div>

                    {/* Kategori seçimi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ana Kategori <span className="text-destructive">*</span></Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(v) => setNewProduct({ ...newProduct, category: v, subcategory: "" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.slug} value={cat.slug}>{cat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Alt Kategori</Label>
                        <Select
                          value={newProduct.subcategory}
                          onValueChange={(v) => setNewProduct({ ...newProduct, subcategory: v })}
                          disabled={!newProduct.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={newProduct.category ? "Alt kategori seçin" : "Önce ana kategori seçin"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(CATEGORIES.find((c) => c.slug === newProduct.category)?.subcategories ?? []).map((sub) => (
                              <SelectItem key={sub.slug} value={sub.slug}>{sub.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Medya yükleme */}
                    <div className="border border-border rounded-xl p-4 bg-muted/20">
                      <MediaUpload value={productMedia} onChange={setProductMedia} />
                    </div>

                    {productMedia.images.length === 0 && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        En az 1 fotoğraf yüklemeniz zorunludur.
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-2 border-t border-border">
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => {
                        setNewProduct({ name: "", description: "", price: "", stock: "", category: "", subcategory: "" });
                        setProductMedia({ images: [], video: null });
                      }}>
                        İptal
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleAddProduct}
                      disabled={!newProduct.name || !newProduct.price || !newProduct.category || productMedia.images.length === 0}
                    >
                      Ürünü Ekle
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">
                        <Checkbox checked={selectedProducts.size === products.length && products.length > 0} onCheckedChange={toggleSelectAll} />
                      </TableHead>
                      <TableHead className="w-10">Görsel</TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                        Ürün <SortIcon k="name" />
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("price")}>
                        Fiyat <SortIcon k="price" />
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("stock")}>
                        Stok <SortIcon k="stock" />
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("sold")}>
                        Satış <SortIcon k="sold" />
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => handleSort("views")}>
                        Görünt. <SortIcon k="views" />
                      </TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.map((product) => (
                      <TableRow key={product.id} className={selectedProducts.has(product.id) ? "bg-accent/50" : ""}>
                        <TableCell>
                          <Checkbox checked={selectedProducts.has(product.id)} onCheckedChange={() => toggleSelectProduct(product.id)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover bg-muted flex-shrink-0" />
                            <span className="font-medium text-sm max-w-[120px] truncate">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {inlinePrice?.id === product.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={inlinePrice.value}
                                onChange={(e) => setInlinePrice({ id: product.id, value: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleInlinePriceSave(product.id);
                                  if (e.key === "Escape") setInlinePrice(null);
                                }}
                                onBlur={() => handleInlinePriceSave(product.id)}
                                autoFocus
                                className="w-20 h-7 text-xs border border-primary rounded px-2 bg-background text-primary font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                              <span className="text-xs text-primary font-semibold">π</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setInlinePrice({ id: product.id, value: String(product.price) })}
                              className="text-primary font-semibold text-sm hover:underline hover:decoration-dotted cursor-pointer"
                              title="Fiyatı düzenlemek için tıkla"
                            >
                              {product.price}π
                            </button>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={product.stock < 5 ? "text-destructive font-semibold" : ""}>{product.stock}</span>
                        </TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-3 w-3" />{product.views}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.rating > 0 ? (
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 fill-primary text-primary" />{product.rating}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">Yeni</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.status === "active" ? "default" : "outline"}>
                            {product.status === "active" ? "Aktif" : "Taslak"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Kopyala" onClick={() => handleDuplicateProduct(product)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditOpen(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Toplu Araçlar */}
            <div className="grid md:grid-cols-2 gap-4">
              <CsvImportTool />
              <BulkPriceTool />
            </div>
            <CouponGenerator />

            {/* Paket Ürünler */}
            <Card>
              <CardContent className="pt-4">
                <BundleManager />
              </CardContent>
            </Card>

            {/* SEO Meta */}
            <SeoMetaEditor />

          </TabsContent>

          {/* ── Siparişler ── */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-semibold">Siparişler</h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5" />
                  CSV İndir
                </Button>
                {(["all", "pending", "shipped", "delivered"] as const).map((f) => (
                  <Button key={f} size="sm" variant={orderFilter === f ? "default" : "ghost"} className="h-7 text-xs px-2.5"
                    onClick={() => setOrderFilter(f)}>
                    {f === "all" ? "Tümü" : STATUS_MAP[f].label}
                    {f !== "all" && (
                      <span className="ml-1 text-[10px] opacity-70">({orders.filter((o) => o.status === f).length})</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Bu filtrede sipariş yok</div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const s = STATUS_MAP[order.status];
                  const transition = STATUS_TRANSITIONS[order.status];
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                          <img src={order.productImage} alt={order.product}
                            className="h-10 w-10 rounded-lg object-cover bg-muted flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                              <span className="font-semibold text-sm truncate">{order.product}</span>
                              {order.customerNote && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-amber-600 border-amber-300 bg-amber-50">Not var</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{order.customer}</span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">{order.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="font-bold text-primary text-sm">{order.total}π</span>
                            <Badge variant={s.variant} className="text-xs">{s.label}</Badge>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border">
                            {/* Sipariş zaman çizelgesi */}
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Sipariş Geçmişi</p>
                              <div className="relative pl-5 space-y-3">
                                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
                                {[
                                  { step: "pending",   label: "Sipariş Alındı",    time: order.date, always: true },
                                  { step: "shipped",   label: "Kargoya Verildi",   time: order.trackingNo ? order.date : null, always: false },
                                  { step: "delivered", label: "Teslim Edildi",     time: null,       always: false },
                                ].map(({ step, label, time, always }) => {
                                  const statusOrder = ["pending", "shipped", "delivered"];
                                  const isDone = statusOrder.indexOf(order.status) >= statusOrder.indexOf(step);
                                  if (!always && !isDone) return null;
                                  return (
                                    <div key={step} className="flex items-start gap-2">
                                      <div className={`absolute left-0 w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 ${isDone ? "bg-primary border-primary" : "bg-muted border-border"}`} style={{ transform: "translateX(-0.5px)" }} />
                                      <div className="ml-1">
                                        <p className={`text-xs font-medium ${isDone ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                                        {time && <p className="text-[10px] text-muted-foreground">{time}</p>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            {order.customerNote && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                <p className="text-xs font-semibold text-amber-700 mb-1">Müşteri Notu</p>
                                <p className="text-sm text-amber-800">{order.customerNote}</p>
                              </div>
                            )}
                            {order.trackingNo ? (
                              <div className="flex items-center gap-2 text-sm pt-2">
                                <Truck className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground text-xs">Takip No:</span>
                                <a href={`https://www.ptt.gov.tr/tr/bireysel/gonderitakip?barcode=${order.trackingNo}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="font-semibold text-primary text-xs underline-offset-2 hover:underline">
                                  {order.trackingNo}
                                </a>
                              </div>
                            ) : (
                              order.status !== "pending" && (
                                <Button size="sm" variant="outline" className="mt-2 h-7 text-xs gap-1.5"
                                  onClick={() => { setTrackingDialog(order.id); setTrackingInput(""); }}>
                                  <Truck className="h-3.5 w-3.5" />
                                  Takip No Ekle
                                </Button>
                              )
                            )}
                            <div className="flex items-center gap-2 pt-1">
                              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-primary"
                                onClick={() => router.push(`/mesajlar?musteri=${encodeURIComponent(order.customer)}&siparis=${order.id}`)}>
                                <MessageSquare className="h-3.5 w-3.5" />
                                {order.customer} ile Mesajlaş
                              </Button>
                              <div className="flex-1" />
                              {transition ? (
                                <Button size="sm" className="h-8 text-xs" onClick={() => handleOrderStatus(order.id)}>
                                  {transition.label}
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground px-2 flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                  Tamamlandi
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ── Analitik ── */}
          <TabsContent value="analytics" className="space-y-4">
            <h3 className="text-lg font-semibold">Satış Analitiği</h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Bu Ay Görüntülenme", value: `${products.reduce((s, p) => s + p.views, 0)}`, change: "+18%", up: true,  icon: Eye         },
                { label: "Dönüşüm Oranı", value: `%${products.reduce((s,p)=>s+p.views,0) > 0 ? ((products.reduce((s,p)=>s+p.sold,0)/products.reduce((s,p)=>s+p.views,0))*100).toFixed(1) : "0.0"}`, change: "+0.4%", up: true, icon: TrendingUp },
                { label: "Tekrar Müşteri",      value: "34%",                                           change: "+5%",  up: true,  icon: Users        },
                { label: "Ort. Sipariş",        value: "187π",                                          change: "-12π", up: false, icon: ShoppingCart },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-xs flex items-center gap-0.5 font-medium ${m.up ? "text-green-600" : "text-red-500"}`}>
                        {m.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {m.change}
                      </span>
                    </div>
                    <p className="text-xl font-bold">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Tıklanabilir bar chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Son 6 Ay Satışlar</CardTitle>
                {selectedBar !== null && (
                  <p className="text-xs text-muted-foreground">
                    {MONTHLY_DATA[selectedBar].label}: <span className="font-semibold text-foreground">{MONTHLY_DATA[selectedBar].sales} sipariş</span> · <span className="font-semibold text-primary">{MONTHLY_DATA[selectedBar].revenue}π gelir</span> · <span className="font-semibold text-foreground">{MONTHLY_DATA[selectedBar].views} görüntülenme</span>
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-32">
                  {MONTHLY_DATA.map((m, i) => (
                    <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-primary">{m.sales}</span>
                      <div
                        className={`w-full rounded-t-sm transition-all cursor-pointer ${selectedBar === i ? "bg-primary" : "bg-primary/40 hover:bg-primary/70"}`}
                        style={{ height: `${(m.sales / MAX_SALES) * 100}%` }}
                        onClick={() => setSelectedBar(selectedBar === i ? null : i)}
                        title={`${m.label}: ${m.revenue}π`}
                      />
                      <span className="text-xs text-muted-foreground">{m.label}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 grid grid-cols-3 gap-4 text-center text-sm mt-3">
                  {MONTHLY_DATA.slice(-3).map((m) => (
                    <div key={m.label}>
                      <p className="font-bold text-primary">{m.revenue}π</p>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* En iyi performanslı ürünler */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">En İyi Performanslı Ürünler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products
                    .filter((p) => p.sold > 0)
                    .sort((a, b) => b.sold - a.sold)
                    .slice(0, 3)
                    .map((p, i) => {
                      const maxSold = products.reduce((m, x) => Math.max(m, x.sold), 0);
                      return (
                        <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                          <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                          <img src={p.image} alt={p.name} className="h-8 w-8 rounded-md object-cover bg-muted flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.sold} adet · {p.sold * p.price}π</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                            </div>
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" />{p.views}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Satış Tahmini */}
            <SalesForecast />

            {/* Müşteri Segmentasyonu */}
            <CustomerSegments />

            {/* Satici Sertifika Programi */}
            <SellerCertificate />

          </TabsContent>

          {/* ══════════════════════════════════════════════════════
               XML FEED — Cron Job & Eşleştirme
          ══════════════════════════════════════════════════════ */}
          <TabsContent value="xml-feed" className="space-y-6">

            {/* Başlık + Yeni Feed Ekle */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">XML Feed Yönetimi</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Feed URL'lerini kaydedin; sistem otomatik olarak stok & fiyatları günceller.
                </p>
              </div>
              <Button size="sm" onClick={() => { setFeedForm({ frequency: "every6h", autoOutOfStock: true }); setFeedDialogOpen(true); }}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />Feed Ekle
              </Button>
            </div>

            {/* Cron Job kartları */}
            <div className="space-y-3">
              {feeds.map((feed) => {
                const isRunning = feedRunning === feed.id;
                const statusConfig = {
                  active:  { color: "text-green-600 dark:text-green-400",  dot: "bg-green-500",  label: "Aktif"    },
                  paused:  { color: "text-muted-foreground",               dot: "bg-muted-foreground", label: "Duraklatildi" },
                  error:   { color: "text-destructive",                    dot: "bg-destructive",  label: "Hata"     },
                  never:   { color: "text-muted-foreground",               dot: "bg-muted",        label: "Hiç Calistirilmadi" },
                };
                const sc = statusConfig[feed.status];
                return (
                  <Card key={feed.id} className="border border-border shadow-none">
                    <CardContent className="p-4 space-y-4">

                      {/* Üst satır */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Rss className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold">{feed.label}</p>
                              <span className={`flex items-center gap-1 text-xs font-medium ${sc.color}`}>
                                <span className={`inline-block h-1.5 w-1.5 rounded-full ${sc.dot} ${feed.status === "active" && !isRunning ? "animate-pulse" : ""}`} />
                                {isRunning ? "Senkronize ediliyor..." : sc.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{feed.url}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            disabled={isRunning}
                            title="Simdi Calistir"
                            onClick={() => simulateFeedRun(feed.id)}
                          >
                            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            title={feed.status === "paused" ? "Aktif Et" : "Duraklat"}
                            onClick={() => setFeeds((prev) => prev.map((f) =>
                              f.id === feed.id ? { ...f, status: f.status === "paused" ? "active" : "paused", nextRun: f.status === "paused" ? "Hesaplanıyor..." : null } : f
                            ))}
                          >
                            {feed.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            title="Eslestirme Aracı"
                            onClick={() => setMappingFeedId(feed.id)}
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            title="Sil"
                            onClick={() => setFeeds((prev) => prev.filter((f) => f.id !== feed.id))}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* İstatistik çubukları */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { l: "Güncelleme Sıklığı", v: FREQ_LABELS[feed.frequency], icon: Clock },
                          { l: "Son Çalışma",         v: feed.lastRun ?? "Hiç",       icon: RefreshCw },
                          { l: "Son Yükleme",         v: `${feed.lastImported} ürün`, icon: Package },
                          { l: "Son Hata",            v: feed.lastErrors === 0 ? "Hata yok" : `${feed.lastErrors} hata`, icon: AlertTriangle },
                        ].map(({ l, v, icon: Icon }) => (
                          <div key={l} className="bg-muted/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1 mb-1">
                              <Icon className="h-3 w-3 text-muted-foreground" />
                              <p className="text-[10px] text-muted-foreground">{l}</p>
                            </div>
                            <p className="text-xs font-semibold truncate">{v}</p>
                          </div>
                        ))}
                      </div>

                      {/* Alt satır: sonraki çalışma + otomatik tükendi */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {feed.status === "active" && feed.nextRun
                            ? <span>Sonraki: <strong className="text-foreground">{feed.nextRun}</strong></span>
                            : <span>Otomatik güncelleme duraklatildi</span>
                          }
                        </div>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <Switch
                            checked={feed.autoOutOfStock}
                            onCheckedChange={(v) => setFeeds((prev) => prev.map((f) => f.id === feed.id ? { ...f, autoOutOfStock: v } : f))}
                          />
                          <span className={feed.autoOutOfStock ? "text-foreground font-medium" : "text-muted-foreground"}>
                            Stok = 0 ise otomatik "Tükendi"
                          </span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {feeds.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground">
                  Henüz XML feed eklenmedi.
                </div>
              )}
            </div>

            {/* Bilgi notu */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-muted/30">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sistem her feed URL'sini belirlenen sıklıkta kontrol eder. Stok değeri 0'a düşen ürünler "Otomatik Tükendi" seçeneği aktifse anında pasife alınır. Fiyat değişiklikleri Pi cinsinden otomatik güncellenir.
              </p>
            </div>

            {/* ── Yeni Feed Ekle Dialog ── */}
            <Dialog open={feedDialogOpen} onOpenChange={setFeedDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Yeni XML Feed Ekle</DialogTitle>
                  <DialogDescription>Feed URL'si ve güncelleme sıklığını belirleyin.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Feed Etiketi</Label>
                    <Input
                      placeholder="Örn: Ana Ürün Feed'i"
                      value={feedForm.label ?? ""}
                      onChange={(e) => setFeedForm((p) => ({ ...p, label: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">XML Feed URL</Label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        className="pl-9 text-sm"
                        placeholder="https://magazaniz.com/urunler.xml"
                        value={feedForm.url ?? ""}
                        onChange={(e) => setFeedForm((p) => ({ ...p, url: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Güncelleme Sıklığı</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(FREQ_LABELS) as [CronFreq, string][]).map(([val, lbl]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFeedForm((p) => ({ ...p, frequency: val }))}
                          className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                            feedForm.frequency === val
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/40 text-foreground"
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5 flex-shrink-0" />{lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:border-primary/40 transition-colors">
                    <Switch
                      checked={feedForm.autoOutOfStock ?? true}
                      onCheckedChange={(v) => setFeedForm((p) => ({ ...p, autoOutOfStock: v }))}
                    />
                    <div>
                      <p className="text-sm font-medium">Stok = 0 ise otomatik Tükendi</p>
                      <p className="text-xs text-muted-foreground">Stok biten ürünler alıcılara gösterilmez.</p>
                    </div>
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setFeedDialogOpen(false)}>Vazgec</Button>
                  <Button
                    disabled={!feedForm.url?.trim() || !feedForm.label?.trim()}
                    onClick={() => {
                      const newFeed: XmlFeed = {
                        id: `F${Date.now()}`,
                        url: feedForm.url!.trim(),
                        label: feedForm.label!.trim(),
                        frequency: feedForm.frequency ?? "every6h",
                        status: "active",
                        lastRun: null,
                        nextRun: "Hesaplanıyor...",
                        lastImported: 0,
                        lastErrors: 0,
                        autoOutOfStock: feedForm.autoOutOfStock ?? true,
                      };
                      setFeeds((prev) => [...prev, newFeed]);
                      setFeedDialogOpen(false);
                      toast({ title: "Feed eklendi", description: `"${newFeed.label}" feed listesine alindi.`, duration: 2500 });
                    }}
                  >
                    Feed Ekle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ═══════════════════════════════════════════════════════
                EŞLEŞTİRME ARACI (Mapping Tool)
            ═══════════════════════════════════════════════════════ */}
            {mappingFeedId && (() => {
              const feed = feeds.find((f) => f.id === mappingFeedId);
              if (!feed) return null;
              return (
                <div className="border-2 border-primary/20 rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-primary/20">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4 text-primary" />
                      <p className="text-sm font-bold">Etiket Eşleştirme Aracı</p>
                      <span className="text-xs text-muted-foreground">— {feed.label}</span>
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setMappingFeedId(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Satıcı XML etiketlerini sürükleyerek UCB standart alanlarına bırakın.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">

                      {/* Sol: Satıcı XML etiketleri */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Satıcı XML Etiketleri</p>
                        <div className="space-y-1.5">
                          {vendorFields.map((field) => {
                            const isMapped = Object.values(mappings).includes(field);
                            return (
                              <div
                                key={field}
                                draggable
                                onDragStart={() => setDraggedField(field)}
                                onDragEnd={() => setDraggedField(null)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono cursor-grab active:cursor-grabbing transition-all select-none ${
                                  isMapped
                                    ? "border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800 text-green-700 dark:text-green-400"
                                    : "border-border bg-card hover:border-primary/40"
                                } ${draggedField === field ? "opacity-50 scale-95" : ""}`}
                              >
                                <GripVertical className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="flex-1">{"<"}{field}{">"}</span>
                                {isMapped && <CheckCircle2Icon className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Orta: ok */}
                      <div className="hidden sm:flex flex-col items-center justify-center pt-7 gap-1 text-muted-foreground">
                        <ArrowRightLeft className="h-4 w-4" />
                      </div>

                      {/* Sag: UCB hedef alanlar */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">UCB Standart Alanlar</p>
                        <div className="space-y-1.5">
                          {UCB_FIELDS.map((ucbField) => {
                            const mapped = mappings[ucbField.key];
                            const isOver = dragOverTarget === ucbField.key;
                            return (
                              <div
                                key={ucbField.key}
                                onDragOver={(e) => { e.preventDefault(); setDragOverTarget(ucbField.key); }}
                                onDragLeave={() => setDragOverTarget(null)}
                                onDrop={() => {
                                  if (draggedField) {
                                    setMappings((prev) => ({ ...prev, [ucbField.key]: draggedField }));
                                  }
                                  setDragOverTarget(null);
                                  setDraggedField(null);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all min-h-[36px] ${
                                  isOver
                                    ? "border-primary border-dashed bg-primary/5 scale-[1.02]"
                                    : mapped
                                    ? "border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
                                    : ucbField.required
                                    ? "border-destructive/40 bg-destructive/5 border-dashed"
                                    : "border-border border-dashed"
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-foreground">{"<"}{ucbField.label}{">"}</span>
                                    {ucbField.required && (
                                      <span className="text-[10px] text-destructive font-bold">Zorunlu</span>
                                    )}
                                  </div>
                                  {mapped ? (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-[10px] text-green-700 dark:text-green-400 font-mono">← {mapped}</span>
                                      <button
                                        onClick={() => setMappings((prev) => { const n = { ...prev }; delete n[ucbField.key]; return n; })}
                                        className="text-muted-foreground hover:text-destructive ml-1"
                                      >
                                        <XCircle className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{ucbField.hint}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Eksik zorunlu alan uyarısı */}
                    {(() => {
                      const missing = UCB_FIELDS.filter((f) => f.required && !mappings[f.key]);
                      if (missing.length === 0) return null;
                      return (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                          <span>Zorunlu alanlar henüz eşleştirilmedi: <strong>{missing.map((f) => f.label).join(", ")}</strong></span>
                        </div>
                      );
                    })()}

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm" onClick={() => setMappings({})}>Sıfırla</Button>
                      <Button
                        size="sm"
                        disabled={UCB_FIELDS.filter((f) => f.required).some((f) => !mappings[f.key])}
                        onClick={() => {
                          toast({ title: "Eşleştirme kaydedildi", description: "Feed senkronizasyonunda bu eşleştirme kullanılacak.", duration: 2500 });
                          setMappingFeedId(null);
                        }}
                      >
                        Eşleştirmeyi Kaydet
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}

          </TabsContent>

          {/* ── Mağaza Düzenle ── */}
          <TabsContent value="store-editor">
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-semibold">Mağaza Düzenle</h3>
              <p className="text-sm text-muted-foreground">Logo, kapak görseli/videosu, tema ve kategori sıralamanızı buradan yönetin.</p>
            </div>
            <StoreEditor
              onSave={() => toast({ title: "Mağaza güncellendi", description: "Değişiklikleriniz kaydedildi.", duration: 3000 })}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h3 className="text-lg font-semibold">Atölye Profili</h3>

            {/* Vitrin Videosu */}
            <StoreFrontVideo />

            {/* Otomatik Tercume */}
            <AutoTranslate />

            {/* Tatil Modu — yeni bileşen */}
            <HolidayModeCard />

            {/* Stok Uyarı Ayarları — yeni bileşen */}
            <StockAlertSettings />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Atölye Bilgileri</CardTitle>
                <CardDescription>Profilinizi güncelleyerek daha fazla müşteriye ulaşın</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  onSave={() => toast({ title: "Atölye profili güncellendi", description: "Değişiklikleriniz kaydedildi.", duration: 3000 })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── AI Asistan ── */}
          <TabsContent value="ai-asistan" className="mt-0">
            <Card>
              <CardContent className="p-4 h-[560px] flex flex-col">
                <AiChatPanel
                  apiEndpoint="/api/satici-ai"
                  userName={user?.name ?? user?.piUsername}
                  userGender="male"
                  title="Satıcı AI Asistanı"
                  subtitle="Panel kullanımı, XML feed, ürün yönetimi hakkında yardımcı olabilirim."
                  quickQuestions={[
                    "Nasıl ürün eklerim?",
                    "XML feed nasıl yüklerim?",
                    "Sipariş durumu nasıl güncellerim?",
                    "Stok uyarısı nasıl çalışır?",
                    "Analitik verilerimi nasıl okurum?",
                    "Mağazamı nasıl düzenlerim?",
                    "Komisyon oranı nedir?",
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
                  from="satici"
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
