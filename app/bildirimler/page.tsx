"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, MessageCircle, Star, ShoppingBag, CheckCheck } from "lucide-react";
import { Header } from "@/components/header";

type Notification = {
  id: string;
  type: "order" | "message" | "review" | "product" | "system";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "Siparişiniz Kargoya Verildi",
    message: "El Dokuma Kilim Yastık siparişiniz kargoya verildi. Takip no: TRK123456",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: "/profil",
  },
  {
    id: "n2",
    type: "message",
    title: "Yeni Mesaj: Ayşe Hanım Atölyesi",
    message: "Mavi-krem kombinasyonu yapabiliriz, nasıl istersiniz?",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: "/mesajlar",
  },
  {
    id: "n3",
    type: "review",
    title: "Değerlendirmeniz Onaylandı",
    message: "Seramik Vazo için yazdığınız değerlendirme yayınlandı.",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "n4",
    type: "product",
    title: "Favori Ürününüzde İndirim",
    message: "Favorilerinize eklediğiniz Seramik Kupa %15 indirime girdi!",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    link: "/urun/3",
  },
  {
    id: "n5",
    type: "system",
    title: "Hoş Geldiniz!",
    message: "Ucuzcubakkal'a üye olduğunuz için teşekkürler. Keşfetmeye başlayın!",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    link: "/",
  },
];

export default function BildirimlerPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order": return <Package className="h-5 w-5" />;
      case "message": return <MessageCircle className="h-5 w-5" />;
      case "review": return <Star className="h-5 w-5" />;
      case "product": return <ShoppingBag className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} gün önce`;
    if (hours > 0) return `${hours} saat önce`;
    if (mins > 0) return `${mins} dk önce`;
    return "Az önce";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-1">Bildirimler</h2>
              <p className="text-muted-foreground text-sm">
                {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : "Tüm bildirimler okundu"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Tümünü Okundu
              </Button>
            )}
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tümü ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Okunmamış ({unreadCount})
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {filter === "unread" ? "Okunmamış bildirim yok" : "Henüz bildirim yok"}
              </h3>
              <p className="text-muted-foreground mb-6">
                Sipariş güncellemeleri ve mesajlar burada görünecek
              </p>
              <Link href="/">
                <Button>Ana Sayfaya Dön</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((notification) => (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-all cursor-pointer border ${
                    !notification.read
                      ? "border-primary/40 bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => {
                    if (!notification.read) handleMarkAsRead(notification.id);
                    if (notification.link) window.location.href = notification.link;
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2.5 rounded-full flex-shrink-0 ${
                          !notification.read
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm leading-snug">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <Badge className="text-xs px-1.5 py-0">Yeni</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-1.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
