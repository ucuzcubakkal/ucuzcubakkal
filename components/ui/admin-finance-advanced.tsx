"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { Target, TrendingUp, TrendingDown, CheckCircle2, Clock, Wallet, ArrowUpRight, Hash, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PI_TRANSACTIONS = [
  { id: "TX001", seller: "TechPlus",    amount: 12400, hash: "Pi7a3b...f12e", date: "2026-03-09", status: "onaylandi" },
  { id: "TX002", seller: "ModaElite",   amount: 8900,  hash: "Pi2c8d...a44f", date: "2026-03-08", status: "onaylandi" },
  { id: "TX003", seller: "AhsapSanat",  amount: 4200,  hash: "Pi9e1f...b77c", date: "2026-03-07", status: "bekliyor"  },
  { id: "TX004", seller: "SportZone",   amount: 6700,  hash: "Pi3d5a...c22b", date: "2026-03-06", status: "onaylandi" },
  { id: "TX005", seller: "HomeStyle",   amount: 5100,  hash: "Pi6b2c...d91a", date: "2026-03-05", status: "bekliyor"  },
];

const REVENUE_GOAL_DATA = [
  { ay: "Eki", hedef: 25000, gercek: 18200 },
  { ay: "Kas", hedef: 25000, gercek: 21400 },
  { ay: "Ara", hedef: 30000, gercek: 28900 },
  { ay: "Oca", hedef: 30000, gercek: 24100 },
  { ay: "Sub", hedef: 35000, gercek: 26800 },
  { ay: "Mar", hedef: 35000, gercek: 32400 },
];

const MONTHLY_GOAL = 35000;
const CURRENT_MONTH_REVENUE = 32400;
const GOAL_PERCENT = Math.round((CURRENT_MONTH_REVENUE / MONTHLY_GOAL) * 100);

export function AdminFinanceAdvanced() {
  const { toast } = useToast();
  const [goalInput, setGoalInput] = useState(MONTHLY_GOAL.toString());
  const [txFilter, setTxFilter] = useState<"tumu" | "bekliyor" | "onaylandi">("tumu");

  const filtered = PI_TRANSACTIONS.filter(t => txFilter === "tumu" ? true : t.status === txFilter);

  const handleApproveAll = () => {
    toast({ title: "Bekleyen odemeler onaylandi", description: `${PI_TRANSACTIONS.filter(t => t.status === "bekliyor").length} odeme isleme alindi.`, duration: 3000 });
  };

  return (
    <div className="space-y-5">
      {/* Gelir Hedef */}
      <Card className="border shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Aylik Gelir Hedefi
              </CardTitle>
              <CardDescription className="text-xs">Mart 2026 — {CURRENT_MONTH_REVENUE.toLocaleString("tr-TR")}π / {parseInt(goalInput).toLocaleString("tr-TR")}π</CardDescription>
            </div>
            <Badge className={GOAL_PERCENT >= 80 ? "bg-green-100 text-green-700" : GOAL_PERCENT >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}>
              %{GOAL_PERCENT}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={GOAL_PERCENT} className="h-3" />
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              className="h-8 text-sm w-36"
              placeholder="Hedef π"
            />
            <Button size="sm" className="h-8 text-xs" onClick={() => toast({ title: "Hedef guncellendi", duration: 2000 })}>
              Hedef Guncelle
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={REVENUE_GOAL_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ay" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Line type="monotone" dataKey="hedef" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Hedef" />
              <Line type="monotone" dataKey="gercek" stroke="#f27a1a" strokeWidth={2.5} dot={{ r: 3 }} name="Gercek" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pi Odeme Gecmisi */}
      <Card className="border shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" /> Pi Blockchain Odeme Gecmisi
              </CardTitle>
              <CardDescription className="text-xs">Her islemin hash kaydi ile dogrulanabilir</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border border-border rounded-lg overflow-hidden text-xs">
                {(["tumu", "bekliyor", "onaylandi"] as const).map(f => (
                  <button key={f} onClick={() => setTxFilter(f)}
                    className={`px-3 py-1.5 capitalize transition-colors ${txFilter === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                    {f === "tumu" ? "Tumu" : f === "bekliyor" ? "Bekliyor" : "Onaylandi"}
                  </button>
                ))}
              </div>
              {txFilter === "bekliyor" && (
                <Button size="sm" className="h-7 text-xs" onClick={handleApproveAll}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Tumunu Onayla
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.status === "onaylandi" ? "bg-green-500" : "bg-amber-400 animate-pulse"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{tx.seller}</p>
                  <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">{tx.amount.toLocaleString("tr-TR")}π</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <Badge className={`text-xs flex-shrink-0 ${tx.status === "onaylandi" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {tx.status === "onaylandi" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                  {tx.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
