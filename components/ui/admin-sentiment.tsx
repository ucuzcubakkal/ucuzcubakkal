"use client";


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, TrendingUp, TrendingDown, Minus, Star } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const SENTIMENT_DATA = [
  { name: "Olumlu", value: 68, color: "#22c55e" },
  { name: "Notr",   value: 22, color: "#94a3b8" },
  { name: "Olumsuz",value: 10, color: "#ef4444" },
];

const KEYWORDS_POS = ["kaliteli", "hizli teslimat", "el yapimi", "ozgun", "guzel ambalaj", "tavsiye ederim", "cok begendim", "tesekkurler"];
const KEYWORDS_NEG = ["gec kargo", "beklentimi karsilamadi", "iade ettim", "hasarli geldi", "fiyati yuksek"];

const RECENT = [
  { text: "Urun tam bekledigim gibi, hatta daha da guzeldi. El yapimi dokuma calisma muhtesem.",  sentiment: "positive", rating: 5, date: "2 sa" },
  { text: "Kargo birazcık geç geldi ama ürün kalitesi gerçekten cok iyi. Tekrar alacağım.",       sentiment: "neutral",  rating: 4, date: "4 sa" },
  { text: "Hasarli geldi, saticias cok ilgilendi ve hemen yeni gonderdı. Tesekkurler.",            sentiment: "positive", rating: 5, date: "5 sa" },
  { text: "Fiyata gore biraz kucuk geldi ama kalitesi guzel.",                                    sentiment: "neutral",  rating: 3, date: "6 sa" },
  { text: "Fotograftakinden farkli cikti, iade etmek zorunda kaldim.",                            sentiment: "negative", rating: 2, date: "8 sa" },
];

export function AdminSentimentAnalysis() {
  const total = RECENT.length;
  const pos = RECENT.filter(r => r.sentiment === "positive").length;
  const neg = RECENT.filter(r => r.sentiment === "negative").length;

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />Yorum Duygu Analizi
        </CardTitle>
        <CardDescription className="text-xs">NLP tabanli yorum siniflandirma ve ozet</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ozet">
          <TabsList className="mb-4 h-8">
            <TabsTrigger value="ozet"   className="text-xs h-7">Ozet</TabsTrigger>
            <TabsTrigger value="anahtar" className="text-xs h-7">Anahtar Kelimeler</TabsTrigger>
            <TabsTrigger value="son"    className="text-xs h-7">Son Yorumlar</TabsTrigger>
          </TabsList>

          <TabsContent value="ozet" className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="h-36 w-36 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SENTIMENT_DATA} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={3}>
                      {SENTIMENT_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`%${v}`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {SENTIMENT_DATA.map(d => (
                  <div key={d.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-bold">%{d.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${d.value}%`, background: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-600">%{Math.round((pos/total)*100)}</p>
                <p className="text-xs text-muted-foreground">Olumlu</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <Minus className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold">%{Math.round(((total-pos-neg)/total)*100)}</p>
                <p className="text-xs text-muted-foreground">Notr</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                <TrendingDown className="h-4 w-4 text-red-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-500">%{Math.round((neg/total)*100)}</p>
                <p className="text-xs text-muted-foreground">Olumsuz</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="anahtar" className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-green-600 mb-2">Sik Olumlu Kelimeler</p>
              <div className="flex flex-wrap gap-1.5">
                {KEYWORDS_POS.map(k => <Badge key={k} className="bg-green-100 text-green-700 text-xs">{k}</Badge>)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 mb-2">Sik Olumsuz Kelimeler</p>
              <div className="flex flex-wrap gap-1.5">
                {KEYWORDS_NEG.map(k => <Badge key={k} className="bg-red-100 text-red-700 text-xs">{k}</Badge>)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="son" className="space-y-2">
            {RECENT.map((r, i) => (
              <div key={i} className={`p-3 rounded-xl border text-sm ${
                r.sentiment === "positive" ? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                : r.sentiment === "negative" ? "border-red-200 bg-red-50/50 dark:bg-red-900/10"
                : "border-border bg-muted/20"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3 w-3 ${j < r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">{r.date} once</span>
                </div>
                <p className="text-xs leading-relaxed">{r.text}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
