"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdminKanban } from "@/components/admin-kanban";
import { AdminSellerScore } from "@/components/admin-seller-score";
import { AdminBroadcast } from "@/components/admin-broadcast";
import { AdminAIAssistant } from "@/components/admin-ai-assistant";
import { AdminCampaign } from "@/components/admin-campaign";
import { AdminPerformance } from "@/components/admin-performance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Legend, ComposedChart,
} from "recharts";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Store, Tag, Settings,
  RotateCcw, Megaphone, BarChart2, Bell, Search, Menu, X, LogOut,
  Eye, Edit, Trash2, CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown,
  Wallet, Plus, Download, Star, Truck, AlertTriangle, Check, Ban, Activity,
  Globe, ChevronRight, Percent, FileText, Send, Target, Award,
  Filter, ArrowUpRight, ShieldCheck, AlertCircle, Copy,
  Printer, MapPin, Calendar, CreditCard, Terminal,
  Key, Mail, Building, Package2, UserCheck,
  ExternalLink, Zap, RefreshCw, ArrowDownRight, Layers,
  Phone, ChevronDown, ChevronUp, MoreVertical, PieChart as PieIcon,
  Image as ImageIcon,
  Lock, Hash, MessageSquare, DollarSign, UserPlus, Info, Sliders,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "dashboard"|"orders"|"products"|"sellers"|"members"|"returns"|"finance"|"coupons"|"reports"|"marketing"|"applications"|"logs"|"settings"|"kanban"|"seller-scores"|"broadcast"|"ai-assistant"|"gorusler";
type OrderStatus  = "hazirlaniyor"|"kargoda"|"teslim_edildi"|"iptal";
type UserStatus   = "aktif"|"askida"|"yasakli";
type ProductStatus = "aktif"|"taslak"|"beklemede";

interface Order   { id:string; user:string; product:string; seller:string; amount:number; status:OrderStatus; date:string; trackingNo?:string; address?:string; payMethod?:string; items?:number; city?:string; }
interface Member  { id:string; name:string; email:string; role:string; orders:number; joinDate:string; status:UserStatus; totalSpent:number; city:string; phone?:string; segment?:string; }
interface Seller  { id:string; name:string; category:string; city:string; joinDate:string; status:UserStatus; products:number; sales:number; rating:number; verified:boolean; commission:number; totalRevenue:number; badge:string; phone?:string; bank?:string; }
interface Product { id:string; name:string; seller:string; category:string; price:number; stock:number; status:ProductStatus; sales:number; rating:number; views:number; }
interface Coupon  { id:string; code:string; type:"percentage"|"fixed"; value:number; minPurchase:number; validUntil:string; usedCount:number; limit:number; active:boolean; }
interface Refund  { id:string; orderId:string; user:string; product:string; amount:number; reason:string; status:"bekliyor"|"onaylandi"|"reddedildi"; date:string; images?:number; }
interface Notif   { id:string; text:string; time:string; read:boolean; type:"order"|"seller"|"refund"|"system"; }
interface Application {
  id: string; name: string; email: string; phone: string; city: string; country: string;
  category: string; date: string; status: "bekliyor" | "incelemede" | "onaylandi" | "reddedildi";
  bio: string; experience: string;
  // Pi Auth & KYC
  piUsername: string; piUid: string; walletAddress: string;
  kycStatus: "verified" | "pending" | "failed";
  livenessPhoto: string;          // base64 veya URL
  // Yasal
  sellerType: "individual" | "corporate"; taxId?: string;
  // Lojistik
  storeName: string; shippingCountries: string[]; ownCargo: boolean;
  // Ürün örnekleri (min 3)
  portfolioImages: string[];
  adminNote?: string;
}
interface LogEntry { id:string; admin:string; action:string; target:string; ip:string; time:string; level:"info"|"warning"|"error"; module:string; }
interface Payment  { id:string; seller:string; amount:number; period:string; status:"bekliyor"|"odendi"|"beklemede"; date:string; bank?:string; }

const CREDS = { username: "hanedan", password: "753159" };

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MONTHLY = [
  { ay:"Eki",  gelir:18200, siparis:312, iade:18, uye:89  },
  { ay:"Kas",  gelir:21400, siparis:378, iade:22, uye:112 },
  { ay:"Ara",  gelir:28900, siparis:512, iade:31, uye:187 },
  { ay:"Oca",  gelir:24100, siparis:421, iade:25, uye:143 },
  { ay:"Şub",  gelir:26800, siparis:467, iade:28, uye:156 },
  { ay:"Mar",  gelir:32400, siparis:589, iade:34, uye:201 },
];
const WEEKLY = [
  { gun:"Pzt", siparis:48, gelir:3800 },
  { gun:"Sal", siparis:62, gelir:5100 },
  { gun:"Çar", siparis:55, gelir:4400 },
  { gun:"Per", siparis:71, gelir:5800 },
  { gun:"Cum", siparis:88, gelir:7200 },
  { gun:"Cmt", siparis:94, gelir:7900 },
  { gun:"Paz", siparis:76, gelir:6300 },
];
const HOURLY = [
  { saat:"00-04",v:8},{saat:"04-08",v:15},{saat:"08-12",v:52},{saat:"12-16",v:78},
  { saat:"16-20",v:91},{saat:"20-24",v:64},
];
const CAT_DATA = [
  { name:"Elektronik", value:28, color:"#f27a1a" },
  { name:"Moda",       value:22, color:"#3b82f6" },
  { name:"Ev & Yaşam", value:19, color:"#10b981" },
  { name:"Spor",       value:15, color:"#8b5cf6" },
  { name:"Diğer",      value:16, color:"#6b7280" },
];
const INIT_ORDERS: Order[] = [
  { id:"#UCB-001", user:"Ahmet Yılmaz",   product:"Galaxy S24",            seller:"TechPlus",       amount:8200, status:"kargoda",        date:"2026-03-09", trackingNo:"TR489012345", address:"Kadıköy, İstanbul", payMethod:"Pi", items:1, city:"İstanbul" },
  { id:"#UCB-002", user:"Fatma Demir",    product:"Deri Çanta",            seller:"ModaElite",      amount:850,  status:"teslim_edildi",  date:"2026-03-08", address:"Çankaya, Ankara", payMethod:"Pi", items:2, city:"Ankara" },
  { id:"#UCB-003", user:"Mehmet Kaya",    product:"Spor Ayakkabı",         seller:"SportZone",      amount:1200, status:"hazirlaniyor",   date:"2026-03-09", address:"Konak, İzmir", payMethod:"Pi", items:1, city:"İzmir" },
  { id:"#UCB-004", user:"Ayşe Çelik",     product:"Kütüphane Kitaplığı",  seller:"AhşapSanat",     amount:3400, status:"iptal",          date:"2026-03-07", address:"Nilüfer, Bursa", payMethod:"Pi", items:1, city:"Bursa" },
  { id:"#UCB-005", user:"Can Arslan",     product:"Laptop Stand",          seller:"OfficePro",      amount:650,  status:"kargoda",        date:"2026-03-09", trackingNo:"TR512345678", address:"Muratpaşa, Antalya", payMethod:"Pi", items:3, city:"Antalya" },
  { id:"#UCB-006", user:"Selin Yıldız",  product:"Kahve Makinesi",        seller:"HomeStyle",      amount:2800, status:"teslim_edildi",  date:"2026-03-06", address:"Bornova, İzmir", payMethod:"Pi", items:1, city:"İzmir" },
  { id:"#UCB-007", user:"Emre Doğan",    product:"Bluetooth Kulaklık",    seller:"TechPlus",       amount:1800, status:"hazirlaniyor",   date:"2026-03-09", address:"Beşiktaş, İstanbul", payMethod:"Pi", items:2, city:"İstanbul" },
  { id:"#UCB-008", user:"Zeynep Öztürk", product:"Yoga Matı",             seller:"FitLife",        amount:420,  status:"kargoda",        date:"2026-03-08", trackingNo:"TR612345001", address:"Keçiören, Ankara", payMethod:"Pi", items:2, city:"Ankara" },
];
const INIT_PRODUCTS: Product[] = [
  { id:"P001", name:"Galaxy S24 Ultra",        seller:"TechPlus",    category:"Elektronik", price:9800, stock:12,  status:"aktif",    sales:48,  rating:4.8, views:3240 },
  { id:"P002", name:"Deri Cüzdan",             seller:"ModaElite",   category:"Moda",       price:380,  stock:0,   status:"aktif",    sales:127, rating:4.6, views:5810 },
  { id:"P003", name:"Ahşap Masa Lambası",       seller:"AhşapSanat", category:"Ev & Yaşam", price:890,  stock:3,   status:"aktif",    sales:34,  rating:4.9, views:2100 },
  { id:"P004", name:"Spor Koşu Ayakkabısı",    seller:"SportZone",   category:"Spor",       price:1450, stock:28,  status:"aktif",    sales:91,  rating:4.7, views:6720 },
  { id:"P005", name:"Kablosuz Fare",            seller:"OfficePro",   category:"Elektronik", price:320,  stock:1,   status:"aktif",    sales:203, rating:4.5, views:8910 },
  { id:"P006", name:"Keten Gömlek",             seller:"ModaElite",   category:"Moda",       price:560,  stock:45,  status:"aktif",    sales:67,  rating:4.3, views:3820 },
  { id:"P007", name:"Akıllı Saat",              seller:"TechPlus",    category:"Elektronik", price:4200, stock:8,   status:"beklemede",sales:12,  rating:4.7, views:1540 },
  { id:"P008", name:"Yoga Matı Premium",        seller:"FitLife",     category:"Spor",       price:580,  stock:0,   status:"aktif",    sales:156, rating:4.4, views:7230 },
  { id:"P009", name:"Kahve Öğütücüsü",          seller:"HomeStyle",   category:"Ev & Yaşam", price:1100, stock:19,  status:"aktif",    sales:43,  rating:4.6, views:2980 },
  { id:"P010", name:"Bisiklet Kaskı",           seller:"SportZone",   category:"Spor",       price:750,  stock:0,   status:"taslak",   sales:0,   rating:0,   views:320  },
];
const INIT_SELLERS: Seller[] = [
  { id:"S001", name:"TechPlus",    category:"Elektronik", city:"İstanbul", joinDate:"2024-06-15", status:"aktif",  products:24, sales:312, rating:4.8, verified:true,  commission:8,  totalRevenue:128400, badge:"Platin", phone:"0532 111 2233", bank:"Ziraat Bankası" },
  { id:"S002", name:"ModaElite",   category:"Moda",       city:"İzmir",    joinDate:"2024-08-20", status:"aktif",  products:67, sales:891, rating:4.6, verified:true,  commission:10, totalRevenue:89600,  badge:"Altın",  phone:"0533 222 3344", bank:"İş Bankası" },
  { id:"S003", name:"AhşapSanat", category:"Ev & Yaşam", city:"Ankara",   joinDate:"2024-11-05", status:"aktif",  products:18, sales:143, rating:4.9, verified:false, commission:12, totalRevenue:42800,  badge:"Gümüş", phone:"0534 333 4455", bank:"Garanti" },
  { id:"S004", name:"SportZone",   category:"Spor",       city:"Bursa",    joinDate:"2025-01-12", status:"aktif",  products:41, sales:276, rating:4.7, verified:true,  commission:9,  totalRevenue:67200,  badge:"Altın",  phone:"0535 444 5566", bank:"Akbank" },
  { id:"S005", name:"OfficePro",   category:"Elektronik", city:"Antalya",  joinDate:"2025-02-28", status:"askida", products:12, sales:87,  rating:4.3, verified:false, commission:10, totalRevenue:18900,  badge:"Bronz",  phone:"0536 555 6677", bank:"Yapı Kredi" },
  { id:"S006", name:"HomeStyle",   category:"Ev & Yaşam", city:"Adana",    joinDate:"2025-03-15", status:"aktif",  products:33, sales:198, rating:4.5, verified:true,  commission:11, totalRevenue:51300,  badge:"Gümüş", phone:"0537 666 7788", bank:"Vakıfbank" },
  { id:"S007", name:"FitLife",     category:"Spor",       city:"İstanbul", joinDate:"2025-04-10", status:"aktif",  products:29, sales:421, rating:4.6, verified:true,  commission:9,  totalRevenue:73400,  badge:"Altın",  phone:"0538 777 8899", bank:"Halkbank" },
];
const INIT_MEMBERS: Member[] = [
  { id:"M001", name:"Ahmet Yılmaz",   email:"ahmet@email.com",   role:"buyer",  orders:12, joinDate:"2024-08-15", status:"aktif",  totalSpent:8640,  city:"İstanbul", phone:"0532 100 1111", segment:"VIP"    },
  { id:"M002", name:"Fatma Demir",    email:"fatma@email.com",   role:"buyer",  orders:28, joinDate:"2024-07-20", status:"aktif",  totalSpent:18920, city:"Ankara",   phone:"0533 200 2222", segment:"VIP"    },
  { id:"M003", name:"Mehmet Kaya",    email:"mehmet@email.com",  role:"seller", orders:4,  joinDate:"2024-11-10", status:"aktif",  totalSpent:2400,  city:"İzmir",    phone:"0534 300 3333", segment:"Normal" },
  { id:"M004", name:"Ayşe Çelik",     email:"ayse@email.com",    role:"buyer",  orders:2,  joinDate:"2025-01-05", status:"askida", totalSpent:1200,  city:"Bursa",    phone:"0535 400 4444", segment:"Pasif"  },
  { id:"M005", name:"Can Arslan",     email:"can@email.com",     role:"buyer",  orders:7,  joinDate:"2024-09-22", status:"aktif",  totalSpent:5870,  city:"Antalya",  phone:"0536 500 5555", segment:"Normal" },
  { id:"M006", name:"Selin Yıldız",  email:"selin@email.com",   role:"seller", orders:0,  joinDate:"2025-02-14", status:"aktif",  totalSpent:0,     city:"İzmir",    phone:"0537 600 6666", segment:"Normal" },
  { id:"M007", name:"Emre Doğan",    email:"emre@email.com",    role:"buyer",  orders:41, joinDate:"2024-06-30", status:"aktif",  totalSpent:31200, city:"İstanbul", phone:"0538 700 7777", segment:"VIP"    },
  { id:"M008", name:"Zeynep Öztürk", email:"zeynep@email.com",  role:"buyer",  orders:1,  joinDate:"2025-03-01", status:"aktif",  totalSpent:420,   city:"Ankara",   phone:"0539 800 8888", segment:"Pasif"  },
];
const INIT_COUPONS: Coupon[] = [
  { id:"COP001", code:"HOSGELDIN20",  type:"percentage", value:20, minPurchase:500,  validUntil:"2026-12-31", usedCount:234, limit:500,  active:true  },
  { id:"COP002", code:"BAHAR2026",    type:"percentage", value:15, minPurchase:300,  validUntil:"2026-04-30", usedCount:89,  limit:200,  active:true  },
  { id:"COP003", code:"PI100",        type:"fixed",      value:100,minPurchase:1000, validUntil:"2026-06-30", usedCount:45,  limit:100,  active:true  },
  { id:"COP004", code:"KARGO0",       type:"fixed",      value:50, minPurchase:200,  validUntil:"2026-03-31", usedCount:198, limit:200,  active:false },
];
const INIT_REFUNDS: Refund[] = [
  { id:"R001", orderId:"#UCB-022", user:"Kemal Aydın",    product:"Laptop Stand",       amount:650,  reason:"Ürün açıklamayla uyuşmuyor", status:"bekliyor",   date:"2026-03-08", images:3 },
  { id:"R002", orderId:"#UCB-018", user:"Büşra Kara",    product:"Deri Cüzdan",        amount:380,  reason:"Yanlış renk gönderildi",      status:"onaylandi",  date:"2026-03-07", images:2 },
  { id:"R003", orderId:"#UCB-031", user:"Tarık Şahin",   product:"Bluetooth Kulaklık", amount:1800, reason:"Cihaz çalışmıyor",            status:"bekliyor",   date:"2026-03-09", images:5 },
  { id:"R004", orderId:"#UCB-015", user:"Nergiz Polat",  product:"Spor Ayakkabı",      amount:1200, reason:"Beden uyumsuzluğu",           status:"reddedildi", date:"2026-03-06", images:1 },
];
const PORTFOLIO_PH = (n: number) => `/placeholder.svg?height=120&width=120&text=Urun${n}`;
const LIVENESS_PH  = `/placeholder.svg?height=200&width=200&text=Selfie`;
const INIT_APPLICATIONS: Application[] = [
  {
    id:"A001", name:"Hasan Kılıç", email:"hasan@email.com", phone:"0532 444 5566",
    city:"Gaziantep", country:"Türkiye", category:"El Sanatları", date:"2026-03-08",
    status:"bekliyor", bio:"10 yıldır tekstil sektöründeyim. Özel el dokuması kıyafetler ve halılar üretiyorum.", experience:"10 yıl",
    piUsername:"hasankilic_pi", piUid:"PI-UID-001", walletAddress:"GCKFBEIYTKP6AIQSW4MCI2R6EKAGOXP5KIXNZ3MLIQZASOVQ3",
    kycStatus:"verified", livenessPhoto:LIVENESS_PH, sellerType:"individual", taxId:"",
    storeName:"Hasan Dokuma Atölyesi", shippingCountries:["Türkiye","Avrupa","Orta Doğu"], ownCargo:false,
    portfolioImages:[PORTFOLIO_PH(1), PORTFOLIO_PH(2), PORTFOLIO_PH(3)],
  },
  {
    id:"A002", name:"Sibel Arslan", email:"sibel@email.com", phone:"0533 555 6677",
    city:"Konya", country:"Türkiye", category:"Gıda & İçecek", date:"2026-03-07",
    status:"incelemede", bio:"Organik gıda üreticisiyim. Sertifikalı çiftliğim bulunmaktadır. Doğal zeytinyağı ve peynir çeşitleri.", experience:"5 yıl",
    piUsername:"sibel_organik", piUid:"PI-UID-002", walletAddress:"GCKFBEIYTKP6AIQSW4MCI2R6EKAGOXP5KIXNZ3MLIQZASOV1",
    kycStatus:"verified", livenessPhoto:LIVENESS_PH, sellerType:"corporate", taxId:"1234567890",
    storeName:"Doğal Çiftlik", shippingCountries:["Türkiye"], ownCargo:true,
    portfolioImages:[PORTFOLIO_PH(1), PORTFOLIO_PH(2), PORTFOLIO_PH(3), PORTFOLIO_PH(4)],
  },
  {
    id:"A003", name:"Barış Yılmaz", email:"baris@email.com", phone:"0534 666 7788",
    city:"İstanbul", country:"Türkiye", category:"Elektronik", date:"2026-03-06",
    status:"onaylandi", bio:"Elektronik satış alanında 7 yıllık deneyimim var. Akıllı ev sistemleri ve aksesuarları satıyorum.", experience:"7 yıl",
    piUsername:"baris_tech", piUid:"PI-UID-003", walletAddress:"GCKFBEIYTKP6AIQSW4MCI2R6EKAGOXP5KIXNZ3MLIQZASOV2",
    kycStatus:"verified", livenessPhoto:LIVENESS_PH, sellerType:"corporate", taxId:"9876543210",
    storeName:"TechBariş Store", shippingCountries:["Tüm Dünya"], ownCargo:true,
    portfolioImages:[PORTFOLIO_PH(1), PORTFOLIO_PH(2), PORTFOLIO_PH(3)],
    adminNote:"Mağaza detayları eksiksiz, onaylandı.",
  },
  {
    id:"A004", name:"Merve Doğan", email:"merve@email.com", phone:"0535 777 8899",
    city:"Antalya", country:"Türkiye", category:"Moda & Giyim", date:"2026-03-05",
    status:"reddedildi", bio:"Doğal kozmetik ürünleri üretiyorum.", experience:"3 yıl",
    piUsername:"merve_beauty", piUid:"PI-UID-004", walletAddress:"GCKFBEIYTKP6AIQSW4MCI2R6EKAGOXP5KIXNZ3MLIQZASOV3",
    kycStatus:"pending", livenessPhoto:"", sellerType:"individual", taxId:"",
    storeName:"Merve Natural", shippingCountries:["Türkiye"], ownCargo:false,
    portfolioImages:[PORTFOLIO_PH(1), PORTFOLIO_PH(2)],
    adminNote:"Ürün örneği sayısı yetersiz (min. 3 gerekli). KYC bekleniyor.",
  },
];
const INIT_LOGS: LogEntry[] = [
  { id:"L001", admin:"hanedan", action:"Sipariş durumu güncellendi",   target:"#UCB-001",    ip:"192.168.1.10", time:"2026-03-09 14:32", level:"info",    module:"Siparişler" },
  { id:"L002", admin:"hanedan", action:"Satıcı askıya alındı",         target:"OfficePro",   ip:"192.168.1.10", time:"2026-03-09 13:18", level:"warning", module:"Satıcılar"  },
  { id:"L003", admin:"hanedan", action:"Üye yasaklandı",               target:"M009",        ip:"192.168.1.10", time:"2026-03-09 11:45", level:"error",   module:"Üyeler"     },
  { id:"L004", admin:"hanedan", action:"Yeni kupon oluşturuldu",       target:"BAHAR2026",   ip:"192.168.1.10", time:"2026-03-09 10:20", level:"info",    module:"Kuponlar"   },
  { id:"L005", admin:"hanedan", action:"Ürün silindi",                  target:"Bisiklet Kaskı",ip:"192.168.1.10",time:"2026-03-09 09:55",level:"warning", module:"Ürünler"    },
  { id:"L006", admin:"hanedan", action:"Başvuru onaylandı",            target:"Barış Yılmaz",ip:"192.168.1.10", time:"2026-03-08 16:40", level:"info",    module:"Başvurular" },
  { id:"L007", admin:"hanedan", action:"Ayarlar güncellendi",          target:"Platform",    ip:"192.168.1.10", time:"2026-03-08 15:12", level:"info",    module:"Ayarlar"    },
  { id:"L008", admin:"hanedan", action:"Toplu ürün aktifleştirildi",   target:"3 ürün",      ip:"192.168.1.10", time:"2026-03-08 14:03", level:"info",    module:"Ürünler"    },
  { id:"L009", admin:"hanedan", action:"İade reddedildi",              target:"R004",        ip:"192.168.1.10", time:"2026-03-08 12:22", level:"warning", module:"İadeler"    },
  { id:"L010", admin:"hanedan", action:"Satıcı ödeme onaylandı",       target:"TechPlus",   ip:"192.168.1.10", time:"2026-03-07 17:00", level:"info",    module:"Finans"     },
];
const INIT_PAYMENTS: Payment[] = [
  { id:"PAY001", seller:"TechPlus",   amount:18240, period:"Şubat 2026", status:"bekliyor", date:"2026-03-10", bank:"Ziraat Bankası" },
  { id:"PAY002", seller:"ModaElite",  amount:12800, period:"Şubat 2026", status:"bekliyor", date:"2026-03-10", bank:"İş Bankası"    },
  { id:"PAY003", seller:"SportZone",  amount:9600,  period:"Şubat 2026", status:"odendi",   date:"2026-03-05", bank:"Akbank"        },
  { id:"PAY004", seller:"FitLife",    amount:10500, period:"Şubat 2026", status:"odendi",   date:"2026-03-04", bank:"Halkbank"      },
  { id:"PAY005", seller:"HomeStyle",  amount:7300,  period:"Şubat 2026", status:"bekliyor", date:"2026-03-10", bank:"Vakıfbank"     },
  { id:"PAY006", seller:"AhşapSanat",amount:6100,  period:"Şubat 2026", status:"beklemede",date:"2026-03-15", bank:"Garanti"       },
];
const INIT_NOTIFS: Notif[] = [
  { id:"N001", text:"Yeni sipariş: #UCB-008 — Zeynep Öztürk",           time:"5 dk önce",  read:false, type:"order"  },
  { id:"N002", text:"İade talebi: Tarık Şahin — Bluetooth Kulaklık",    time:"18 dk önce", read:false, type:"refund" },
  { id:"N003", text:"Yeni satıcı başvurusu: Hasan Kılıç",               time:"42 dk önce", read:false, type:"seller" },
  { id:"N004", text:"TechPlus satıcısı ödeme bekliyor: 18.240π",         time:"1 sa önce",  read:true,  type:"system" },
  { id:"N005", text:"Stok uyarısı: Deri Cüzdan — Stok tükendi",         time:"2 sa önce",  read:true,  type:"system" },
  { id:"N006", text:"Yeni sipariş: #UCB-007 — Emre Doğan",              time:"3 sa önce",  read:true,  type:"order"  },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
const orderStatusColor: Record<OrderStatus,string>   = { hazirlaniyor:"bg-amber-100 text-amber-700",  kargoda:"bg-blue-100 text-blue-700",  teslim_edildi:"bg-green-100 text-green-700",  iptal:"bg-red-100 text-red-700"    };
const orderStatusLabel: Record<OrderStatus,string>   = { hazirlaniyor:"Hazırlanıyor", kargoda:"Kargoda", teslim_edildi:"Teslim Edildi", iptal:"İptal" };
const userStatusColor:  Record<UserStatus,string>    = { aktif:"bg-green-100 text-green-700", askida:"bg-amber-100 text-amber-700", yasakli:"bg-red-100 text-red-700" };
const pStatusColor: Record<ProductStatus,string>     = { aktif:"bg-green-100 text-green-700", taslak:"bg-gray-100 text-gray-600", beklemede:"bg-amber-100 text-amber-700" };
const pStatusLabel: Record<ProductStatus,string>     = { aktif:"Aktif", taslak:"Taslak", beklemede:"Beklemede" };
const badgeColor: Record<string,string>              = { Platin:"border-purple-300 bg-purple-50 text-purple-700", Altın:"border-yellow-300 bg-yellow-50 text-yellow-700", Gümüş:"border-gray-300 bg-gray-50 text-gray-700", Bronz:"border-amber-300 bg-amber-50 text-amber-700" };
const segmentColor: Record<string,string>            = { VIP:"bg-yellow-100 text-yellow-800", Normal:"bg-blue-100 text-blue-700", Pasif:"bg-gray-100 text-gray-500" };
const notifTypeColor: Record<string,string>          = { order:"bg-blue-100 text-blue-600", seller:"bg-purple-100 text-purple-600", refund:"bg-red-100 text-red-600", system:"bg-gray-100 text-gray-600" };
const logLevelColor: Record<string,string>           = { info:"bg-blue-100 text-blue-700", warning:"bg-amber-100 text-amber-700", error:"bg-red-100 text-red-700" };

function SearchBar({ value, onChange, placeholder }: { value:string; onChange:(v:string)=>void; placeholder?:string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none"/>
      <Input className="pl-9 h-9 text-sm" placeholder={placeholder||"Ara..."} value={value} onChange={e=>onChange(e.target.value)}/>
    </div>
  );
}
function SectionHeader({ title, desc, action }: { title:string; desc?:string; action?:React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div><h2 className="text-lg font-bold tracking-tight">{title}</h2>{desc && <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>}</div>
      {action && <div>{action}</div>}
    </div>
  );
}
function KpiCard({ title, value, sub, icon, trend, trendUp, onClick }: { title:string; value:string; sub?:string; icon:React.ReactNode; trend?:string; trendUp?:boolean; onClick?:()=>void }) {
  return (
    <Card className={`border border-border shadow-none ${onClick?"cursor-pointer hover:border-primary/40 transition-colors":""}`} onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">{icon}</div>
        </div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp?"text-green-600":"text-red-500"}`}>
            {trendUp ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}
            {trend} geçen aya göre
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardSection({ orders, products, sellers, members, onNav }: {
  orders:Order[]; products:Product[]; sellers:Seller[]; members:Member[]; onNav:(s:Section)=>void;
}) {
  const [clock, setClock] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  const pendingOrders  = orders.filter(o=>o.status==="hazirlaniyor").length;
  const totalRevenue   = MONTHLY.reduce((s,m)=>s+m.gelir, 0);
  const criticalStock  = products.filter(p=>p.stock<=3&&p.status==="aktif").length;
  const pendingApps    = applications.filter(a => a.status === "bekliyor" || a.status === "incelemede").length;

  const goals = [
    { label:"Aylık Ciro Hedefi",   current:32400,  target:40000, unit:"π",  color:"bg-orange-400"  },
    { label:"Yeni Üye Hedefi",     current:201,    target:250,   unit:" üye", color:"bg-blue-500"  },
    { label:"Sipariş Hedefi",      current:589,    target:700,   unit:" sipariş", color:"bg-green-500" },
    { label:"Satıcı Hedefi",       current:sellers.filter(s=>s.status==="aktif").length, target:20, unit:" satıcı", color:"bg-purple-500" },
  ];

  const topProducts = [...products].sort((a,b)=>b.sales-a.sales).slice(0,5);
  const topSellers  = [...sellers].sort((a,b)=>b.totalRevenue-a.totalRevenue).slice(0,5);

  const miniMetrics = [
    { label:"Dönüşüm Oranı",    value:"%3.8",   up:true,  delta:"+0.4%"  },
    { label:"Ortalama Sepet",   value:"248π",   up:true,  delta:"+12π"   },
    { label:"İade Oranı",       value:"%5.7",   up:false, delta:"+0.8%"  },
    { label:"Müşteri Memnun.",  value:"4.7/5",  up:true,  delta:"+0.2"   },
    { label:"Tekrar Alım",      value:"%42",    up:true,  delta:"+3%"    },
    { label:"Aktif Satıcı",     value:`${sellers.filter(s=>s.status==="aktif").length}`, up:true, delta:"+2"  },
  ];

  return (
    <div className="space-y-5">
      {/* Alert bar */}
      {(pendingOrders>0 || criticalStock>0 || pendingApps>0) && (
        <div className="flex items-center gap-3 flex-wrap bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0"/>
          <div className="flex items-center gap-3 flex-wrap text-sm">
            {pendingOrders>0 && <button onClick={()=>onNav("orders")} className="text-amber-800 font-semibold hover:underline">{pendingOrders} bekleyen sipariş</button>}
            {criticalStock>0 && <button onClick={()=>onNav("products")} className="text-amber-800 font-semibold hover:underline">{criticalStock} kritik stok</button>}
            {pendingApps>0   && <button onClick={()=>onNav("applications")} className="text-amber-800 font-semibold hover:underline">{pendingApps} bekleyen başvuru</button>}
          </div>
          <div className="ml-auto text-xs text-amber-600 font-mono">
            {clock.toLocaleTimeString("tr-TR")}
          </div>
        </div>
      )}

      {/* Mini metrics strip */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {miniMetrics.map(m=>(
          <Card key={m.label} className="border border-border shadow-none">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground truncate">{m.label}</p>
              <p className="text-base font-bold mt-0.5">{m.value}</p>
              <p className={`text-xs mt-0.5 font-medium ${m.up?"text-green-600":"text-red-500"}`}>{m.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="Toplam Ciro" value={`${(totalRevenue/1000).toFixed(1)}k π`} sub="Son 6 ay" icon={<TrendingUp className="h-5 w-5 text-primary"/>} trend="+21%" trendUp onClick={()=>onNav("reports")}/>
        <KpiCard title="Toplam Sipariş" value={MONTHLY.reduce((s,m)=>s+m.siparis,0).toString()} sub="Son 6 ay" icon={<ShoppingBag className="h-5 w-5 text-blue-600"/>} trend="+18%" trendUp onClick={()=>onNav("orders")}/>
        <KpiCard title="Aktif Üye" value={members.filter(m=>m.status==="aktif").length.toString()} sub={`${members.filter(m=>m.segment==="VIP").length} VIP üye`} icon={<Users className="h-5 w-5 text-purple-600"/>} trend="+14%" trendUp onClick={()=>onNav("members")}/>
        <KpiCard title="Aktif Satıcı" value={sellers.filter(s=>s.status==="aktif").length.toString()} sub={`${sellers.filter(s=>s.verified).length} doğrulanmış`} icon={<Store className="h-5 w-5 text-green-600"/>} trend="+8%" trendUp onClick={()=>onNav("sellers")}/>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border border-border shadow-none lg:col-span-2">
          <CardHeader className="px-5 pt-5 pb-2 flex-row items-center justify-between">
            <div><CardTitle className="text-sm font-semibold">Gelir & Sipariş Trendi</CardTitle><CardDescription className="text-xs">Son 6 aylık performans</CardDescription></div>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={MONTHLY}>
                <defs>
                  <linearGradient id="gelirGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f27a1a" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f27a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="ay" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{fontSize:12,borderRadius:8}}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Area type="monotone" dataKey="gelir"   stroke="#f27a1a" strokeWidth={2.5} fill="url(#gelirGrad)" name="Gelir (π)"/>
                <Bar dataKey="siparis" fill="#3b82f6" opacity={0.7} name="Sipariş" radius={[3,3,0,0]} barSize={10}/>
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-2"><CardTitle className="text-sm font-semibold">Kategori Dağılımı</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={CAT_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={3}>
                  {CAT_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <RTooltip formatter={(v:number)=>`%${v}`} contentStyle={{fontSize:11,borderRadius:8}}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {CAT_DATA.map(c=>(
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:c.color}}/><span className="text-muted-foreground">{c.name}</span></div>
                  <span className="font-bold">%{c.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals + Hourly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">Aylık Hedefler</CardTitle></CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            {goals.map(g=>{
              const pct = Math.min(Math.round((g.current/g.target)*100),100);
              return (
                <div key={g.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium">{g.label}</span>
                    <span className="text-xs text-muted-foreground font-medium">{pct}% <span className="text-muted-foreground/60">({g.current}{g.unit})</span></span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className={`${g.color} h-2.5 rounded-full transition-all`} style={{width:`${pct}%`}}/>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card className="border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">Saatlik Sipariş Yoğunluğu</CardTitle></CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={158}>
              <BarChart data={HOURLY} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="saat" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{fontSize:11,borderRadius:8}} formatter={(v:number)=>[v,"Sipariş"]}/>
                <Bar dataKey="v" fill="#f27a1a" radius={[4,4,0,0]} name="Sipariş"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top products + Top sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">En Çok Satan Ürünler</CardTitle>
            <button onClick={()=>onNav("products")} className="text-xs text-primary hover:underline flex items-center gap-0.5">Tümü<ChevronRight className="h-3 w-3"/></button>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            {topProducts.map((p,i)=>(
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i===0?"bg-yellow-400 text-white":i===1?"bg-gray-300 text-gray-700":i===2?"bg-amber-700 text-white":"bg-muted text-muted-foreground"}`}>{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.seller}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-primary">{p.price.toLocaleString()}π</p>
                  <p className="text-xs text-muted-foreground">{p.sales} satış</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border border-border shadow-none">
          <CardHeader className="px-5 pt-5 pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">En İyi Satıcılar</CardTitle>
            <button onClick={()=>onNav("sellers")} className="text-xs text-primary hover:underline flex items-center gap-0.5">Tümü<ChevronRight className="h-3 w-3"/></button>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            {topSellers.map((s,i)=>(
              <div key={s.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0"><AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xs">{s.name[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold truncate">{s.name}</p>
                    {s.verified && <ShieldCheck className="h-3 w-3 text-blue-500 flex-shrink-0"/>}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-primary">{(s.totalRevenue/1000).toFixed(1)}k π</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${badgeColor[s.badge]||""}`}>{s.badge}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card className="border border-border shadow-none">
        <CardHeader className="px-5 pt-5 pb-3 flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Son Siparişler</CardTitle>
          <button onClick={()=>onNav("orders")} className="text-xs text-primary hover:underline flex items-center gap-0.5">Tümü<ChevronRight className="h-3 w-3"/></button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>{["Sipariş","Müşteri","Ürün","Tutar","Durum","Tarih"].map(h=><th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0,6).map(o=>(
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-primary">{o.id}</td>
                  <td className="px-5 py-3 text-xs font-medium">{o.user}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{o.product}</td>
                  <td className="px-5 py-3 text-xs font-bold">{o.amount.toLocaleString()}π</td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderStatusColor[o.status]}`}>{orderStatusLabel[o.status]}</span></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function OrdersSection({ orders, setOrders }: { orders:Order[]; setOrders:React.Dispatch<React.SetStateAction<Order[]>> }) {
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState<"all"|OrderStatus>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail,   setDetail]   = useState<Order|null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const { toast } = useToast();

  const filtered = useMemo(()=>orders.filter(o=>{
    const q=search.toLowerCase();
    const matchQ = o.id.toLowerCase().includes(q)||o.user.toLowerCase().includes(q)||o.product.toLowerCase().includes(q)||o.seller.toLowerCase().includes(q);
    const matchS = statusF==="all"||o.status===statusF;
    const matchD = (!dateFrom||o.date>=dateFrom)&&(!dateTo||o.date<=dateTo);
    return matchQ&&matchS&&matchD;
  }),[orders,search,statusF,dateFrom,dateTo]);

  const updateStatus = useCallback((id:string, status:OrderStatus)=>{
    setOrders(prev=>prev.map(o=>o.id===id?{...o,status}:o));
    setDetail(prev=>prev?.id===id?{...prev,status}:prev);
    toast({title:`Sipariş ${orderStatusLabel[status]} olarak güncellendi`});
  },[setOrders,toast]);

  const bulkUpdate = (status:OrderStatus) => {
    setOrders(prev=>prev.map(o=>selected.has(o.id)?{...o,status}:o));
    toast({title:`${selected.size} sipariş güncellendi`}); setSelected(new Set());
  };
  const toggleSelect = (id:string) => setSelected(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});

  const timeline = (o:Order) => [
    { label:"Sipariş Alındı",      icon:<CheckCircle2 className="h-3 w-3"/>, done:true },
    { label:"Hazırlanıyor",         icon:<Package className="h-3 w-3"/>,      done:["hazirlaniyor","kargoda","teslim_edildi"].includes(o.status) },
    { label:"Kargoya Verildi",     icon:<Truck className="h-3 w-3"/>,        done:["kargoda","teslim_edildi"].includes(o.status) },
    { label:"Teslim Edildi",       icon:<CheckCircle2 className="h-3 w-3"/>, done:o.status==="teslim_edildi" },
  ];

  const statusCounts = { hazirlaniyor:orders.filter(o=>o.status==="hazirlaniyor").length, kargoda:orders.filter(o=>o.status==="kargoda").length, teslim_edildi:orders.filter(o=>o.status==="teslim_edildi").length, iptal:orders.filter(o=>o.status==="iptal").length };

  return (
    <div className="space-y-4">
      <SectionHeader title="Sipariş Yönetimi" desc={`${orders.length} toplam sipariş`}
        action={<Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={()=>{const csv=["ID,Müşteri,Ürün,Tutar,Durum,Tarih",...filtered.map(o=>`${o.id},${o.user},${o.product},${o.amount},${o.status},${o.date}`)].join("\n");const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="siparisler.csv";a.click();}}><Download className="h-3.5 w-3.5"/>CSV İndir</Button>}
      />

      {/* Status quick filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {([["all","Tümü",orders.length],["hazirlaniyor","Hazırlanıyor",statusCounts.hazirlaniyor],["kargoda","Kargoda",statusCounts.kargoda],["teslim_edildi","Teslim",statusCounts.teslim_edildi],["iptal","İptal",statusCounts.iptal]] as [string,string,number][]).map(([v,l,c])=>(
          <button key={v} onClick={()=>setStatusF(v as "all"|OrderStatus)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusF===v?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:bg-muted"}`}>
            {l}<span className={`px-1.5 py-0.5 rounded-full text-xs ${statusF===v?"bg-white/20":"bg-muted"}`}>{c}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-48"><SearchBar value={search} onChange={setSearch} placeholder="Sipariş ID, müşteri veya ürün ara..."/></div>
        <Input type="date" className="h-9 text-xs w-36" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} placeholder="Başlangıç"/>
        <Input type="date" className="h-9 text-xs w-36" value={dateTo}   onChange={e=>setDateTo(e.target.value)} placeholder="Bitiş"/>
        {selected.size>0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-lg">{selected.size} seçili</span>
            <Select onValueChange={v=>bulkUpdate(v as OrderStatus)}>
              <SelectTrigger className="h-9 w-40 text-xs"><SelectValue placeholder="Toplu Güncelle"/></SelectTrigger>
              <SelectContent>{(["hazirlaniyor","kargoda","teslim_edildi","iptal"] as const).map(s=><SelectItem key={s} value={s} className="text-xs">{orderStatusLabel[s]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card className="border border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>
                <th className="p-3 w-10"><Checkbox checked={selected.size===filtered.length&&filtered.length>0} onCheckedChange={c=>setSelected(c?new Set(filtered.map(o=>o.id)):new Set())}/></th>
                {["Sipariş No","Müşteri","Ürün","Satıcı","Tutar","Ödeme","Şehir","Durum","Tarih","İşlem"].map(h=><th key={h} className="p-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(o=>(
                <tr key={o.id} className={`hover:bg-muted/30 transition-colors ${selected.has(o.id)?"bg-primary/5":""}`}>
                  <td className="p-3"><Checkbox checked={selected.has(o.id)} onCheckedChange={()=>toggleSelect(o.id)}/></td>
                  <td className="p-3 font-mono text-xs font-bold text-primary whitespace-nowrap">{o.id}</td>
                  <td className="p-3 text-xs font-medium whitespace-nowrap">{o.user}</td>
                  <td className="p-3 text-xs text-muted-foreground max-w-[140px] truncate">{o.product}</td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{o.seller}</td>
                  <td className="p-3 text-xs font-bold whitespace-nowrap">{o.amount.toLocaleString()}π</td>
                  <td className="p-3 text-xs text-muted-foreground">{o.payMethod||"Pi"}</td>
                  <td className="p-3 text-xs text-muted-foreground">{o.city||"—"}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${orderStatusColor[o.status]}`}>{orderStatusLabel[o.status]}</span></td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{o.date}</td>
                  <td className="p-3">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={()=>setDetail(o)}><Eye className="h-3.5 w-3.5"/></Button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={11} className="p-8 text-center text-sm text-muted-foreground">Sipariş bulunamadı</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!detail} onOpenChange={o=>!o&&setDetail(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Sipariş Detayı — {detail?.id}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 mt-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {l:"Müşteri",  v:detail.user},
                  {l:"Ürün",     v:detail.product},
                  {l:"Satıcı",   v:detail.seller},
                  {l:"Tutar",    v:`${detail.amount.toLocaleString()}π`},
                  {l:"Ödeme",    v:detail.payMethod||"Pi"},
                  {l:"Tarih",    v:detail.date},
                ].map(r=><div key={r.l} className="bg-muted/50 p-3 rounded-lg"><p className="text-xs text-muted-foreground">{r.l}</p><p className="text-sm font-semibold mt-0.5">{r.v}</p></div>)}
              </div>
              {detail.address && <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg"><MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0"/>{detail.address}</div>}
              {detail.trackingNo && <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg"><Truck className="h-3.5 w-3.5"/><span>Takip No:</span><span className="font-mono font-bold">{detail.trackingNo}</span></div>}
              <div>
                <p className="text-xs font-semibold mb-3">Sipariş Süreci</p>
                <div className="space-y-2">
                  {timeline(detail).map((step,i)=>(
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done?"bg-green-100 text-green-600":"bg-muted text-muted-foreground"}`}>{step.icon}</div>
                      <span className={`text-xs font-medium ${step.done?"text-foreground":"text-muted-foreground"}`}>{step.label}</span>
                      {step.done && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-auto"/>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={detail.status} onValueChange={v=>updateStatus(detail.id,v as OrderStatus)}>
                  <SelectTrigger className="h-9 flex-1 text-sm"><SelectValue/></SelectTrigger>
                  <SelectContent>{(["hazirlaniyor","kargoda","teslim_edildi","iptal"] as const).map(s=><SelectItem key={s} value={s}>{orderStatusLabel[s]}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-9" onClick={()=>{
                  const c=`FATURA\n────────────────\nNo: ${detail.id}\nTarih: ${detail.date}\nMüşteri: ${detail.user}\nÜrün: ${detail.product}\nSatıcı: ${detail.seller}\nTutar: ${detail.amount}π\nAdres: ${detail.address||"—"}\n────────────────\nucuzcubakkal.com`;
                  const w=window.open("","_blank"); if(w){w.document.write(`<pre style="font-family:monospace;padding:20px">${c}</pre>`);w.print();}
                }}><Printer className="h-4 w-4 mr-1"/>Yazdır</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
function ProductsSection({ products, setProducts }: { products:Product[]; setProducts:React.Dispatch<React.SetStateAction<Product[]>> }) {
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState<"all"|ProductStatus>("all");
  const [catF,     setCatF]     = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view,     setView]     = useState<Product|null>(null);
  const { toast } = useToast();

  const cats = ["all", ...Array.from(new Set(products.map(p=>p.category)))];
  const filtered = useMemo(()=>products.filter(p=>{
    const q=search.toLowerCase();
    return (p.name.toLowerCase().includes(q)||p.seller.toLowerCase().includes(q))&&(statusF==="all"||p.status===statusF)&&(catF==="all"||p.category===catF);
  }),[products,search,statusF,catF]);

  const toggleSelect = (id:string) => setSelected(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  const bulkActivate = () => { setProducts(prev=>prev.map(p=>selected.has(p.id)?{...p,status:"aktif" as ProductStatus}:p)); toast({title:`${selected.size} ürün aktifleştirildi`}); setSelected(new Set()); };
  const bulkDelete   = () => { setProducts(prev=>prev.filter(p=>!selected.has(p.id))); toast({title:`${selected.size} ürün silindi`,variant:"destructive"}); setSelected(new Set()); };
  const stockColor   = (s:number) => s===0?"text-red-600 font-bold":s<=3?"text-amber-600 font-bold":"text-foreground";

  return (
    <div className="space-y-4">
      <SectionHeader title="Ürün Yönetimi" desc={`${products.length} ürün`}
        action={<Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={()=>{const csv=["ID,Ad,Satıcı,Kategori,Fiyat,Stok,Satış",...filtered.map(p=>`${p.id},"${p.name}","${p.seller}","${p.category}",${p.price},${p.stock},${p.sales}`)].join("\n");const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="urunler.csv";a.click();}}><Download className="h-3.5 w-3.5"/>CSV</Button>}
      />
      <div className="grid grid-cols-4 gap-3">
        {[{l:"Toplam",c:"text-foreground",v:products.length},{l:"Aktif",c:"text-green-600",v:products.filter(p=>p.status==="aktif").length},{l:"Kritik Stok",c:"text-amber-600",v:products.filter(p=>p.stock>0&&p.stock<=3).length},{l:"Tükenen",c:"text-red-600",v:products.filter(p=>p.stock===0).length}].map(s=>(
          <Card key={s.l} className="border border-border shadow-none"><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-muted-foreground mt-0.5">{s.l}</p></CardContent></Card>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {(["all","aktif","taslak","beklemede"] as const).map(s=>(
            <button key={s} onClick={()=>setStatusF(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusF===s?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:bg-muted"}`}>
              {s==="all"?"Tümü":pStatusLabel[s]}
            </button>
          ))}
        </div>
        <Select value={catF} onValueChange={setCatF}>
          <SelectTrigger className="h-9 w-36 text-xs"><SelectValue/></SelectTrigger>
          <SelectContent>{cats.map(c=><SelectItem key={c} value={c} className="text-xs">{c==="all"?"Tüm Kategoriler":c}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex-1 min-w-36"><SearchBar value={search} onChange={setSearch} placeholder="Ürün veya satıcı ara..."/></div>
        {selected.size>0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-lg">{selected.size} seçili</span>
            <Button size="sm" className="h-8 text-xs" onClick={bulkActivate}>Aktifleştir</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs text-destructive hover:text-destructive" onClick={bulkDelete}>Sil</Button>
          </div>
        )}
      </div>
      <Card className="border border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>
                <th className="p-3 w-10"><Checkbox checked={selected.size===filtered.length&&filtered.length>0} onCheckedChange={c=>setSelected(c?new Set(filtered.map(p=>p.id)):new Set())}/></th>
                {["Ürün","Kategori","Fiyat","Stok","Satış","Görüntü","Puan","Durum","İşlem"].map(h=><th key={h} className="p-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(p=>(
                <tr key={p.id} className={`hover:bg-muted/30 transition-colors ${selected.has(p.id)?"bg-primary/5":""}`}>
                  <td className="p-3"><Checkbox checked={selected.has(p.id)} onCheckedChange={()=>toggleSelect(p.id)}/></td>
                  <td className="p-3"><p className="text-xs font-semibold max-w-[160px] truncate">{p.name}</p><p className="text-xs text-muted-foreground">{p.seller}</p></td>
                  <td className="p-3 text-xs">{p.category}</td>
                  <td className="p-3 text-xs font-bold text-primary">{p.price.toLocaleString()}π</td>
                  <td className="p-3 text-xs">
                    <span className={stockColor(p.stock)}>{p.stock}</span>
                    {p.stock===0&&<span className="ml-1 text-xs bg-red-100 text-red-600 px-1 rounded">Tükendi</span>}
                    {p.stock>0&&p.stock<=3&&<span className="ml-1 text-xs bg-amber-100 text-amber-600 px-1 rounded">Kritik</span>}
                  </td>
                  <td className="p-3 text-xs font-medium">{p.sales}</td>
                  <td className="p-3 text-xs text-muted-foreground">{p.views.toLocaleString()}</td>
                  <td className="p-3">{p.rating>0?<span className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 text-amber-400 fill-amber-400"/>{p.rating}</span>:<span className="text-xs text-muted-foreground">—</span>}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pStatusColor[p.status]}`}>{pStatusLabel[p.status]}</span></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={()=>setView(p)} title="Görüntüle"><Eye className="h-3.5 w-3.5"/></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={()=>{setProducts(prev=>prev.filter(x=>x.id!==p.id));toast({title:"Ürün silindi",variant:"destructive"});}} title="Sil"><Trash2 className="h-3.5 w-3.5"/></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={10} className="p-8 text-center text-sm text-muted-foreground">Ürün bulunamadı</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog open={!!view} onOpenChange={o=>!o&&setView(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[{l:"Satıcı",v:view.seller},{l:"Kategori",v:view.category},{l:"Fiyat",v:`${view.price.toLocaleString()}π`},{l:"Stok",v:`${view.stock} adet`},{l:"Toplam Satış",v:`${view.sales} adet`},{l:"Görüntülenme",v:view.views.toLocaleString()}].map(r=>(
                  <div key={r.l} className="bg-muted/50 p-3 rounded-lg"><p className="text-xs text-muted-foreground">{r.l}</p><p className="text-sm font-bold mt-0.5">{r.v}</p></div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i=><Star key={i} className={`h-4 w-4 ${i<=Math.round(view.rating)?"text-amber-400 fill-amber-400":"text-gray-200 fill-gray-200"}`}/>)}
                <span className="text-sm font-bold ml-1">{view.rating>0?view.rating:"Değerlendirme yok"}</span>
              </div>
              <Select value={view.status} onValueChange={v=>{setProducts(prev=>prev.map(p=>p.id===view.id?{...p,status:v as ProductStatus}:p));setView({...view,status:v as ProductStatus});toast({title:"Ürün durumu güncellendi"});}}>
                <SelectTrigger className="h-9 text-sm"><SelectValue/></SelectTrigger>
                <SelectContent>{(["aktif","taslak","beklemede"] as const).map(s=><SelectItem key={s} value={s}>{pStatusLabel[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Sellers ──────────────────────────────────────────────────────────────────
function SellersSection({ sellers, setSellers }: { sellers:Seller[]; setSellers:React.Dispatch<React.SetStateAction<Seller[]>> }) {
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState<"all"|UserStatus>("all");
  const [editSeller, setEditSeller] = useState<Seller|null>(null);
  const { toast } = useToast();

  const filtered = useMemo(()=>sellers.filter(s=>{
    const q=search.toLowerCase();
    return (s.name.toLowerCase().includes(q)||s.category.toLowerCase().includes(q)||s.city.toLowerCase().includes(q))&&(statusF==="all"||s.status===statusF);
  }),[sellers,search,statusF]);

  const stats = { total:sellers.length, active:sellers.filter(s=>s.status==="aktif").length, verified:sellers.filter(s=>s.verified).length, revenue:sellers.reduce((s,x)=>s+x.totalRevenue,0) };

  return (
    <div className="space-y-4">
      <SectionHeader title="Satıcı Yönetimi" desc={`${sellers.length} kayıtlı satıcı`}/>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {l:"Toplam Satıcı", v:stats.total,   icon:<Store className="h-4 w-4 text-blue-600"/>,         bg:"bg-blue-50"   },
          {l:"Aktif",         v:stats.active,  icon:<CheckCircle2 className="h-4 w-4 text-green-600"/>,  bg:"bg-green-50"  },
          {l:"Doğrulanmış",   v:stats.verified,icon:<ShieldCheck className="h-4 w-4 text-purple-600"/>,  bg:"bg-purple-50" },
          {l:"Toplam Ciro",   v:`${(stats.revenue/1000).toFixed(0)}k π`,icon:<Wallet className="h-4 w-4 text-primary"/>,bg:"bg-orange-50"},
        ].map(s=>(
          <Card key={s.l} className="border border-border shadow-none"><CardContent className="p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
            <div><p className="text-xs text-muted-foreground">{s.l}</p><p className="font-bold text-sm">{s.v}</p></div>
          </CardContent></Card>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {(["all","aktif","askida","yasakli"] as const).map(s=>(
          <button key={s} onClick={()=>setStatusF(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusF===s?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:bg-muted"}`}>
            {s==="all"?"Tümü":s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
        <div className="flex-1 min-w-48"><SearchBar value={search} onChange={setSearch} placeholder="Satıcı adı, kategori veya şehir..."/></div>
      </div>
      <Card className="border border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>{["Satıcı","Kategori","Şehir","Ürün","Satış","Puan","Ciro","Rozet","Durum","İşlem"].map(h=><th key={h} className="p-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(s=>(
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 flex-shrink-0"><AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xs">{s.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="flex items-center gap-1"><p className="text-xs font-semibold">{s.name}</p>{s.verified&&<ShieldCheck className="h-3 w-3 text-blue-500"/>}</div>
                        <p className="text-xs text-muted-foreground">%{s.commission} komisyon</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{s.category}</td>
                  <td className="p-3 text-xs text-muted-foreground">{s.city}</td>
                  <td className="p-3 text-xs font-medium">{s.products}</td>
                  <td className="p-3 text-xs font-medium">{s.sales}</td>
                  <td className="p-3"><span className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 text-amber-400 fill-amber-400"/>{s.rating}</span></td>
                  <td className="p-3 text-xs font-bold text-primary">{s.totalRevenue.toLocaleString()}π</td>
                  <td className="p-3"><span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${badgeColor[s.badge]||""}`}>{s.badge}</span></td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${userStatusColor[s.status]}`}>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={()=>setEditSeller(s)}><Edit className="h-3.5 w-3.5"/></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={()=>{setSellers(prev=>prev.map(x=>x.id===s.id?{...x,status:x.status==="aktif"?"askida":"aktif"}:x));toast({title:"Satıcı güncellendi"});}} title={s.status==="aktif"?"Askıya Al":"Aktifleştir"}>
                        {s.status==="aktif"?<Ban className="h-3.5 w-3.5 text-amber-500"/>:<Check className="h-3.5 w-3.5 text-green-500"/>}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Sheet open={!!editSeller} onOpenChange={o=>!o&&setEditSeller(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>Satıcı Düzenle — {editSeller?.name}</SheetTitle></SheetHeader>
          {editSeller && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <Avatar className="w-12 h-12"><AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">{editSeller.name[0]}</AvatarFallback></Avatar>
                <div><p className="font-semibold">{editSeller.name}</p><p className="text-xs text-muted-foreground">{editSeller.category} — {editSeller.city}</p></div>
              </div>
              {editSeller.phone && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3.5 w-3.5"/>{editSeller.phone}</div>}
              {editSeller.bank  && <div className="flex items-center gap-2 text-xs text-muted-foreground"><CreditCard className="h-3.5 w-3.5"/>{editSeller.bank}</div>}
              <Separator/>
              <div className="space-y-1.5"><Label className="text-xs">Komisyon Oranı (%)</Label><Input type="number" className="h-9 text-sm" value={editSeller.commission} onChange={e=>setEditSeller({...editSeller,commission:+e.target.value})}/></div>
              <div className="space-y-1.5">
                <Label className="text-xs">Durum</Label>
                <Select value={editSeller.status} onValueChange={v=>setEditSeller({...editSeller,status:v as UserStatus})}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="aktif">Aktif</SelectItem><SelectItem value="askida">Askıda</SelectItem><SelectItem value="yasakli">Yasaklı</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div><Label className="text-sm">Doğrulanmış Satıcı</Label><p className="text-xs text-muted-foreground">Mavi rozet gösterilir</p></div>
                <Switch checked={editSeller.verified} onCheckedChange={c=>setEditSeller({...editSeller,verified:c})}/>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Satıcı Rozeti</Label>
                <Select value={editSeller.badge} onValueChange={v=>setEditSeller({...editSeller,badge:v})}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue/></SelectTrigger>
                  <SelectContent>{["Platin","Altın","Gümüş","Bronz"].map(b=><SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={()=>{setSellers(prev=>prev.map(s=>s.id===editSeller.id?editSeller:s));setEditSeller(null);toast({title:"Satıcı güncellendi"});}}>Kaydet</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Members ──────────────────────────────────────────────────────────────────
function MembersSection({ members, setMembers }: { members:Member[]; setMembers:React.Dispatch<React.SetStateAction<Member[]>> }) {
  const [search, setSearch]     = useState("");
  const [segF,   setSegF]       = useState("all");
  const [roleF,  setRoleF]      = useState("all");
  const [detail, setDetail]     = useState<Member|null>(null);
  const { toast } = useToast();

  const filtered = useMemo(()=>members.filter(m=>{
    const q=search.toLowerCase();
    return (m.name.toLowerCase().includes(q)||m.email.toLowerCase().includes(q)||m.city.toLowerCase().includes(q))&&(segF==="all"||m.segment===segF)&&(roleF==="all"||m.role===roleF);
  }),[members,search,segF,roleF]);

  const segs = { VIP:members.filter(m=>m.segment==="VIP").length, Normal:members.filter(m=>m.segment==="Normal").length, Pasif:members.filter(m=>m.segment==="Pasif").length };

  return (
    <div className="space-y-4">
      <SectionHeader title="Üye Yönetimi" desc={`${members.length} kayıtlı üye`}
        action={<Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"><Download className="h-3.5 w-3.5"/>Dışa Aktar</Button>}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{l:"Toplam",v:members.length,c:"text-foreground",bg:""},{l:"VIP",v:segs.VIP,c:"text-yellow-700",bg:"bg-yellow-50"},{l:"Normal",v:segs.Normal,c:"text-blue-700",bg:"bg-blue-50"},{l:"Pasif",v:segs.Pasif,c:"text-gray-500",bg:"bg-gray-50"}].map(s=>(
          <Card key={s.l} className={`border border-border shadow-none ${s.bg}`}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-muted-foreground mt-0.5">{s.l}</p></CardContent></Card>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {["all","VIP","Normal","Pasif"].map(s=>(
          <button key={s} onClick={()=>setSegF(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${segF===s?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:bg-muted"}`}>{s==="all"?"Tüm Segmentler":s}</button>
        ))}
        <Select value={roleF} onValueChange={setRoleF}>
          <SelectTrigger className="h-9 w-32 text-xs"><SelectValue/></SelectTrigger>
          <SelectContent><SelectItem value="all">Tüm Roller</SelectItem><SelectItem value="buyer">Alıcı</SelectItem><SelectItem value="seller">Satıcı</SelectItem></SelectContent>
        </Select>
        <div className="flex-1 min-w-36"><SearchBar value={search} onChange={setSearch} placeholder="Ad, e-posta veya şehir ara..."/></div>
      </div>
      <Card className="border border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>{["Üye","Rol","Segment","Şehir","Sipariş","Harcama","Kayıt","Durum","İşlem"].map(h=><th key={h} className="p-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(m=>(
                <tr key={m.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={()=>setDetail(m)}>
                  <td className="p-3"><div className="flex items-center gap-2"><Avatar className="w-7 h-7 flex-shrink-0"><AvatarFallback className="text-xs bg-purple-100 text-purple-700 font-bold">{m.name[0]}</AvatarFallback></Avatar><div><p className="text-xs font-semibold">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div></div></td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.role==="seller"?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-600"}`}>{m.role==="seller"?"Satıcı":"Alıcı"}</span></td>
                  <td className="p-3">{m.segment&&<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${segmentColor[m.segment]||""}`}>{m.segment}</span>}</td>
                  <td className="p-3 text-xs text-muted-foreground">{m.city}</td>
                  <td className="p-3 text-xs font-medium">{m.orders}</td>
                  <td className="p-3 text-xs font-bold text-primary">{m.totalSpent.toLocaleString()}π</td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{m.joinDate}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${userStatusColor[m.status]}`}>{m.status.charAt(0).toUpperCase()+m.status.slice(1)}</span></td>
                  <td className="p-3" onClick={e=>e.stopPropagation()}>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={()=>{setMembers(prev=>prev.map(x=>x.id===m.id?{...x,status:x.status==="aktif"?"askida":"aktif"}:x));toast({title:"Üye güncellendi"});}}>
                      {m.status==="aktif"?<Ban className="h-3.5 w-3.5 text-amber-500"/>:<Check className="h-3.5 w-3.5 text-green-500"/>}
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">Üye bulunamadı</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog open={!!detail} onOpenChange={o=>!o&&setDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Üye Profili</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <Avatar className="w-14 h-14"><AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-xl">{detail.name[0]}</AvatarFallback></Avatar>
                <div><p className="font-bold text-base">{detail.name}</p><p className="text-sm text-muted-foreground">{detail.email}</p>{detail.segment&&<span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${segmentColor[detail.segment]||""}`}>{detail.segment}</span>}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{l:"Telefon",v:detail.phone||"—"},{l:"Şehir",v:detail.city},{l:"Kayıt",v:detail.joinDate},{l:"Sipariş",v:`${detail.orders} adet`},{l:"Harcama",v:`${detail.totalSpent.toLocaleString()}π`},{l:"Rol",v:detail.role==="seller"?"Satıcı":"Alıcı"}].map(r=>(
                  <div key={r.l} className="bg-muted/50 p-3 rounded-lg"><p className="text-xs text-muted-foreground">{r.l}</p><p className="text-sm font-semibold mt-0.5">{r.v}</p></div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Applications ─────────────────────────────────────────────────────────────
function ApplicationsSection({ applications, setApplications }: { applications:Application[]; setApplications:React.Dispatch<React.SetStateAction<Application[]>> }) {
  const [detail, setDetail]     = useState<Application|null>(null);
  const [note,   setNote]       = useState("");
  const [filter, setFilter]     = useState<"tumu"|Application["status"]>("tumu");
  const [lightbox, setLightbox] = useState<string|null>(null);
  const { toast } = useToast();

  const updateStatus = (id:string, status: Application["status"], adminNote?:string) => {
    setApplications(prev => prev.map(a => a.id===id ? { ...a, status, adminNote: adminNote ?? a.adminNote } : a));
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, status, adminNote: adminNote ?? prev.adminNote } : prev);
    const msgs: Record<string, string> = {
      incelemede: "Başvuru incelemeye alındı.",
      onaylandi:  "Başvuru onaylandı — mağaza global olarak yayına girdi.",
      reddedildi: "Başvuru reddedildi.",
    };
    toast({ title: msgs[status] ?? "Güncellendi" });
  };

  const sStyle: Record<string,string> = {
    bekliyor:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    incelemede:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    onaylandi:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    reddedildi:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const sLabel: Record<string,string> = { bekliyor:"Bekliyor", incelemede:"İncelemede", onaylandi:"Onaylandı", reddedildi:"Reddedildi" };
  const kycColor: Record<string,string> = { verified:"text-green-600", pending:"text-amber-500", failed:"text-red-600" };
  const kycLabel: Record<string,string> = { verified:"KYC Doğrulandı", pending:"KYC Bekliyor", failed:"KYC Başarısız" };

  const counts = {
    tumu:       applications.length,
    bekliyor:   applications.filter(a=>a.status==="bekliyor").length,
    incelemede: applications.filter(a=>a.status==="incelemede").length,
    onaylandi:  applications.filter(a=>a.status==="onaylandi").length,
    reddedildi: applications.filter(a=>a.status==="reddedildi").length,
  };

  const filtered = filter === "tumu" ? applications : applications.filter(a=>a.status===filter);

  // Ürün örneği yeterliliği
  const hasMinPortfolio = (a:Application) => a.portfolioImages.length >= 3;
  const hasKyc          = (a:Application) => a.kycStatus === "verified";
  const hasLiveness     = (a:Application) => !!a.livenessPhoto;
  const canApprove      = (a:Application) => hasKyc(a) && hasLiveness(a) && hasMinPortfolio(a);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Satıcı Başvuruları"
        desc={`${counts.bekliyor} bekleyen · ${counts.incelemede} incelemede`}
      />

      {/* Sayaç kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { l:"Bekliyor",   v:counts.bekliyor,   c:"text-amber-600", s:"bekliyor"   },
          { l:"İncelemede", v:counts.incelemede, c:"text-blue-600",  s:"incelemede" },
          { l:"Onaylanan",  v:counts.onaylandi,  c:"text-green-600", s:"onaylandi"  },
          { l:"Reddedilen", v:counts.reddedildi, c:"text-red-600",   s:"reddedildi" },
        ] as const).map(s=>(
          <Card
            key={s.l}
            className={`border shadow-none cursor-pointer transition-colors ${filter===s.s ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
            onClick={()=>setFilter(f => f===s.s ? "tumu" : s.s)}
          >
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Başvuru listesi */}
      <div className="space-y-3">
        {filtered.map(a => {
          const ok = canApprove(a);
          return (
            <Card
              key={a.id}
              className="border border-border shadow-none hover:border-primary/30 transition-colors cursor-pointer"
              onClick={()=>{ setDetail(a); setNote(a.adminNote ?? ""); }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{a.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{a.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sStyle[a.status]}`}>{sLabel[a.status]}</span>
                        {!ok && a.status==="bekliyor" && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangle className="h-2.5 w-2.5"/>Eksik Belge
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{a.storeName} · {a.category} · {a.city}, {a.country}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Hash className="h-3 w-3"/>@{a.piUsername}</span>
                        <span className={`flex items-center gap-1 ${kycColor[a.kycStatus]}`}>
                          <ShieldCheck className="h-3 w-3"/>{kycLabel[a.kycStatus]}
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3"/>
                          <span className={a.portfolioImages.length >= 3 ? "text-green-600" : "text-red-500"}>
                            {a.portfolioImages.length}/3 örnek
                          </span>
                        </span>
                        <span>{a.date}</span>
                      </div>
                    </div>
                  </div>
                  {a.status==="bekliyor" && (
                    <div className="flex gap-2" onClick={e=>e.stopPropagation()}>
                      <Button
                        size="sm"
                        className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={()=>updateStatus(a.id,"incelemede")}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1"/>İncele
                      </Button>
                      <Button
                        size="sm"
                        disabled={!ok}
                        className="h-8 text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        onClick={()=>updateStatus(a.id,"onaylandi")}
                      >
                        <Check className="h-3.5 w-3.5 mr-1"/>Onayla
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Bu kategoride başvuru bulunamadı.</div>
        )}
      </div>

      {/* Detay drawer */}
      <Sheet open={!!detail} onOpenChange={o=>{ if(!o){ setDetail(null); setNote(""); } }}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
          {detail && (
            <>
              {/* Header */}
              <div className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-base">{detail.name}</p>
                  <p className="text-xs text-muted-foreground">{detail.storeName} · {detail.date}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sStyle[detail.status]}`}>{sLabel[detail.status]}</span>
              </div>

              <div className="p-5 space-y-6">

                {/* ── 1. Pi Auth & Cüzdan ── */}
                <section className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5"/>Pi Auth & Cüzdan
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { l:"Pi Kullanıcı Adı", v:`@${detail.piUsername}` },
                      { l:"Pi UID",            v:detail.piUid },
                      { l:"E-posta",           v:detail.email },
                      { l:"Telefon",           v:detail.phone },
                    ].map(r=>(
                      <div key={r.l} className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground">{r.l}</p>
                        <p className="text-xs font-semibold mt-0.5 break-all">{r.v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Cüzdan Adresi</p>
                    <p className="text-xs font-mono break-all">{detail.walletAddress}</p>
                  </div>
                </section>

                {/* ── 2. KYC & Canlılık Testi ── */}
                <section className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5"/>KYC & Canlılık Testi
                  </h4>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      detail.kycStatus==="verified" ? "bg-green-100 dark:bg-green-900/30" :
                      detail.kycStatus==="pending"  ? "bg-amber-100 dark:bg-amber-900/30" :
                      "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      {detail.kycStatus==="verified"
                        ? <CheckCircle2 className="h-5 w-5 text-green-600"/>
                        : detail.kycStatus==="pending"
                        ? <Clock className="h-5 w-5 text-amber-500"/>
                        : <XCircle className="h-5 w-5 text-red-600"/>
                      }
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${kycColor[detail.kycStatus]}`}>{kycLabel[detail.kycStatus]}</p>
                      <p className="text-xs text-muted-foreground">Pi Network SDK üzerinden sorgulandı</p>
                    </div>
                  </div>
                  {detail.livenessPhoto ? (
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground font-medium">Canlılık Selfie ("Ucuzcu Bakkal — {detail.date}")</p>
                      <button onClick={()=>setLightbox(detail.livenessPhoto)} className="block">
                        <img src={detail.livenessPhoto} alt="Canlılık selfie" className="h-32 w-32 rounded-xl object-cover border border-border hover:border-primary transition-colors"/>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0"/>Canlılık selfie yüklenmemiş — onay verilemez.
                    </div>
                  )}
                </section>

                {/* ── 3. Yasal & Mağaza ── */}
                <section className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5"/>Yasal Kimlik & Mağaza
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { l:"Satıcı Tipi",    v:detail.sellerType==="individual" ? "Bireysel" : "Kurumsal" },
                      { l:"Vergi/TC No",    v:detail.taxId || "Girilmedi" },
                      { l:"Mağaza Adı",     v:detail.storeName },
                      { l:"Kategori",       v:detail.category },
                      { l:"Konum",          v:`${detail.city}, ${detail.country}` },
                      { l:"Kendi Kargo",    v:detail.ownCargo ? "Evet" : "Hayır" },
                    ].map(r=>(
                      <div key={r.l} className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground">{r.l}</p>
                        <p className="text-xs font-semibold mt-0.5">{r.v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground mb-1">Kargo Bölgeleri</p>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.shippingCountries.map(c=>(
                        <span key={c} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground mb-1">Mağaza Tanıtımı</p>
                    <p className="text-xs leading-relaxed">{detail.bio}</p>
                  </div>
                </section>

                {/* ── 4. Ürün Örnekleri ── */}
                <section className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5"/>Ürün Örnekleri
                    <span className={`ml-auto text-xs font-semibold ${detail.portfolioImages.length >= 3 ? "text-green-600" : "text-red-500"}`}>
                      {detail.portfolioImages.length} / 3 minimum
                    </span>
                  </h4>
                  {detail.portfolioImages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {detail.portfolioImages.map((img,i)=>(
                        <button key={i} onClick={()=>setLightbox(img)}>
                          <img src={img} alt={`Ürün örneği ${i+1}`} className="h-24 w-24 rounded-xl object-cover border border-border hover:border-primary transition-colors"/>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0"/>Ürün örneği yüklenmemiş — onay verilemez.
                    </div>
                  )}
                </section>

                {/* ── Admin Notu & Aksiyon ── */}
                <section className="space-y-3 border-t border-border pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Admin Notu</Label>
                    <Textarea
                      className="text-sm resize-none"
                      rows={2}
                      placeholder="Onay/red gerekçesi veya ek not..."
                      value={note}
                      onChange={e=>setNote(e.target.value)}
                    />
                  </div>

                  {(detail.status==="bekliyor" || detail.status==="incelemede") && (
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950 text-xs"
                        onClick={()=>updateStatus(detail.id,"incelemede",note)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1"/>İncelemede
                      </Button>
                      <Button
                        disabled={!canApprove(detail)}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-xs"
                        onClick={()=>updateStatus(detail.id,"onaylandi",note)}
                        title={!canApprove(detail) ? "KYC, canlılık selfie ve min. 3 ürün örneği gerekli" : ""}
                      >
                        <Check className="h-3.5 w-3.5 mr-1"/>Yayına Al
                      </Button>
                      <Button
                        variant="outline"
                        className="text-destructive hover:text-destructive text-xs"
                        onClick={()=>updateStatus(detail.id,"reddedildi",note)}
                      >
                        <X className="h-3.5 w-3.5 mr-1"/>Reddet
                      </Button>
                    </div>
                  )}

                  {!canApprove(detail) && (detail.status==="bekliyor"||detail.status==="incelemede") && (
                    <ul className="text-xs text-muted-foreground space-y-1 bg-muted/40 rounded-lg p-3 border border-border">
                      <p className="font-semibold text-foreground mb-1">Onay engelleyen eksikler:</p>
                      {!hasKyc(detail)      && <li className="flex items-center gap-1.5 text-red-500"><AlertTriangle className="h-3 w-3"/>Pi Network KYC tamamlanmamış</li>}
                      {!hasLiveness(detail) && <li className="flex items-center gap-1.5 text-red-500"><AlertTriangle className="h-3 w-3"/>Canlılık selfie eksik</li>}
                      {!hasMinPortfolio(detail) && <li className="flex items-center gap-1.5 text-red-500"><AlertTriangle className="h-3 w-3"/>Ürün örneği yetersiz ({detail.portfolioImages.length}/3)</li>}
                    </ul>
                  )}

                  {detail.status==="onaylandi" && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0"/>Mağaza aktif ve global yayında.
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Fotoğraf lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={()=>setLightbox(null)}>
          <img src={lightbox} alt="Belge" className="max-h-[85vh] max-w-full rounded-xl object-contain"/>
        </div>
      )}
    </div>
  );
}

// ─── Returns ──────────────────────────────────────────────────────────────────
function ReturnsSection({ refunds, setRefunds }: { refunds:Refund[]; setRefunds:React.Dispatch<React.SetStateAction<Refund[]>> }) {
  const { toast } = useToast();
  const update = (id:string, s:"onaylandi"|"reddedildi") => { setRefunds(prev=>prev.map(r=>r.id===id?{...r,status:s}:r)); toast({title:s==="onaylandi"?"İade onaylandı":"İade reddedildi"}); };
  const sStyle: Record<string,string> = { bekliyor:"bg-amber-100 text-amber-700", onaylandi:"bg-green-100 text-green-700", reddedildi:"bg-red-100 text-red-700" };
  const sLabel: Record<string,string> = { bekliyor:"Bekliyor", onaylandi:"Onaylandı", reddedildi:"Reddedildi" };
  return (
    <div className="space-y-4">
      <SectionHeader title="İade & Şikayet Yönetimi" desc={`${refunds.filter(r=>r.status==="bekliyor").length} bekleyen talep`}/>
      <div className="grid grid-cols-3 gap-3">
        {[{l:"Bekliyor",v:refunds.filter(r=>r.status==="bekliyor").length,c:"text-amber-600"},{l:"Onaylanan",v:refunds.filter(r=>r.status==="onaylandi").length,c:"text-green-600"},{l:"Reddedilen",v:refunds.filter(r=>r.status==="reddedildi").length,c:"text-red-600"}].map(s=>(
          <Card key={s.l} className="border border-border shadow-none"><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-muted-foreground mt-0.5">{s.l}</p></CardContent></Card>
        ))}
      </div>
      <div className="space-y-3">
        {refunds.map(r=>(
          <Card key={r.id} className="border border-border shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-primary font-bold">{r.orderId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sStyle[r.status]}`}>{sLabel[r.status]}</span>
                    {(r.images||0)>0&&<span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"><Eye className="h-3 w-3"/>{r.images} görsel</span>}
                  </div>
                  <p className="text-sm font-semibold">{r.user} — {r.product}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="font-bold text-primary">{r.amount}π</span>
                    <span className="text-muted-foreground">{r.date}</span>
                  </div>
                </div>
                {r.status==="bekliyor"&&(
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700" onClick={()=>update(r.id,"onaylandi")}><Check className="h-3.5 w-3.5 mr-1"/>Onayla</Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs text-destructive hover:text-destructive" onClick={()=>update(r.id,"reddedildi")}><XCircle className="h-3.5 w-3.5 mr-1"/>Reddet</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Finance ──────────────────────────────────────────────────────────────────
function FinanceSection({ payments, setPayments }: { payments:Payment[]; setPayments:React.Dispatch<React.SetStateAction<Payment[]>> }) {
  const { toast } = useToast();
  const totalPending = payments.filter(p=>p.status==="bekliyor").reduce((s,p)=>s+p.amount,0);
  const totalPaid    = payments.filter(p=>p.status==="odendi").reduce((s,p)=>s+p.amount,0);
  const markPaid = (id:string) => { setPayments(prev=>prev.map(p=>p.id===id?{...p,status:"odendi"}:p)); toast({title:"Ödeme tamamlandı"}); };
  const sStyle: Record<string,string> = { bekliyor:"bg-amber-100 text-amber-700", odendi:"bg-green-100 text-green-700", beklemede:"bg-gray-100 text-gray-600" };
  const sLabel: Record<string,string> = { bekliyor:"Bekliyor", odendi:"Ödendi", beklemede:"Askıda" };
  return (
    <div className="space-y-4">
      <SectionHeader title="Finans & Ödemeler" desc="Pi cüzdan ve satıcı ödeme yönetimi"/>
      <Card className="border-0 shadow-none bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div><p className="text-orange-100 text-sm mb-1">Platform Pi Cüzdanı</p><p className="text-4xl font-bold">48.720 π</p><p className="text-orange-200 text-xs mt-2">Son güncelleme: 9 Mart 2026, 14:32</p></div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"><Wallet className="h-6 w-6"/></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
            <div><p className="text-orange-100 text-xs">Bu ay gelen</p><p className="font-bold mt-0.5">+7.200π</p></div>
            <div><p className="text-orange-100 text-xs">Bu ay giden</p><p className="font-bold mt-0.5">-4.850π</p></div>
            <div><p className="text-orange-100 text-xs">Komisyon geliri</p><p className="font-bold mt-0.5">+892π</p></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        {[{l:"Bekleyen Ödemeler",v:`${totalPending.toLocaleString()}π`,c:"text-amber-600",bg:"bg-amber-50"},{l:"Ödenen Toplam",v:`${totalPaid.toLocaleString()}π`,c:"text-green-600",bg:"bg-green-50"},{l:"Komisyon Kazancı",v:"892π",c:"text-primary",bg:"bg-orange-50"}].map(s=>(
          <Card key={s.l} className={`border border-border shadow-none ${s.bg}`}><CardContent className="p-4"><p className={`text-xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-muted-foreground mt-0.5">{s.l}</p></CardContent></Card>
        ))}
      </div>
      <Card className="border border-border shadow-none overflow-hidden">
        <CardHeader className="px-5 pt-4 pb-2"><CardTitle className="text-sm font-semibold">Satıcı Ödemeleri</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>{["Satıcı","Banka","Dönem","Tutar","Tarih","Durum","İşlem"].map(h=><th key={h} className="p-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map(p=>(
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3"><div className="flex items-center gap-2"><Avatar className="w-7 h-7 flex-shrink-0"><AvatarFallback className="text-xs bg-orange-100 text-orange-700 font-bold">{p.seller[0]}</AvatarFallback></Avatar><span className="text-xs font-semibold">{p.seller}</span></div></td>
                  <td className="p-3 text-xs text-muted-foreground">{p.bank||"—"}</td>
                  <td className="p-3 text-xs text-muted-foreground">{p.period}</td>
                  <td className="p-3 text-xs font-bold text-primary">{p.amount.toLocaleString()}π</td>
                  <td className="p-3 text-xs text-muted-foreground">{p.date}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sStyle[p.status]}`}>{sLabel[p.status]}</span></td>
                  <td className="p-3">{p.status==="bekliyor"&&<Button size="sm" className="h-7 text-xs" onClick={()=>markPaid(p.id)}><Check className="h-3 w-3 mr-1"/>Öde</Button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Coupons ──────────────────────────────────────────────────────────────────
function CouponsSection({ coupons, setCoupons }: { coupons:Coupon[]; setCoupons:React.Dispatch<React.SetStateAction<Coupon[]>> }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code:"", type:"percentage" as "percentage"|"fixed", value:"", minPurchase:"", validUntil:"", limit:"" });
  const { toast } = useToast();
  const add = () => {
    if(!form.code||!form.value) return;
    setCoupons(prev=>[...prev,{id:`C${Date.now()}`,code:form.code.toUpperCase(),type:form.type,value:+form.value,minPurchase:+form.minPurchase||0,validUntil:form.validUntil||"2026-12-31",usedCount:0,limit:+form.limit||100,active:true}]);
    setOpen(false); setForm({code:"",type:"percentage",value:"",minPurchase:"",validUntil:"",limit:""}); toast({title:"Kupon oluşturuldu"});
  };
  return (
    <div className="space-y-4">
      <SectionHeader title="Kupon Yönetimi" desc={`${coupons.length} kupon`} action={<Button size="sm" onClick={()=>setOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5"/>Yeni Kupon</Button>}/>
      <div className="space-y-3">
        {coupons.map(c=>(
          <Card key={c.id} className="border border-border shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Tag className="h-5 w-5 text-primary"/></div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono font-bold text-sm">{c.code}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.active?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>{c.active?"Aktif":"Pasif"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.type==="percentage"?`%${c.value} indirim`:`${c.value}π indirim`} — Min: {c.minPurchase}π — Son: {c.validUntil}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right min-w-[80px]"><p className="text-xs font-bold">{c.usedCount}/{c.limit}</p><Progress value={(c.usedCount/c.limit)*100} className="w-20 h-1.5 mt-1"/></div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={()=>setCoupons(prev=>prev.map(x=>x.id===c.id?{...x,active:!x.active}:x))}>{c.active?<XCircle className="h-3.5 w-3.5 text-amber-500"/>:<CheckCircle2 className="h-3.5 w-3.5 text-green-500"/>}</Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={()=>setCoupons(prev=>prev.filter(x=>x.id!==c.id))}><Trash2 className="h-3.5 w-3.5"/></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Yeni Kupon Oluştur</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5"><Label className="text-xs">Kupon Kodu *</Label><Input className="h-9 text-sm font-mono uppercase" placeholder="ORNEK20" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Tip</Label><Select value={form.type} onValueChange={v=>setForm({...form,type:v as "percentage"|"fixed"})}><SelectTrigger className="h-9 text-xs"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="percentage">Yüzde (%)</SelectItem><SelectItem value="fixed">Sabit (π)</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Değer *</Label><Input type="number" className="h-9 text-sm" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Min. Alışveriş (π)</Label><Input type="number" className="h-9 text-sm" value={form.minPurchase} onChange={e=>setForm({...form,minPurchase:e.target.value})}/></div>
              <div className="space-y-1.5"><Label className="text-xs">Limit</Label><Input type="number" className="h-9 text-sm" value={form.limit} onChange={e=>setForm({...form,limit:e.target.value})}/></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Son Kullanma Tarihi</Label><Input type="date" className="h-9 text-sm" value={form.validUntil} onChange={e=>setForm({...form,validUntil:e.target.value})}/></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={()=>setOpen(false)}>İptal</Button><Button onClick={add}>Oluştur</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function ReportsSection() {
  const topProds = [
    {name:"Spor Koşu Ayakkabısı",  sales:91,  revenue:132000, pct:91 },
    {name:"Kablosuz Fare",          sales:203, revenue:65000,  pct:100},
    {name:"Galaxy S24 Ultra",       sales:48,  revenue:470400, pct:47 },
    {name:"Yoga Matı Premium",      sales:156, revenue:90480,  pct:76 },
    {name:"Deri Cüzdan",           sales:127, revenue:48260,  pct:62 },
  ];
  return (
    <div className="space-y-4">
      <SectionHeader title="Raporlar & Analiz" desc="Platform performans analizleri"
        action={<Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"><Download className="h-3.5 w-3.5"/>Rapor İndir</Button>}
      />
      <AdminPerformance />
      <Tabs defaultValue="sales">
        <TabsList className="bg-muted h-9">
          {[["sales","Satış Analizi"],["members","Üye Analizi"],["products","Ürün Analizi"]].map(([v,l])=><TabsTrigger key={v} value={v} className="text-xs">{l}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="sales" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[{l:"Toplam Ciro",v:"151.8k π",t:"+21%",up:true},{l:"Ort. Sipariş",v:"248π",t:"+5%",up:true},{l:"İptal Oranı",v:"%6.2",t:"+0.4%",up:false},{l:"Brüt Kar",v:"37.9k π",t:"+22%",up:true}].map(m=>(
              <Card key={m.l} className="border border-border shadow-none"><CardContent className="p-4"><p className="text-xl font-bold">{m.v}</p><p className="text-xs text-muted-foreground">{m.l}</p><p className={`text-xs mt-1 font-medium ${m.up?"text-green-600":"text-red-500"}`}>{m.t} önceki döneme</p></CardContent></Card>
            ))}
          </div>
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-2"><CardTitle className="text-sm font-semibold">Aylık Gelir & Sipariş Trendi</CardTitle></CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MONTHLY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="ay" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                  <RTooltip contentStyle={{fontSize:12,borderRadius:8}}/>
                  <Legend wrapperStyle={{fontSize:12}}/>
                  <Line type="monotone" dataKey="gelir"   stroke="#f27a1a" strokeWidth={2.5} dot={{r:3}} name="Gelir (π)"/>
                  <Line type="monotone" dataKey="siparis" stroke="#3b82f6" strokeWidth={2.5} dot={{r:3}} name="Sipariş"/>
                  <Line type="monotone" dataKey="iade"    stroke="#ef4444" strokeWidth={2} dot={{r:2}} name="İade" strokeDasharray="4 2"/>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-2"><CardTitle className="text-sm font-semibold">Kategori Satış Dağılımı</CardTitle></CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CAT_DATA} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis type="number" tick={{fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`%${v}`}/>
                  <YAxis dataKey="name" type="category" tick={{fontSize:11}} axisLine={false} tickLine={false} width={80}/>
                  <RTooltip formatter={(v:number)=>`%${v}`} contentStyle={{fontSize:12,borderRadius:8}}/>
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {CAT_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="members" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[{l:"Toplam Üye",v:"1.247",t:"+14%",up:true},{l:"Bu Ay Yeni",v:"201",t:"+29%",up:true},{l:"VIP Üye",v:"89",t:"+12%",up:true},{l:"Pasif Üye",v:"143",t:"+3%",up:false}].map(m=>(
              <Card key={m.l} className="border border-border shadow-none"><CardContent className="p-4"><p className="text-xl font-bold">{m.v}</p><p className="text-xs text-muted-foreground">{m.l}</p><p className={`text-xs mt-1 font-medium ${m.up?"text-green-600":"text-red-500"}`}>{m.t}</p></CardContent></Card>
            ))}
          </div>
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-2"><CardTitle className="text-sm font-semibold">Aylık Yeni Üye Kazanımı</CardTitle></CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY}>
                  <defs><linearGradient id="uyeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="ay" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                  <RTooltip contentStyle={{fontSize:12,borderRadius:8}}/>
                  <Area type="monotone" dataKey="uye" stroke="#3b82f6" strokeWidth={2.5} fill="url(#uyeGrad)" name="Yeni Üye"/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[{l:"Toplam Ürün",v:"247",t:"+8%",up:true},{l:"Aktif",v:"201",t:"+5%",up:true},{l:"Stok Kritik",v:"12",t:"+4",up:false},{l:"Bu Ay Satış",v:"589",t:"+21%",up:true}].map(m=>(
              <Card key={m.l} className="border border-border shadow-none"><CardContent className="p-4"><p className="text-xl font-bold">{m.v}</p><p className="text-xs text-muted-foreground">{m.l}</p><p className={`text-xs mt-1 font-medium ${m.up?"text-green-600":"text-red-500"}`}>{m.t}</p></CardContent></Card>
            ))}
          </div>
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">En Çok Satan Ürünler (Satış adedi)</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {topProds.map((p,i)=>(
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-muted-foreground w-4">{i+1}.</span><span className="text-xs font-medium">{p.name}</span></div>
                    <div className="flex items-center gap-3 text-xs"><span className="text-muted-foreground">{p.sales} satış</span><span className="font-bold text-primary">{(p.revenue/1000).toFixed(0)}k π</span></div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{width:`${p.pct}%`}}/></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Marketing ────────────────────────────────────────────────────────────────
function MarketingSection() {
  const { toast } = useToast();
  const [banners, setBanners] = useState([
    { id:"b1", title:"Pi Network Hoş Geldin Kampanyası", subtitle:"İlk alışverişte %20 indirim",    linkUrl:"/kampanyalar", bgColor:"#f27a1a", active:true,  order:1 },
    { id:"b2", title:"Yeni Satıcılar Aramızdayız",       subtitle:"Milyonlarca ürün arasından seçin",linkUrl:"/saticilar",  bgColor:"#8b5cf6", active:false, order:2 },
    { id:"b3", title:"Bahar Koleksiyonu 2026",           subtitle:"En trend ürünler burada",          linkUrl:"/kategori/moda",bgColor:"#10b981", active:true, order:3 },
  ]);
  const [campaign, setCampaign] = useState({ subject:"", body:"", target:"all" });
  return (
    <div className="space-y-6">
      <SectionHeader title="Pazarlama & Kampanya" desc="Banner yönetimi ve toplu bildirimler"/>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Slider Banner Yönetimi</h3>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"><Plus className="h-3.5 w-3.5"/>Banner Ekle</Button>
        </div>
        <div className="space-y-3">
          {banners.map(b=>(
            <Card key={b.id} className="border border-border shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{background:b.bgColor}}><Megaphone className="h-5 w-5 text-white"/></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground">{b.subtitle}</p>
                    <p className="text-xs text-primary mt-0.5">{b.linkUrl}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.active?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>{b.active?"Aktif":"Pasif"}</span>
                    <Switch checked={b.active} onCheckedChange={c=>{setBanners(prev=>prev.map(x=>x.id===b.id?{...x,active:c}:x));toast({title:`Banner ${c?"aktif":"pasif"} yapıldı`});}}/>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={()=>setBanners(prev=>prev.filter(x=>x.id!==b.id))}><Trash2 className="h-3.5 w-3.5"/></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Separator/>
      <AdminCampaign />
    </div>
  );
}

// ─── Logs ─────────────────────────────────────────────────────────────────────
function LogsSection({ logs }: { logs:LogEntry[] }) {
  const [levelF,  setLevelF]  = useState("all");
  const [moduleF, setModuleF] = useState("all");
  const [search,  setSearch]  = useState("");
  const modules = ["all",...Array.from(new Set(logs.map(l=>l.module)))];
  const filtered = useMemo(()=>logs.filter(l=>{
    const q=search.toLowerCase();
    return (l.action.toLowerCase().includes(q)||l.target.toLowerCase().includes(q))&&(levelF==="all"||l.level===levelF)&&(moduleF==="all"||l.module===moduleF);
  }),[logs,search,levelF,moduleF]);
  return (
    <div className="space-y-4">
      <SectionHeader title="Sistem Logları" desc={`${logs.length} kayıt`}
        action={<Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"><Download className="h-3.5 w-3.5"/>Log İndir</Button>}
      />
      <div className="flex items-center gap-2 flex-wrap">
        {(["all","info","warning","error"] as const).map(l=>(
          <button key={l} onClick={()=>setLevelF(l)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${levelF===l?"bg-primary text-primary-foreground border-primary":"bg-card border-border hover:bg-muted"}`}>
            {l==="all"?"Tümü":l.charAt(0).toUpperCase()+l.slice(1)}
          </button>
        ))}
        <Select value={moduleF} onValueChange={setModuleF}>
          <SelectTrigger className="h-9 w-36 text-xs"><SelectValue/></SelectTrigger>
          <SelectContent>{modules.map(m=><SelectItem key={m} value={m} className="text-xs">{m==="all"?"Tüm Modüller":m}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex-1 min-w-36"><SearchBar value={search} onChange={setSearch} placeholder="İşlem veya hedef ara..."/></div>
      </div>
      <Card className="border border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b border-border">
              <tr>{["Seviye","Modül","İşlem","Hedef","Admin","IP","Zaman"].map(h=><th key={h} className="p-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(l=>(
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${logLevelColor[l.level]}`}>{l.level.toUpperCase()}</span></td>
                  <td className="p-3 text-xs font-medium">{l.module}</td>
                  <td className="p-3 text-xs text-muted-foreground max-w-[200px]">{l.action}</td>
                  <td className="p-3 text-xs font-mono text-primary">{l.target}</td>
                  <td className="p-3 text-xs text-muted-foreground">{l.admin}</td>
                  <td className="p-3 text-xs font-mono text-muted-foreground">{l.ip}</td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{l.time}</td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">Log kaydı bulunamadı</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsSection() {
  const [s, setS] = useState({
    siteName:"Ucuzcubakkal", siteDesc:"Pi topluluğu için global e-ticaret platformu", contactEmail:"destek@ucuzcubakkal.com", supportPhone:"0850 123 4567",
    defaultCommission:10, maxProductImages:8, minOrderAmount:10, autoApproveProducts:false, maintenanceMode:false,
    emailNotifs:true, orderNotifs:true, sellerNotifs:true, refundNotifs:true, smsNotifs:false,
    piWallet:"GBST...UCB7", piCommission:5, piAutoSettle:true, apiKey:"ucb_live_sk_2026_xK9mP3nR7qW2", webhookUrl:"https://ucuzcubakkal.com/api/webhook",
  });
  const ss = (k:string, v:unknown) => setS(prev=>({...prev,[k]:v}));
  const { toast } = useToast();
  const save = () => toast({title:"Ayarlar kaydedildi"});
  return (
    <div className="space-y-4">
      <SectionHeader title="Platform Ayarları" desc="Site geneli yapılandırma"/>
      <Tabs defaultValue="general">
        <TabsList className="bg-muted h-9">
          {[["general","Genel"],["commerce","Ticaret"],["notifications","Bildirimler"],["api","API & Pi"]].map(([v,l])=><TabsTrigger key={v} value={v} className="text-xs">{l}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">Site Bilgileri</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">Site Adı</Label><Input className="h-9 text-sm" value={s.siteName} onChange={e=>ss("siteName",e.target.value)}/></div>
              <div className="space-y-1.5"><Label className="text-xs">Site Açıklaması</Label><Textarea className="text-sm resize-none" rows={2} value={s.siteDesc} onChange={e=>ss("siteDesc",e.target.value)}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Destek E-postası</Label><Input className="h-9 text-sm" value={s.contactEmail} onChange={e=>ss("contactEmail",e.target.value)}/></div>
                <div className="space-y-1.5"><Label className="text-xs">Destek Telefonu</Label><Input className="h-9 text-sm" value={s.supportPhone} onChange={e=>ss("supportPhone",e.target.value)}/></div>
              </div>
              {[{k:"maintenanceMode",l:"Bakım Modu",d:"Aktifken site ziyaretçilere kapalı olur",danger:true}].map(r=>(
                <div key={r.k} className={`flex items-center justify-between p-3 rounded-lg ${r.danger?"bg-red-50 border border-red-200":"bg-muted"}`}>
                  <div><Label className={`text-sm font-medium ${r.danger?"text-red-700":""}`}>{r.l}</Label><p className={`text-xs mt-0.5 ${r.danger?"text-red-600":"text-muted-foreground"}`}>{r.d}</p></div>
                  <Switch checked={(s as Record<string,unknown>)[r.k] as boolean} onCheckedChange={v=>ss(r.k,v)} className={r.danger?"data-[state=checked]:bg-red-600":""}/>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button onClick={save}>Değişiklikleri Kaydet</Button>
        </TabsContent>
        <TabsContent value="commerce" className="space-y-4 mt-4">
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">Ticaret Ayarları</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Varsayılan Komisyon (%)</Label><Input type="number" className="h-9 text-sm" value={s.defaultCommission} onChange={e=>ss("defaultCommission",+e.target.value)}/></div>
                <div className="space-y-1.5"><Label className="text-xs">Maks. Ürün Görseli</Label><Input type="number" className="h-9 text-sm" value={s.maxProductImages} onChange={e=>ss("maxProductImages",+e.target.value)}/></div>
                <div className="space-y-1.5"><Label className="text-xs">Min. Sipariş (π)</Label><Input type="number" className="h-9 text-sm" value={s.minOrderAmount} onChange={e=>ss("minOrderAmount",+e.target.value)}/></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div><Label className="text-sm font-medium">Ürünleri Otomatik Onayla</Label><p className="text-xs text-muted-foreground mt-0.5">Yeni ürünler moderasyon olmadan yayınlanır</p></div>
                <Switch checked={s.autoApproveProducts} onCheckedChange={v=>ss("autoApproveProducts",v)}/>
              </div>
            </CardContent>
          </Card>
          <Button onClick={save}>Değişiklikleri Kaydet</Button>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">Bildirim Tercihleri</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {[
                {k:"emailNotifs",l:"E-posta Bildirimleri",d:"Sistem olayları için e-posta"},
                {k:"orderNotifs",l:"Sipariş Bildirimleri",d:"Yeni ve güncellenen siparişler"},
                {k:"sellerNotifs",l:"Satıcı Bildirimleri",d:"Başvurular ve değişiklikler"},
                {k:"refundNotifs",l:"İade Bildirimleri",d:"Yeni iade talepleri"},
                {k:"smsNotifs",l:"SMS Bildirimleri",d:"Kritik olaylar için SMS"},
              ].map(r=>(
                <div key={r.k} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div><Label className="text-sm font-medium">{r.l}</Label><p className="text-xs text-muted-foreground mt-0.5">{r.d}</p></div>
                  <Switch checked={(s as Record<string,unknown>)[r.k] as boolean} onCheckedChange={v=>ss(r.k,v)}/>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button onClick={save}>Değişiklikleri Kaydet</Button>
        </TabsContent>
        <TabsContent value="api" className="space-y-4 mt-4">
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">API & Pi Network Entegrasyonu</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">API Anahtarı</Label>
                <div className="flex gap-2">
                  <Input className="h-9 text-xs font-mono flex-1" value={s.apiKey} readOnly/>
                  <Button size="icon" variant="outline" className="h-9 w-9" onClick={()=>{navigator.clipboard.writeText(s.apiKey);toast({title:"Kopyalandı"});}}><Copy className="h-3.5 w-3.5"/></Button>
                </div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Webhook URL</Label><Input className="h-9 text-sm" value={s.webhookUrl} onChange={e=>ss("webhookUrl",e.target.value)}/></div>
              <Separator/>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Pi Cüzdan Adresi</Label><Input className="h-9 text-sm font-mono" value={s.piWallet} onChange={e=>ss("piWallet",e.target.value)}/></div>
                <div className="space-y-1.5"><Label className="text-xs">Pi Komisyon (%)</Label><Input type="number" className="h-9 text-sm" value={s.piCommission} onChange={e=>ss("piCommission",+e.target.value)}/></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div><Label className="text-sm font-medium">Otomatik Ödeme Tasfiyesi</Label><p className="text-xs text-muted-foreground mt-0.5">Ödemeler otomatik olarak satıcılara aktarılır</p></div>
                <Switch checked={s.piAutoSettle} onCheckedChange={v=>ss("piAutoSettle",v)}/>
              </div>
            </CardContent>
          </Card>
          <Button onClick={save}>Değişiklikleri Kaydet</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Görüş & Öneriler ─────────────────────────────────────────────────────────
type ForumMsg = {
  id: string; from: "musteri" | "satici"; userName: string; userId: string;
  subject: string; message: string;
  category: "oneri" | "sikayet" | "tesekkur" | "diger"; createdAt: string; read: boolean;
};
const CATEGORY_LABELS: Record<string, string> = { oneri:"Öneri", sikayet:"Şikayet", tesekkur:"Teşekkür", diger:"Diğer" };
const CATEGORY_COLORS: Record<string, string> = { oneri:"bg-blue-100 text-blue-700", sikayet:"bg-red-100 text-red-700", tesekkur:"bg-green-100 text-green-700", diger:"bg-muted text-muted-foreground" };

function AdminGoruslerSection() {
  const [msgs, setMsgs] = useState<ForumMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"musteri"|"satici">("all");
  const [selected, setSelected] = useState<ForumMsg|null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forum-gorusu");
      if (res.ok) setMsgs(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = msgs.filter(m => filter === "all" || m.from === filter);
  const unread = msgs.filter(m => !m.read).length;

  const markRead = (id: string) => setMsgs(prev => prev.map(m => m.id===id ? {...m, read:true} : m));

  return (
    <div className="space-y-4">
      <SectionHeader title="Görüş & Öneriler" desc={`Müşteri ve satıcılardan gelen geri bildirimler${unread>0 ? ` — ${unread} okunmamış` : ""}`}/>
      <div className="flex items-center gap-2 flex-wrap">
        {(["all","musteri","satici"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter===f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>
            {f==="all" ? "Tümü" : f==="musteri" ? "Müşteriler" : "Satıcılar"}
          </button>
        ))}
        <button onClick={load} className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 transition-colors">
          <RefreshCw className="h-3 w-3"/> Yenile
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32"><Activity className="h-5 w-5 animate-spin text-muted-foreground"/></div>
      ) : filtered.length === 0 ? (
        <Card className="border border-border shadow-none">
          <CardContent className="p-10 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-40"/>
            <p className="text-sm text-muted-foreground">Henüz görüş veya öneri bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(m => (
            <Card key={m.id} className={`border shadow-none cursor-pointer hover:shadow-sm transition-shadow ${!m.read ? "border-primary/30 bg-primary/5" : "border-border"}`}
              onClick={() => { setSelected(m); markRead(m.id); }}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${m.from==="musteri" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                  {m.from==="musteri" ? "M" : "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{m.userName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[m.category]}`}>{CATEGORY_LABELS[m.category]}</span>
                    {!m.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0"/>}
                  </div>
                  <p className="text-sm font-medium mt-0.5 truncate">{m.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{m.message}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {new Date(m.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Detay dialog */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-base">{selected.subject}</p>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4"/>
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[selected.category]}`}>{CATEGORY_LABELS[selected.category]}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selected.from==="musteri" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>{selected.from==="musteri" ? "Müşteri" : "Satıcı"}</span>
              <span className="text-xs text-muted-foreground">{selected.userName}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            <p className="text-xs text-muted-foreground">{new Date(selected.createdAt).toLocaleString("tr-TR")}</p>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelected(null)}>Kapat</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,  setAuthed]  = useState(false);
  const [user,    setUser]    = useState("");
  const [pass,    setPass]    = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);

  const [orders,       setOrders]       = useState<Order[]>(INIT_ORDERS);
  const [products,     setProducts]     = useState<Product[]>(INIT_PRODUCTS);
  const [sellers,      setSellers]      = useState<Seller[]>(INIT_SELLERS);
  const [members,      setMembers]      = useState<Member[]>(INIT_MEMBERS);
  const [coupons,      setCoupons]      = useState<Coupon[]>(INIT_COUPONS);
  const [refunds,      setRefunds]      = useState<Refund[]>(INIT_REFUNDS);
  const [payments,     setPayments]     = useState<Payment[]>(INIT_PAYMENTS);
  const [applications, setApplications] = useState<Application[]>(INIT_APPLICATIONS);
  const [logs]                          = useState<LogEntry[]>(INIT_LOGS);
  const [notifs,       setNotifs]       = useState<Notif[]>(INIT_NOTIFS);

  const { toast } = useToast();
  const unread = notifs.filter(n=>!n.read).length;

  const login = () => {
    if(user.trim()===CREDS.username && pass.trim()===CREDS.password) {
      setAuthed(true);
      toast({ title: "Giriş başarılı", description: "Admin paneline hoş geldiniz." });
    } else {
      toast({ title: "Hatalı kullanıcı adı veya şifre", description: "Bilgilerinizi kontrol edin.", variant: "destructive" });
    }
  };

  const navGroups = [
    { label:"Ana",   items:[{ id:"dashboard",    icon:<LayoutDashboard className="h-4 w-4"/>, label:"Genel Bakış" }]},
    { label:"İşlemler", items:[
      { id:"orders",      icon:<ShoppingBag className="h-4 w-4"/>,   label:"Siparişler",   badge:orders.filter(o=>o.status==="hazirlaniyor").length },
      { id:"products",    icon:<Package className="h-4 w-4"/>,       label:"Ürünler",       badge:products.filter(p=>p.stock===0&&p.status==="aktif").length },
      { id:"sellers",     icon:<Store className="h-4 w-4"/>,         label:"Satıcılar",     badge:sellers.filter(s=>s.status==="askida").length },
      { id:"members",     icon:<Users className="h-4 w-4"/>,         label:"Üyeler"         },
      { id:"applications",icon:<UserCheck className="h-4 w-4"/>,    label:"Başvurular",    badge:applications.filter(a=>a.status==="bekliyor").length },
      { id:"returns",     icon:<RotateCcw className="h-4 w-4"/>,     label:"İade & Şikayet",badge:refunds.filter(r=>r.status==="bekliyor").length },
    ]},
    { label:"İşlem Araçları", items:[
      { id:"kanban",       icon:<Layers className="h-4 w-4"/>,        label:"Kanban Tahta"   },
      { id:"broadcast",    icon:<Megaphone className="h-4 w-4"/>,     label:"Duyurular"      },
    ]},
    { label:"Analiz & Raporlar", items:[
      { id:"finance",      icon:<Wallet className="h-4 w-4"/>,        label:"Finans",        badge:payments.filter(p=>p.status==="bekliyor").length },
      { id:"coupons",      icon:<Tag className="h-4 w-4"/>,           label:"Kuponlar"       },
      { id:"reports",      icon:<BarChart2 className="h-4 w-4"/>,     label:"Raporlar"       },
      { id:"seller-scores",icon:<Award className="h-4 w-4"/>,         label:"Satıcı Skorları"},
    ]},
    { label:"Sistem & AI", items:[
      { id:"ai-assistant", icon:<Sparkles className="h-4 w-4"/>,      label:"AI Asistan"     },
      { id:"gorusler",     icon:<MessageSquare className="h-4 w-4"/>, label:"Görüş & Öneriler" },
      { id:"marketing",    icon:<Globe className="h-4 w-4"/>,         label:"Pazarlama"      },
      { id:"logs",         icon:<Terminal className="h-4 w-4"/>,      label:"Sistem Logları" },
      { id:"settings",     icon:<Settings className="h-4 w-4"/>,      label:"Ayarlar"        },
    ]},
  ];

  const sectionTitles: Record<Section,string> = {
    dashboard:"Genel Bakış", orders:"Siparişler", products:"Ürünler", sellers:"Satıcılar", members:"Üyeler",
    returns:"İade & Şikayet", finance:"Finans & Ödemeler", coupons:"Kuponlar", reports:"Raporlar",
    marketing:"Pazarlama", applications:"Başvurular", logs:"Sistem Logları", settings:"Ayarlar",
    kanban:"Kanban Sipariş Tahtası", "seller-scores":"Satıcı Performans Skorları",
    broadcast:"Duyuru & Bildirim Sistemi", "ai-assistant":"AI Asistan",
    gorusler:"Görüş & Öneriler",
  };

  const navigate = (s:Section) => { setSection(s); setSidebarOpen(false); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0"><span className="text-white font-bold text-sm">U</span></div>
          <div><p className="font-bold text-sm leading-tight">Ucuzcubakkal</p><p className="text-xs text-muted-foreground">Admin Paneli</p></div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map(group=>(
          <div key={group.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">{group.label}</p>
            {group.items.map(item=>(
              <button key={item.id} onClick={()=>navigate(item.id as Section)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section===item.id?"bg-primary text-primary-foreground shadow-sm":"hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
                {(item.badge||0)>0 && <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${section===item.id?"bg-white/20 text-white":"bg-red-100 text-red-600"}`}>{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-muted mb-2">
          <Avatar className="w-8 h-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">HA</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">hanedan</p><p className="text-xs text-muted-foreground">Süper Admin</p></div>
        </div>
        <button onClick={()=>{setAuthed(false);setUser("");setPass("");}} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"><LogOut className="h-4 w-4"/>Çıkış Yap</button>
      </div>
    </div>
  );

  if(!authed) return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
      <Toaster/>
      <Card className="w-full max-w-sm shadow-lg border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center"><span className="text-white font-bold text-2xl">U</span></div>
            <h1 className="text-xl font-bold">Admin Girişi</h1>
            <p className="text-sm text-muted-foreground mt-1">Yönetim paneline erişmek için giriş yapın</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label className="text-sm">Kullanıcı Adı</Label><Input placeholder="Kullanıcı adı" value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
            <div className="space-y-1.5">
              <Label className="text-sm">Şifre</Label>
              <div className="relative">
                <Input type={showPw?"text":"password"} placeholder="Şifre" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} className="pr-10"/>
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw?<Eye className="h-4 w-4"/>:<Lock className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <Button className="w-full h-10" onClick={login}>Giriş Yap</Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-6">Ucuzcubakkal Admin Panel v2.0</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F7F7F7] overflow-hidden">
      <Toaster/>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col flex-shrink-0 bg-card border-r border-border h-screen overflow-hidden">
        <SidebarContent/>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setSidebarOpen(false)}/>
          <aside className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border overflow-y-auto"><SidebarContent/></aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button className="md:hidden" onClick={()=>setSidebarOpen(true)}><Menu className="h-5 w-5"/></button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Admin</span><ChevronRight className="h-3 w-3"/><span className="font-semibold text-foreground">{sectionTitles[section]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-2.5 py-1.5">
              <Globe className="h-3.5 w-3.5"/>Siteyi Gör
            </Link>
            {/* Notifications */}
            <div className="relative">
              <button onClick={()=>setNotifOpen(!notifOpen)} className="relative w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <Bell className="h-4 w-4"/>
                {unread>0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unread}</span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <p className="font-semibold text-sm">Bildirimler</p>
                    <button onClick={()=>setNotifs(prev=>prev.map(n=>({...n,read:true})))} className="text-xs text-primary hover:underline">Tümünü okundu işaretle</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.map(n=>(
                      <div key={n.id} onClick={()=>setNotifs(prev=>prev.map(x=>x.id===n.id?{...x,read:true}:x))} className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/60 transition-colors border-b border-border/50 last:border-0 ${!n.read?"bg-primary/5":""}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notifTypeColor[n.type]}`}>
                          {n.type==="order"?<ShoppingBag className="h-3.5 w-3.5"/>:n.type==="seller"?<Store className="h-3.5 w-3.5"/>:n.type==="refund"?<RotateCcw className="h-3.5 w-3.5"/>:<Bell className="h-3.5 w-3.5"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed">{n.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"/>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {section==="dashboard"     && <DashboardSection    orders={orders} products={products} sellers={sellers} members={members} onNav={navigate}/>}
          {section==="orders"        && <OrdersSection       orders={orders}       setOrders={setOrders}/>}
          {section==="products"      && <ProductsSection     products={products}   setProducts={setProducts}/>}
          {section==="sellers"       && <SellersSection      sellers={sellers}     setSellers={setSellers}/>}
          {section==="members"       && <MembersSection      members={members}     setMembers={setMembers}/>}
          {section==="applications"  && <ApplicationsSection applications={applications} setApplications={setApplications}/>}
          {section==="returns"       && <ReturnsSection      refunds={refunds}     setRefunds={setRefunds}/>}
          {section==="finance"       && <FinanceSection      payments={payments}   setPayments={setPayments}/>}
          {section==="coupons"       && <CouponsSection      coupons={coupons}     setCoupons={setCoupons}/>}
          {section==="reports"       && <ReportsSection/>}
          {section==="marketing"     && <MarketingSection/>}
          {section==="logs"          && <LogsSection         logs={logs}/>}
          {section==="settings"      && <SettingsSection/>}
          {section==="kanban"        && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-bold tracking-tight">Kanban Sipariş Tahtası</h2><p className="text-sm text-muted-foreground mt-0.5">Siparişleri sürükleyerek durum güncelleyin</p></div>
              <AdminKanban orders={orders} onStatusChange={(id,status)=>setOrders(prev=>prev.map(o=>o.id===id?{...o,status}:o))}/>
            </div>
          )}
          {section==="seller-scores" && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-bold tracking-tight">Satıcı Performans Skorları</h2><p className="text-sm text-muted-foreground mt-0.5">Her satıcının 100 üzerinden performans skoru ve rozet sıralaması</p></div>
              <AdminSellerScore sellers={sellers}/>
            </div>
          )}
          {section==="broadcast"     && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-bold tracking-tight">Duyuru & Bildirim Sistemi</h2><p className="text-sm text-muted-foreground mt-0.5">Üyelere ve satıcılara toplu bildirim, e-posta veya SMS gönderin</p></div>
              <AdminBroadcast memberCount={members.length} sellerCount={sellers.length}/>
            </div>
          )}
          {section==="ai-assistant"  && (
            <div className="space-y-4">
              <div><h2 className="text-lg font-bold tracking-tight">AI Asistan</h2><p className="text-sm text-muted-foreground mt-0.5">Platform verileri hakkında Türkçe sorular sorun, anlık analiz alın</p></div>
              <AdminAIAssistant/>
            </div>
          )}
          {section==="gorusler" && <AdminGoruslerSection/>}
        </main>
      </div>

      {/* Close notif on outside click */}
      {notifOpen && <div className="fixed inset-0 z-40" onClick={()=>setNotifOpen(false)}/>}
    </div>
  );
}
