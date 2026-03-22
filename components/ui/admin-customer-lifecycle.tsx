"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Users, UserCheck, UserMinus, TrendingUp, ArrowRight } from "lucide-react";

const LIFECYCLE_DATA = [
  { ay: "Eki", yeni: 42, aktif: 180, uyuyan: 34, kaybedilen: 12 },
  { ay: "Kas", yeni: 61, aktif: 200, uyuyan: 28, kaybedilen: 18 },
  { ay: "Ara", yeni: 55, aktif: 215, uyuyan: 31, kaybedilen: 14 },
  { ay: "Oca", yeni: 78, aktif: 242, uyuyan: 22, kaybedilen: 9  },
  { ay: "Sub", yeni: 66, aktif: 258, uyuyan: 19, kaybedilen: 11 },
  { ay: "Mar", yeni: 91, aktif: 289, uyuyan: 24, kaybedilen: 8  },
];

const SEGMENTS = [
  { id: "yeni",      label: "Yeni Müşteri",    count: 91,  color: "bg-blue-500",   icon: <Users className="h-4 w-4" />,      desc: "Son 30 gün içinde ilk siparişini verdi" },
  { id: "aktif",     label: "Aktif",            count: 289, color: "bg-green-500",  icon: <UserCheck className="h-4 w-4" />,  desc: "Son 60 gün içinde sipariş verdi"       },
  { id: "uyuyan",    label: "Uyuyan",           count: 24,  color: "bg-amber-500",  icon: <UserMinus className="h-4 w-4" />,  desc: "60-120 gün arası işlem yok"            },
  { id: "kaybedilen",label: "Kaybedilen",       count: 8,   color: "bg-red-500",    icon: <ArrowRight className="h-4 w-4" />, desc: "120+ gün işlem yok"                    },
];

export function AdminCustomerLifecycle() {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Müşteri Yaşam Döngüsü Paneli
        </CardTitle>
        <CardDescription className="text-xs">Müşteri segmentlerini zaman serisi ile izle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Segment kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEGMENTS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSegment(activeSegment === s.id ? null : s.id)}
              className={`text-left p-3 rounded-xl border transition-all hover:shadow-sm ${activeSegment === s.id ? "border-primary ring-1 ring-primary/30 bg-primary/5" : "border-border bg-card"}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-lg font-bold">{s.count}</p>
              <p className="text-xs font-semibold">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Alan Grafigi */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LIFECYCLE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                {["yeni","aktif","uyuyan","kaybedilen"].map((k, i) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={["#3b82f6","#22c55e","#f59e0b","#ef4444"][i]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={["#3b82f6","#22c55e","#f59e0b","#ef4444"][i]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="ay" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="aktif"      name="Aktif"      stroke="#22c55e" fill="url(#grad-aktif)"      strokeWidth={2} />
              <Area type="monotone" dataKey="yeni"       name="Yeni"       stroke="#3b82f6" fill="url(#grad-yeni)"       strokeWidth={2} />
              <Area type="monotone" dataKey="uyuyan"     name="Uyuyan"     stroke="#f59e0b" fill="url(#grad-uyuyan)"     strokeWidth={2} />
              <Area type="monotone" dataKey="kaybedilen" name="Kaybedilen" stroke="#ef4444" fill="url(#grad-kaybedilen)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Yeniden etkinlestirme onerisi */}
        {activeSegment === "uyuyan" && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Otomatik Yeniden Etkinlestirme Kampanyasi</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">24 uyuyan musteri icin "Sizi ozledik - %10 indirim" kampanyasi baslat</p>
            <Button size="sm" className="mt-2 h-7 text-xs bg-amber-500 hover:bg-amber-600">Kampanya Olustur</Button>
          </div>
        )}
        {activeSegment === "kaybedilen" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Kaybedilen Musteri Analizi</p>
            <p className="text-xs text-red-600 dark:text-red-500">8 kaybedilen musteri son ziyaretlerinde ortalama sepeti terk etmisti. Sepet hatirlatma aktivasyonu onerilir.</p>
            <Button size="sm" variant="outline" className="mt-2 h-7 text-xs border-red-300 text-red-600 hover:bg-red-50">Detayli Rapor Goster</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
