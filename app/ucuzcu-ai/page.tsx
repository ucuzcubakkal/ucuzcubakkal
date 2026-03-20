"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, RotateCcw, ShoppingBag, Tag, TrendingUp, Gem, HandMetal } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: { name: string; price: string; badge?: string }[];
};

const SUGGESTIONS = [
  { icon: HandMetal, label: "El yapımı hediye öner",       query: "El yapımı, 50π altında hediye öner" },
  { icon: Tag,       label: "Bütçeme göre seçenekler",    query: "100π bütçemle ne alabilirim?" },
  { icon: TrendingUp,label: "Bu hafta trend ürünler",     query: "Bu hafta en çok satan ürünler neler?" },
  { icon: Gem,       label: "Özel tasarım takı ara",       query: "El yapımı gümüş takı önerileri" },
];

const BOT_RESPONSES: Record<string, Message["products"]> = {
  default: [
    { name: "El Yapımı Seramik Kupa Seti", price: "25π", badge: "Handmade" },
    { name: "Doğal Zeytinyağı Sabunu (3'lü)", price: "18π", badge: "Organik" },
    { name: "Makramé Duvar Süsü",           price: "45π", badge: "El İşi" },
  ],
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export default function UcuzcuAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      text: "Merhaba! Ben Ucuzcu AI. Sana en uygun ürünleri Pi ile bulmana yardımcı olabilirim. Ne arıyorsun?",
    },
  ]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();
      let reply = "Harika bir seçim! İşte sana özel önerilerim:";
      if (lower.includes("hediye")) reply = "Hediye için en popüler el yapımı ürünlerimden seçtim:";
      if (lower.includes("bütçe") || lower.includes("π")) reply = "Bütçene en uygun ürünler bunlar:";
      if (lower.includes("trend") || lower.includes("satan")) reply = "Bu hafta en çok ilgi gören ürünler:";
      if (lower.includes("takı") || lower.includes("gümüş")) reply = "El yapımı takı koleksiyonumdan öneriler:";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: reply,
        products: BOT_RESPONSES.default,
      };
      setMessages((p) => [...p, aiMsg]);
    }, 1400);
  };

  const reset = () => {
    setMessages([
      {
        id: "0",
        role: "assistant",
        text: "Merhaba! Ben Ucuzcu AI. Sana en uygun ürünleri Pi ile bulmana yardımcı olabilirim. Ne arıyorsun?",
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header showBack={false} />

      {/* Sayfa baslik */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold">Ucuzcu AI</p>
            <p className="text-[11px] text-green-600 font-medium flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Çevrimiçi
            </p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={reset} title="Sohbeti sıfırla">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Mesaj akışı */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-primary"
                  : "bg-muted border border-border"
              }`}
            >
              {msg.role === "assistant" ? (
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              ) : (
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>

            <div className={`space-y-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              {/* Baloncuk */}
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card border border-border rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>

              {/* Ürün önerileri */}
              {msg.products && (
                <div className="space-y-2 w-full">
                  {msg.products.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/40 transition-colors cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-primary">{p.price}</span>
                          {p.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded font-semibold">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs flex-shrink-0">
                        Gör
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Yazıyor animasyonu */}
        {typing && (
          <div className="flex gap-2.5">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Hızlı öneri butonları */}
      {messages.length <= 2 && !typing && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Hızlı başlangıç:</p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.query)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card text-left text-xs font-medium hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95"
                >
                  <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mesaj giriş alanı */}
      <div className="px-4 pb-4 bg-background border-t border-border pt-3">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <Input
            className="flex-1 h-11 bg-muted border-muted text-sm rounded-xl"
            placeholder="Ürün sor veya bütçeni yaz..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 rounded-xl flex-shrink-0"
            disabled={!input.trim() || typing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Ucuzcu AI · Pi Network ekosistemi için optimize edildi
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
