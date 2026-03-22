"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Zap, Plus, Trash2, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface PricingRule {
  id: string; name: string; trigger: string; triggerValue: string;
  action: "discount" | "increase"; actionValue: number; active: boolean;
  appliesTo: string;
}

const INIT_RULES: PricingRule[] = [
  { id: "R1", name: "Dusuk Stok Zammi",    trigger: "stock_below",   triggerValue: "5",  action: "increase", actionValue: 15, active: true,  appliesTo: "Tum Kategoriler" },
  { id: "R2", name: "Hafta Sonu Indirimi", trigger: "day_of_week",   triggerValue: "6,0",action: "discount", actionValue: 10, active: true,  appliesTo: "Ev Dekoru"       },
  { id: "R3", name: "Gece Kampanyasi",     trigger: "hour_range",    triggerValue: "23-6",action: "discount",actionValue: 5,  active: false, appliesTo: "Tum Kategoriler" },
  { id: "R4", name: "Cok Satis Bonusu",   trigger: "sales_above",   triggerValue: "100", action: "discount",actionValue: 8,  active: true,  appliesTo: "El Sanatlari"    },
];

const TRIGGER_LABELS: Record<string, string> = {
  stock_below:  "Stok X'in altina dusunce",
  day_of_week:  "Belirli gunlerde",
  hour_range:   "Belirli saatlerde",
  sales_above:  "Satis X'i gecince",
};

export function AdminPricingRules() {
  const { toast } = useToast();
  const [rules,    setRules]    = useState<PricingRule[]>(INIT_RULES);
  const [adding,   setAdding]   = useState(false);
  const [newRule,  setNewRule]  = useState<Partial<PricingRule>>({ trigger: "stock_below", action: "discount", actionValue: 10, appliesTo: "Tum Kategoriler" });

  const toggleActive = (id: string) =>
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast({ title: "Kural silindi." });
  };

  const saveNew = () => {
    if (!newRule.name || !newRule.triggerValue) return;
    setRules(prev => [...prev, { ...newRule, id: `R${Date.now()}`, active: true } as PricingRule]);
    setAdding(false);
    setNewRule({ trigger: "stock_below", action: "discount", actionValue: 10, appliesTo: "Tum Kategoriler" });
    toast({ title: "Yeni fiyat kurali eklendi." });
  };

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />Dinamik Fiyat Kurallari
            </CardTitle>
            <CardDescription className="text-xs">Kosullara bagli otomatik fiyat degisim kurallari</CardDescription>
          </div>
          <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setAdding(a => !a)}>
            <Plus className="h-3.5 w-3.5" />Kural Ekle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Yeni kural formu */}
        {adding && (
          <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-primary">Yeni Kural</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Kural Adi</Label>
                <Input className="h-8 text-sm" placeholder="Adi..." value={newRule.name ?? ""} onChange={e => setNewRule(n => ({ ...n, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Uygulanacak Kategori</Label>
                <Select value={newRule.appliesTo} onValueChange={v => setNewRule(n => ({ ...n, appliesTo: v }))}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Tum Kategoriler","Ev Dekoru","El Sanatlari","Takilar","Hediyelik","Giyim"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tetikleyici</Label>
                <Select value={newRule.trigger} onValueChange={v => setNewRule(n => ({ ...n, trigger: v }))}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRIGGER_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Esik Degeri</Label>
                <Input className="h-8 text-sm" placeholder="Ornegin: 5" value={newRule.triggerValue ?? ""} onChange={e => setNewRule(n => ({ ...n, triggerValue: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Islem</Label>
                <Select value={newRule.action} onValueChange={v => setNewRule(n => ({ ...n, action: v as any }))}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Fiyat Indir (%)</SelectItem>
                    <SelectItem value="increase">Fiyat Artir (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Oran (%)</Label>
                <Input type="number" className="h-8 text-sm" value={newRule.actionValue ?? 10} onChange={e => setNewRule(n => ({ ...n, actionValue: +e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setAdding(false)}>Iptal</Button>
              <Button size="sm" className="text-xs h-8" onClick={saveNew}>Kaydet</Button>
            </div>
          </div>
        )}

        {/* Kural listesi */}
        {rules.map(r => (
          <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${r.active ? "border-border" : "border-dashed border-muted-foreground/30 opacity-60"}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.action === "discount" ? "bg-green-100" : "bg-amber-100"}`}>
              {r.action === "discount" ? <TrendingDown className="h-4 w-4 text-green-600" /> : <TrendingUp className="h-4 w-4 text-amber-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-muted-foreground">
                {TRIGGER_LABELS[r.trigger]} ({r.triggerValue}) —
                <span className={r.action === "discount" ? " text-green-600" : " text-amber-600"}>
                  {r.action === "discount" ? " %" : " +%"}{r.actionValue}
                </span>
                <span className="ml-1">· {r.appliesTo}</span>
              </p>
            </div>
            <Switch checked={r.active} onCheckedChange={() => toggleActive(r.id)} />
            <button onClick={() => deleteRule(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
