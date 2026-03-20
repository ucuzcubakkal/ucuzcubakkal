"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck, Clock, CheckCircle2, AlertTriangle,
  Package, ArrowRight, MessageSquare, Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type EscrowStatus = "holding" | "released" | "disputed" | "refunded";

interface EscrowOrder {
  id: string;
  product: string;
  amount: number;
  seller: string;
  buyer: string;
  status: EscrowStatus;
  createdAt: string;
  releasedAt?: string;
  deadline: string; // ISO date — otomatik serbest bırakma tarihi
}

const STATUS_MAP: Record<EscrowStatus, { label: string; color: string; icon: React.ElementType }> = {
  holding:  { label: "Beklemede",       color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: Clock },
  released: { label: "Serbest Bırakıldı", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",  icon: CheckCircle2 },
  disputed: { label: "İtirazda",         color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",           icon: AlertTriangle },
  refunded: { label: "İade Edildi",      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",           icon: ArrowRight },
};

const MOCK_ESCROWS: EscrowOrder[] = [
  { id: "ESC-001", product: "El Dokuma Kilim Yastık", amount: 125, seller: "Ayşe Hanım Atölyesi", buyer: "Mehmet K.", status: "holding",  createdAt: "1 Mar 2026", deadline: "8 Mar 2026" },
  { id: "ESC-002", product: "Seramik Vazo",            amount: 89,  seller: "Çömlek Sanatı",       buyer: "Zeynep A.", status: "released", createdAt: "20 Şub 2026", deadline: "27 Şub 2026" },
  { id: "ESC-003", product: "Ahşap Tepsi",             amount: 156, seller: "Ahşap Dünyası",       buyer: "Hasan B.", status: "disputed", createdAt: "15 Şub 2026", deadline: "22 Şub 2026" },
];

export function EscrowPaymentPanel() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<EscrowOrder[]>(MOCK_ESCROWS);
  const [disputeOpen, setDisputeOpen] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  const handleRelease = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "released", releasedAt: "Bugün" } : o));
    toast({ title: "Odeme serbest bırakıldı", description: "Pi, satıcıya aktarıldı." });
  };

  const handleDispute = (id: string) => {
    if (!disputeReason.trim()) { toast({ title: "Lütfen itiraz sebebi girin", variant: "destructive" }); return; }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "disputed" } : o));
    setDisputeOpen(null);
    setDisputeReason("");
    toast({ title: "Itirazınız alındı", description: "Admin 24 saat içinde inceleyecek." });
  };

  return (
    <div className="space-y-4">
      {/* Bilgi Kartı */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Guvenli Emanet Sistemi</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Odemeniz urun teslim edildikten sonra satıcıya aktarılır. Sorun yaşarsanız itiraz butonunu kullanın — admin 24 saat içinde inceler.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escrow Listesi */}
      <div className="space-y-3">
        {orders.map((order) => {
          const statusInfo = STATUS_MAP[order.status];
          const StatusIcon = statusInfo.icon;
          return (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{order.product}</p>
                      <p className="text-xs text-muted-foreground">{order.seller} → {order.buyer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={cn("gap-1 text-xs border-0", statusInfo.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                    <span className="text-sm font-bold text-primary">{order.amount}π</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Oluşturuldu: <span className="text-foreground font-medium">{order.createdAt}</span></span>
                    <span>Son: <span className="text-foreground font-medium">{order.deadline}</span></span>
                  </div>

                  {order.status === "holding" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => setDisputeOpen(order.id)}
                      >
                        <AlertTriangle className="h-3 w-3" /> Itiraz
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleRelease(order.id)}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Teslim Aldım
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Itiraz Dialogu */}
      <Dialog open={!!disputeOpen} onOpenChange={() => setDisputeOpen(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Scale className="h-4 w-4 text-primary" /> Itiraz Baslat
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">Sorununuzu açıklayın. Admin 24 saat içinde devreye girer ve tarafsız karar verir.</p>
            <div className="space-y-1.5">
              <Label className="text-xs">Itiraz Sebebi</Label>
              <Textarea
                placeholder="Örn: Urun açıklamayla uyuşmuyor, hasar var..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="text-sm resize-none h-24"
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => setDisputeOpen(null)}>Vazgec</Button>
              <Button size="sm" onClick={() => disputeOpen && handleDispute(disputeOpen)}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Gonder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
