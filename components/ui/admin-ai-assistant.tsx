"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, Sparkles, TrendingUp, ShoppingBag, Users, Store, RefreshCw, Zap } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; time: string; }

const SUGGESTIONS = [
  "Bu haftaki en çok satan ürün hangisi?",
  "Hangi satıcı en yüksek iade oranına sahip?",
  "Bu ay kaç yeni üye katıldı?",
  "Toplam bekleyen ödeme tutarı nedir?",
  "En düşük stoklu ürünler hangileri?",
  "VIP üye sayısı kaç?",
];

function getBotResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("en çok satan") || lower.includes("populer") || lower.includes("popüler"))
    return "Bu hafta en çok satan ürün **Kablosuz Fare** (203 satış). Bunu **Spor Koşu Ayakkabısı** (91 satış) ve **Yoga Matı Premium** (156 satış) takip ediyor. Toplam haftalık satış adedi 494 adet.";
  if (lower.includes("iade") || lower.includes("return"))
    return "Şu anda 4 açık iade talebi var. **Tarık Şahin** (Bluetooth Kulaklık, 1.800π) en yüksek tutarlı talep. Genel iade oranınız **%5.7** — sektör ortalamasının (%7.2) altında, bu iyi bir gösterge!";
  if (lower.includes("yeni üye") || lower.includes("kayıt") || lower.includes("bu ay"))
    return "Bu ay (Mart 2026) toplamda **201 yeni üye** kaydoldu. Bunun **%38'i** mobil uygulama üzerinden geldi. Geçen aya göre **%12 artış** var. En aktif kayıt günü Cuma olarak gözüküyor.";
  if (lower.includes("bekleyen ödeme") || lower.includes("ödeme") || lower.includes("finans"))
    return "Şu an bekleyen satıcı ödemeleri: **TechPlus** 18.240π, **ModaElite** 12.800π, **HomeStyle** 7.300π. Toplam bekleyen ödeme: **38.340π**. Ödeme günü: 10 Mart 2026.";
  if (lower.includes("stok") || lower.includes("tüken"))
    return "Kritik stok uyarısı olan 4 ürün var:\n• **Deri Cüzdan** — Stok: 0 (tükendi)\n• **Yoga Matı Premium** — Stok: 0\n• **Ahşap Masa Lambası** — Stok: 3\n• **Kablosuz Fare** — Stok: 1\nSatıcılarla iletişime geçilmesi önerilir.";
  if (lower.includes("vip") || lower.includes("premium"))
    return "Platformunuzda şu an **3 VIP üye** bulunuyor: Fatma Demir (18.920π harcama), Emre Doğan (31.200π harcama), Ahmet Yılmaz (8.640π harcama). VIP üyeler toplam harcamanın **%42'sini** oluşturuyor.";
  if (lower.includes("satıcı") && (lower.includes("performans") || lower.includes("en iyi")))
    return "Performans skoru sıralamasına göre en iyi 3 satıcı:\n1. **TechPlus** — Skor: 92/100 (Platin)\n2. **ModaElite** — Skor: 78/100 (Altın)\n3. **FitLife** — Skor: 75/100 (Altın)\nOfficePro ise 34/100 ile (Bronz) düşük performans gösteriyor — takip edilmeli.";
  if (lower.includes("gelir") || lower.includes("ciro") || lower.includes("kazanç"))
    return "Bu ay toplam ciro **32.400π** (hedefin %81'i). Geçen aya göre **+21% artış** var. En çok katkı sağlayan kategori **Elektronik** (%28). Haftalık en yüksek gelir **Cumartesi** günleri elde ediliyor.";
  if (lower.includes("kampanya") || lower.includes("kupon"))
    return "Aktif 3 kupon var. En çok kullanılan **HOSGELDIN20** (234 kullanım, limit 500). **KARGO0** kuponu 198/200 kullanıma ulaştı — yakında dolacak. Bu ay kuponlardan toplam **4.680π** indirim uygulandı.";
  if (lower.includes("merhaba") || lower.includes("selam") || lower.includes("nasılsın"))
    return "Merhaba! Ben Ucuzcubakkal yapay zeka asistanınım. Platform verilerinizi analiz edip anlık sorularınıza yanıt verebilirim. Size nasıl yardımcı olabilirim?";
  return `"${q}" hakkında şu an elimde net bir veri yok. Daha spesifik sormayı deneyebilirsiniz — örneğin: satışlar, üyeler, iadeler, stok, ödemeler veya satıcı performansı hakkında sorabilirsiniz.`;
}

export function AdminAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Merhaba! Ben **UCB Asistan**, Ucuzcubakkal yönetim paneli yapay zeka yardımcınızım. Platform verilerinizi analiz ederek sorularınıza anında yanıt verebilirim. Nasıl yardımcı olabilirim?", time: "Şimdi" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (text?: string) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: q, time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) };
    setMessages(p => [...p, userMsg]);
    setLoading(true);
    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: getBotResponse(q), time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) };
      setMessages(p => [...p, botMsg]);
      setLoading(false);
    }, 800);
  };

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className={i > 0 ? "mt-1" : ""}>{line.split(/\*\*(.*?)\*\*/g).map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</p>
    ));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Anlık Yanıt", icon: <Zap className="h-4 w-4 text-yellow-500" />, desc: "< 1 saniye" },
          { label: "Veri Analizi", icon: <TrendingUp className="h-4 w-4 text-blue-500" />, desc: "Gerçek zamanlı" },
          { label: "Türkçe Destek", icon: <Sparkles className="h-4 w-4 text-purple-500" />, desc: "Tam Türkçe" },
          { label: "7/24 Aktif", icon: <RefreshCw className="h-4 w-4 text-green-500" />, desc: "Kesintisiz" },
        ].map(f => (
          <Card key={f.label} className="border border-border shadow-none">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">{f.icon}</div>
              <div><p className="text-sm font-semibold">{f.label}</p><p className="text-xs text-muted-foreground">{f.desc}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="border border-border shadow-none h-[520px] flex flex-col">
            <CardHeader className="px-5 pt-4 pb-3 border-b border-border flex-row items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">UCB Asistan</CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Çevrimiçi</p>
              </div>
            </CardHeader>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "assistant" ? (
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <Avatar className="w-8 h-8 flex-shrink-0 mt-0.5">
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-bold">A</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "assistant" ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                      {renderContent(msg.content)}
                    </div>
                    <span className="text-xs text-muted-foreground px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-border flex-shrink-0">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <Input className="flex-1 h-10 text-sm" placeholder="Bir soru sorun..." value={input} onChange={e => setInput(e.target.value)} disabled={loading} />
                <Button type="submit" size="icon" className="h-10 w-10 flex-shrink-0" disabled={!input.trim() || loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border border-border shadow-none">
            <CardHeader className="px-5 pt-5 pb-3"><CardTitle className="text-sm font-semibold">Hızlı Sorular</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} className="w-full text-left px-3 py-2.5 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors text-xs text-muted-foreground hover:text-foreground">
                  {s}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border shadow-none bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-primary">Günün Tavsiyesi</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stokları tükenen 2 ürün için satıcılara otomatik bildirim gönderin. Bu hafta kargo süresi uzayan siparişler için müşterilere proaktif mesaj iletilmesi memnuniyeti artırabilir.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
