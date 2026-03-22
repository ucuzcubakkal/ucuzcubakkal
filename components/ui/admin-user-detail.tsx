"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Mail, Phone, MapPin, Calendar, ShoppingBag, Wallet, Star, Ban, CheckCircle2, MessageSquare, TrendingUp } from "lucide-react";

interface Member {
  id: string; name: string; email: string; role: string;
  orders: number; joinDate: string; status: string;
  totalSpent: number; city: string; phone?: string; segment?: string;
}

interface AdminUserDetailProps {
  member: Member | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

const SPEND_HISTORY = [
  { ay: "Eki", harcama: 820 }, { ay: "Kas", harcama: 1240 }, { ay: "Ara", harcama: 2100 },
  { ay: "Oca", harcama: 980 }, { ay: "Sub", harcama: 1560 }, { ay: "Mar", harcama: 1840 },
];

const SEGMENT_COLOR: Record<string, string> = {
  VIP:    "bg-yellow-100 text-yellow-800",
  Normal: "bg-blue-100 text-blue-800",
  Pasif:  "bg-gray-100 text-gray-600",
};

const STATUS_COLOR: Record<string, string> = {
  aktif:   "bg-green-100 text-green-700",
  askida:  "bg-amber-100 text-amber-700",
  yasakli: "bg-red-100 text-red-700",
};

export function AdminUserDetail({ member, open, onClose, onStatusChange }: AdminUserDetailProps) {
  const [note, setNote] = useState("");

  if (!member) return null;

  const loyalty = Math.min(Math.round((member.orders / 50) * 100), 100);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base">Kullanici Detayi</SheetTitle>
        </SheetHeader>

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {member.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.role === "seller" ? "Satici" : "Alici"}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={`text-xs ${STATUS_COLOR[member.status] ?? "bg-muted text-muted-foreground"}`}>
                {member.status}
              </Badge>
              {member.segment && (
                <Badge className={`text-xs ${SEGMENT_COLOR[member.segment] ?? "bg-muted text-muted-foreground"}`}>
                  {member.segment}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { icon: <Mail className="h-3.5 w-3.5" />, label: "E-posta", value: member.email },
            { icon: <Phone className="h-3.5 w-3.5" />, label: "Telefon", value: member.phone ?? "—" },
            { icon: <MapPin className="h-3.5 w-3.5" />, label: "Sehir", value: member.city },
            { icon: <Calendar className="h-3.5 w-3.5" />, label: "Katilim", value: member.joinDate },
          ].map(item => (
            <div key={item.label} className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </div>
              <p className="text-xs font-semibold truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <Card className="border shadow-none">
            <CardContent className="p-3 text-center">
              <ShoppingBag className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-lg font-bold">{member.orders}</p>
              <p className="text-xs text-muted-foreground">Siparis</p>
            </CardContent>
          </Card>
          <Card className="border shadow-none">
            <CardContent className="p-3 text-center">
              <Wallet className="h-4 w-4 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold">{member.totalSpent.toLocaleString("tr-TR")}π</p>
              <p className="text-xs text-muted-foreground">Toplam</p>
            </CardContent>
          </Card>
          <Card className="border shadow-none">
            <CardContent className="p-3 text-center">
              <Star className="h-4 w-4 mx-auto text-amber-500 mb-1" />
              <p className="text-lg font-bold">{member.orders > 0 ? (member.totalSpent / member.orders).toFixed(0) : 0}π</p>
              <p className="text-xs text-muted-foreground">Ort. Siparis</p>
            </CardContent>
          </Card>
        </div>

        {/* Loyalty progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold">Sadakat Skoru</p>
            <span className="text-xs text-muted-foreground">%{loyalty}</span>
          </div>
          <Progress value={loyalty} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {loyalty >= 80 ? "VIP esiginde" : loyalty >= 40 ? "Normal musteri" : "Pasif — aktivasyon onerilir"}
          </p>
        </div>

        {/* Spend chart */}
        <Card className="border shadow-none mb-5">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> Aylik Harcama (π)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={SPEND_HISTORY}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f27a1a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f27a1a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="ay" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Area type="monotone" dataKey="harcama" stroke="#f27a1a" strokeWidth={2} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Admin note */}
        <div className="mb-5">
          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Admin Notu</p>
          <textarea
            className="w-full text-xs border border-border rounded-xl p-3 resize-none bg-background outline-none focus:ring-1 focus:ring-primary"
            rows={3}
            placeholder="Bu kullanici hakkinda not ekle..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <Separator className="mb-4" />

        {/* Actions */}
        <div className="flex gap-2">
          {member.status !== "aktif" && (
            <Button size="sm" variant="outline" className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => onStatusChange(member.id, "aktif")}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Aktif Et
            </Button>
          )}
          {member.status !== "yasakli" && (
            <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onStatusChange(member.id, "yasakli")}>
              <Ban className="h-3.5 w-3.5 mr-1.5" /> Yasakla
            </Button>
          )}
          {member.status === "aktif" && (
            <Button size="sm" variant="outline" className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50"
              onClick={() => onStatusChange(member.id, "askida")}>
              Askiya Al
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
