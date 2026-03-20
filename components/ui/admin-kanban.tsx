"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, Truck, CheckCircle2, XCircle, GripVertical, ShoppingBag } from "lucide-react";

type OrderStatus = "hazirlaniyor" | "kargoda" | "teslim_edildi" | "iptal";
interface Order { id: string; user: string; product: string; seller: string; amount: number; status: OrderStatus; date: string; city?: string; }

const COLUMNS: { key: OrderStatus; label: string; color: string; icon: React.ReactNode; bg: string }[] = [
  { key: "hazirlaniyor", label: "Hazırlanıyor", color: "text-amber-700",  icon: <Package className="h-4 w-4" />,       bg: "bg-amber-50 border-amber-200"  },
  { key: "kargoda",      label: "Kargoda",      color: "text-blue-700",   icon: <Truck className="h-4 w-4" />,         bg: "bg-blue-50 border-blue-200"    },
  { key: "teslim_edildi",label: "Teslim Edildi",color: "text-green-700",  icon: <CheckCircle2 className="h-4 w-4" />,  bg: "bg-green-50 border-green-200"  },
  { key: "iptal",        label: "İptal",         color: "text-red-700",    icon: <XCircle className="h-4 w-4" />,       bg: "bg-red-50 border-red-200"      },
];

export function AdminKanban({ orders, onStatusChange }: { orders: Order[]; onStatusChange: (id: string, status: OrderStatus) => void }) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver,  setDragOver] = useState<OrderStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragging(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, col: OrderStatus) => {
    e.preventDefault();
    if (dragging) { onStatusChange(dragging, col); }
    setDragging(null); setDragOver(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map(col => {
        const colOrders = orders.filter(o => o.status === col.key);
        return (
          <div
            key={col.key}
            className={`rounded-xl border-2 transition-all ${dragOver === col.key ? "scale-[1.02] shadow-md " + col.bg : "border-border bg-muted/30"}`}
            onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, col.key)}
          >
            <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-b ${col.bg} ${col.color}`}>
              <div className="flex items-center gap-2 font-semibold text-sm">
                {col.icon}{col.label}
              </div>
              <span className="text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full">{colOrders.length}</span>
            </div>
            <div className="p-3 space-y-2 min-h-[200px]">
              {colOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-xs gap-1">
                  <ShoppingBag className="h-6 w-6 opacity-30" />
                  <span>Sipariş yok</span>
                </div>
              )}
              {colOrders.map(order => (
                <div
                  key={order.id}
                  draggable
                  onDragStart={e => handleDragStart(e, order.id)}
                  className={`bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all ${dragging === order.id ? "opacity-40 scale-95" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-primary">{order.id}</span>
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-orange-100 text-orange-700">{order.user[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium truncate">{order.user}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-2">{order.product}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{order.amount.toLocaleString()}π</span>
                    <span className="text-xs text-muted-foreground">{order.city || "—"}</span>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {COLUMNS.filter(c => c.key !== col.key).map(c => (
                      <button
                        key={c.key}
                        onClick={() => onStatusChange(order.id, c.key)}
                        className={`text-xs px-2 py-0.5 rounded border transition-colors hover:opacity-80 ${c.bg} ${c.color} border-current/20`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
