"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payment { id: string; seller: string; amount: string; day: number; status: "bekliyor" | "odendi" | "gecikti"; }

const MARCH_PAYMENTS: Payment[] = [
  { id: "P1", seller: "Ahmet Usta",      amount: "340 π", day: 5,  status: "odendi"   },
  { id: "P2", seller: "Elif Tekstil",    amount: "820 π", day: 5,  status: "odendi"   },
  { id: "P3", seller: "Karadeniz Bali",  amount: "195 π", day: 10, status: "gecikti"  },
  { id: "P4", seller: "Anatolian Art",   amount: "560 π", day: 15, status: "odendi"   },
  { id: "P5", seller: "Handmade by Sev", amount: "430 π", day: 15, status: "bekliyor" },
  { id: "P6", seller: "Zeynep Ceramics", amount: "280 π", day: 20, status: "bekliyor" },
  { id: "P7", seller: "OrtaAsya Halı",   amount: "710 π", day: 20, status: "bekliyor" },
  { id: "P8", seller: "Ege Olive",       amount: "390 π", day: 25, status: "bekliyor" },
  { id: "P9", seller: "Ahmet Usta",      amount: "220 π", day: 25, status: "bekliyor" },
];

const DAYS_IN_MARCH = 31;
const FIRST_DAY_MARCH = 6; // Pazar = 0, ..., Cumartesi = 6

export function AdminPaymentCalendar() {
  const [selected, setSelected] = useState<number | null>(null);
  const { toast } = useToast();

  const paymentsOnDay = (day: number) => MARCH_PAYMENTS.filter(p => p.day === day);

  const statusColor = (s: Payment["status"]) =>
    s === "odendi" ? "bg-green-500" : s === "gecikti" ? "bg-red-500 animate-pulse" : "bg-amber-400";

  const selectedPayments = selected ? paymentsOnDay(selected) : [];

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Satici Odeme Takvimi
            </CardTitle>
            <CardDescription className="text-xs">Mart 2026 — vadesi gecmis odemeler kirmizi ile isaretlidir</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" className="h-7 w-7"><ChevronLeft className="h-3.5 w-3.5"/></Button>
            <span className="text-xs font-semibold px-2">Mart 2026</span>
            <Button size="icon" variant="outline" className="h-7 w-7"><ChevronRight className="h-3.5 w-3.5"/></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Takvim grid */}
        <div>
          <div className="grid grid-cols-7 mb-1">
            {["Pzt","Sal","Car","Per","Cum","Cmt","Paz"].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: FIRST_DAY_MARCH }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: DAYS_IN_MARCH }).map((_, i) => {
              const day = i + 1;
              const dayPayments = paymentsOnDay(day);
              const hasOverdue  = dayPayments.some(p => p.status === "gecikti");
              const hasPending  = dayPayments.some(p => p.status === "bekliyor");
              const isToday     = day === 19;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(selected === day ? null : day)}
                  className={`relative aspect-square rounded-lg flex flex-col items-center justify-start p-1 text-xs transition-all hover:bg-muted
                    ${selected === day ? "ring-2 ring-primary bg-primary/5" : ""}
                    ${isToday ? "bg-primary text-primary-foreground font-bold hover:bg-primary/90" : ""}
                    ${hasOverdue ? "border border-red-300 dark:border-red-800" : ""}
                  `}
                >
                  <span>{day}</span>
                  {dayPayments.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayPayments.slice(0, 3).map(p => (
                        <span key={p.id} className={`w-1.5 h-1.5 rounded-full ${statusColor(p.status)}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Efsane */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/> Odendi</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/> Bekliyor</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/> Gecikti</span>
        </div>

        {/* Secilen gundeki odemeler */}
        {selected && selectedPayments.length > 0 && (
          <div className="border border-border rounded-xl divide-y divide-border">
            {selectedPayments.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2.5">
                {p.status === "odendi"  && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0"/>}
                {p.status === "bekliyor"&& <Clock        className="h-4 w-4 text-amber-500 flex-shrink-0"/>}
                {p.status === "gecikti" && <AlertCircle  className="h-4 w-4 text-red-500   flex-shrink-0"/>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.seller}</p>
                  <p className="text-xs text-muted-foreground">Mart {p.day}</p>
                </div>
                <p className="text-sm font-bold text-primary">{p.amount}</p>
                {p.status !== "odendi" && (
                  <Button size="sm" className="h-7 text-xs" onClick={() => toast({ title: `${p.seller} odemesi onaylandi`, duration: 2000 })}>
                    Onayla
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        {selected && selectedPayments.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">Bu gun planlanan odeme yok.</p>
        )}
      </CardContent>
    </Card>
  );
}
