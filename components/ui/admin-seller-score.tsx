"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, Star, Truck, RotateCcw, Package, Award } from "lucide-react";

interface Seller {
  id: string; name: string; category: string; rating: number; sales: number;
  verified: boolean; badge: string; totalRevenue: number; commission: number;
  status: string;
}

function calcScore(seller: Seller) {
  const ratingScore   = (seller.rating / 5) * 30;
  const salesScore    = Math.min((seller.sales / 500) * 25, 25);
  const revenueScore  = Math.min((seller.totalRevenue / 150000) * 25, 25);
  const verifiedScore = seller.verified ? 20 : 0;
  return Math.round(ratingScore + salesScore + revenueScore + verifiedScore);
}

function getBadgeFromScore(score: number) {
  if (score >= 85) return { label: "Platin", color: "border-purple-300 bg-purple-50 text-purple-700" };
  if (score >= 65) return { label: "Altın",  color: "border-yellow-300 bg-yellow-50 text-yellow-700" };
  if (score >= 45) return { label: "Gümüş", color: "border-gray-300 bg-gray-50 text-gray-700" };
  return                  { label: "Bronz",  color: "border-amber-300 bg-amber-50 text-amber-700" };
}

const METRICS = [
  { key: "rating",   label: "Müşteri Puanı",  icon: <Star className="h-3.5 w-3.5 text-yellow-500" />,  max: 30 },
  { key: "sales",    label: "Satış Hacmi",     icon: <Package className="h-3.5 w-3.5 text-blue-500" />, max: 25 },
  { key: "revenue",  label: "Ciro Performansı",icon: <Truck className="h-3.5 w-3.5 text-green-500" />,  max: 25 },
  { key: "verified", label: "Doğrulama",       icon: <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />, max: 20 },
];

export function AdminSellerScore({ sellers }: { sellers: Seller[] }) {
  const ranked = [...sellers]
    .map(s => ({ ...s, score: calcScore(s), badge: getBadgeFromScore(calcScore(s)) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Platin Satıcı", count: ranked.filter(s => s.badge.label === "Platin").length,  color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Altın Satıcı",  count: ranked.filter(s => s.badge.label === "Altın").length,   color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Gümüş Satıcı", count: ranked.filter(s => s.badge.label === "Gümüş").length,   color: "text-gray-600",   bg: "bg-gray-50"   },
          { label: "Bronz Satıcı",  count: ranked.filter(s => s.badge.label === "Bronz").length,   color: "text-amber-600",  bg: "bg-amber-50"  },
        ].map(t => (
          <Card key={t.label} className={`border shadow-none ${t.bg}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <Award className={`h-8 w-8 ${t.color}`} />
              <div>
                <p className={`text-2xl font-bold ${t.color}`}>{t.count}</p>
                <p className="text-xs text-muted-foreground">{t.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {ranked.map((seller, i) => {
          const metrics = [
            { label: "Müşteri Puanı",   val: Math.round((seller.rating / 5) * 30),   max: 30, icon: <Star className="h-3 w-3 text-yellow-500" /> },
            { label: "Satış Hacmi",      val: Math.min(Math.round((seller.sales / 500) * 25), 25), max: 25, icon: <Package className="h-3 w-3 text-blue-500" /> },
            { label: "Ciro Perf.",       val: Math.min(Math.round((seller.totalRevenue / 150000) * 25), 25), max: 25, icon: <Truck className="h-3 w-3 text-green-500" /> },
            { label: "Doğrulama",        val: seller.verified ? 20 : 0,              max: 20, icon: <ShieldCheck className="h-3 w-3 text-purple-500" /> },
          ];
          return (
            <Card key={seller.id} className="border border-border shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">{seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{seller.name}</p>
                      {seller.verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{seller.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-bold ${seller.score >= 85 ? "text-purple-600" : seller.score >= 65 ? "text-yellow-600" : seller.score >= 45 ? "text-gray-600" : "text-amber-600"}`}>
                      {seller.score}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${seller.badge.color}`}>{seller.badge.label}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {metrics.map(m => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{m.icon}{m.label}</div>
                        <span className="text-xs font-semibold">{m.val}/{m.max}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${(m.val / m.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                  <span><Star className="h-3 w-3 inline mr-0.5 text-yellow-500" />{seller.rating.toFixed(1)} puan</span>
                  <span>{seller.sales} satış</span>
                  <span>{(seller.totalRevenue / 1000).toFixed(1)}k π ciro</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
