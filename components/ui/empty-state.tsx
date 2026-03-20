"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Bell, MessageCircle, Package, Search } from "lucide-react";

type EmptyStateProps = {
  type: "cart" | "favorites" | "notifications" | "messages" | "orders" | "search";
  searchQuery?: string;
};

const CONFIG = {
  cart: {
    icon: ShoppingBag,
    title: "Sepetiniz Boş",
    description: "Henüz sepetinize ürün eklemediniz. Milyonlarca ürünü keşfetmeye başlayın.",
    action: { label: "Alışverişe Başla", href: "/kategori/tumu" },
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  favorites: {
    icon: Heart,
    title: "Favori Ürününüz Yok",
    description: "Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.",
    action: { label: "Ürünleri Keşfet", href: "/" },
    accent: "text-destructive",
    bg: "bg-destructive/10",
  },
  notifications: {
    icon: Bell,
    title: "Bildirim Yok",
    description: "Şu an için yeni bildiriminiz bulunmuyor. Sipariş ve mesaj geldiğinde buradan göreceksiniz.",
    action: { label: "Siparişlere Git", href: "/profil" },
    accent: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  messages: {
    icon: MessageCircle,
    title: "Mesaj Kutunuz Boş",
    description: "Satıcılarla doğrudan iletişim kurarak siparişlerinizi takip edebilirsiniz.",
    action: { label: "Satıcıları Keşfet", href: "/saticilar" },
    accent: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  orders: {
    icon: Package,
    title: "Siparişiniz Yok",
    description: "Henüz bir siparişiniz bulunmuyor. Milyonlarca ürünü keşfedin.",
    action: { label: "Alışverişe Başla", href: "/" },
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  search: {
    icon: Search,
    title: "Sonuç Bulunamadı",
    description: "Aradığınız ürün bulunamadı. Farklı bir kelime deneyin veya kategorilere göz atın.",
    action: { label: "Tüm Ürünler", href: "/kategori/tumu" },
    accent: "text-muted-foreground",
    bg: "bg-muted",
  },
};

export function EmptyState({ type, searchQuery }: EmptyStateProps) {
  const config = CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className={`${config.bg} rounded-full p-6 mb-5`}>
        <Icon className={`h-10 w-10 ${config.accent}`} />
      </div>
      <h3 className="text-xl font-serif font-bold mb-2">
        {type === "search" && searchQuery
          ? `"${searchQuery}" için sonuç bulunamadı`
          : config.title}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
        {config.description}
      </p>
      <Link href={config.action.href}>
        <Button>{config.action.label}</Button>
      </Link>
    </div>
  );
}
