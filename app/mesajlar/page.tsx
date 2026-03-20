"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, ArrowLeft, ImageIcon, X, Check, CheckCheck, Archive, Trash2, MoreVertical, BellOff, Bell, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";

// ─── Relative time yardımcısı ─────────────────────────────────────────────────
function relativeTime(isoOrLabel: string): string {
  // Eğer gerçek ISO string değilse (örn. "Dün", "10:30") olduğu gibi döndür
  const date = new Date(isoOrLabel);
  if (isNaN(date.getTime())) return isoOrLabel;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)    return "Az önce";
  if (diffMin < 60)   return `${diffMin} dk önce`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)     return `${diffH} sa önce`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1)    return "Dün";
  if (diffD < 7)      return `${diffD} gün önce`;
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

// ─── Tipler ────────────────────────────────────────────────────────────────────
type OrderCard = {
  orderId: string;
  productName: string;
  total: number;
  status: string;
};

type Message = {
  id: string;
  senderId: string;
  text: string;
  image?: string;       // base64 veya URL
  time: string;         // ISO string veya görüntü etiketi
  read: boolean;
  orderCard?: OrderCard;
};

type Conversation = {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanInitial: string;
  artisanColor: string;
  productName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
  archived?: boolean;
  muted?: boolean;
};

const NOW = new Date();
const ts = (minutesAgo: number) =>
  new Date(NOW.getTime() - minutesAgo * 60000).toISOString();

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    artisanId: "a1",
    artisanName: "Ayşe Hanım Atölyesi",
    artisanInitial: "A",
    artisanColor: "bg-amber-500",
    productName: "El Dokuma Kilim Yastık",
    lastMessage: "Mavi-krem kombinasyonu yapabiliriz",
    lastTime: ts(30),
    unread: 2,
    messages: [
      { id: "m1", senderId: "user", text: "Merhaba, yastığın rengini özelleştirebilir miyim?",    time: ts(90), read: true  },
      { id: "m2", senderId: "a1",   text: "Evet tabii ki! Hangi renkleri tercih edersiniz?",       time: ts(60), read: true  },
      { id: "m3", senderId: "user", text: "Mavi ve krem tonları güzel olur",                       time: ts(45), read: true  },
      { id: "m4", senderId: "a1",   text: "Mavi-krem kombinasyonu yapabiliriz, çok güzel olacak!", time: ts(30), read: false },
    ],
  },
  {
    id: "conv-2",
    artisanId: "a2",
    artisanName: "Çömlek Sanatı",
    artisanInitial: "Ç",
    artisanColor: "bg-rose-500",
    productName: "Seramik Vazo",
    lastMessage: "Sipariş için teşekkürler!",
    lastTime: ts(24 * 60 + 30),
    unread: 0,
    messages: [
      { id: "m5", senderId: "a2",   text: "Siparişinizi aldık, 3 gün içinde kargolayacağız", time: ts(25 * 60), read: true },
      { id: "m6", senderId: "user", text: "Teşekkürler, sabırsızlıkla bekliyorum",           time: ts(24 * 60 + 30), read: true },
      { id: "m7", senderId: "a2",   text: "Sipariş için teşekkürler!",                       time: ts(24 * 60),      read: true },
    ],
  },
  {
    id: "conv-3",
    artisanId: "a3",
    artisanName: "Bakırcı Mehmet Usta",
    artisanInitial: "M",
    artisanColor: "bg-blue-500",
    productName: "Bakır Çarşı Tabağı",
    lastMessage: "Boyutu ne olsun?",
    lastTime: ts(2 * 24 * 60),
    unread: 1,
    messages: [
      { id: "m8",  senderId: "user", text: "Tabağa özel yazı yazdırabilir miyim?",       time: ts(2 * 24 * 60 + 30), read: true  },
      { id: "m9",  senderId: "a3",   text: "Evet, yazı ve desen ekleyebiliriz.",          time: ts(2 * 24 * 60 + 15), read: true  },
      { id: "m10", senderId: "a3",   text: "Boyutu ne olsun?",                            time: ts(2 * 24 * 60),      read: false },
    ],
  },
];

// ─── Sayfa ────────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { isLoggedIn } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConv, setActiveConv]       = useState<Conversation | null>(null);
  const [newMessage, setNewMessage]       = useState("");
  const [search, setSearch]               = useState("");
  const [pendingImage, setPendingImage]   = useState<string | null>(null);
  const [isTyping, setIsTyping]           = useState(false);
  const [showArchived, setShowArchived]   = useState(false);
  const [convMenu, setConvMenu]           = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef  = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length, isTyping]);

  // Mesaj gönderince karşı taraf "yazıyor..." simülasyonu
  const simulateTyping = useCallback(() => {
    setIsTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setIsTyping(false), 2800);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h2 className="text-2xl font-serif font-bold mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-muted-foreground mb-6">Mesajlarınızı görmek için lütfen giriş yapın.</p>
          <Link href="/giris"><Button>Giriş Yap</Button></Link>
        </div>
      </div>
    );
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    // input'u sıfırla (aynı dosyayı tekrar seçebilmek için)
    e.target.value = "";
  };

  const sendMessage = () => {
    if ((!newMessage.trim() && !pendingImage) || !activeConv) return;
    const msg: Message = {
      id: String(Date.now()),
      senderId: "user",
      text: newMessage.trim(),
      image: pendingImage ?? undefined,
      time: new Date().toISOString(),
      read: false,
    };
    const updatedMsgs = [...activeConv.messages, msg];
    const preview = pendingImage ? "Fotoğraf gönderildi" : msg.text;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? { ...c, messages: updatedMsgs, lastMessage: preview, lastTime: msg.time }
          : c
      )
    );
    setActiveConv({ ...activeConv, messages: updatedMsgs });
    setNewMessage("");
    setPendingImage(null);
    simulateTyping();
  };

  const openConversation = (conv: Conversation) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
    );
    setActiveConv({ ...conv, unread: 0 });
  };

  const handleMuteConv = (id: string) => {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, muted: !c.muted } : c));
    if (activeConv?.id === id) setActiveConv((prev) => prev ? { ...prev, muted: !prev.muted } : prev);
    setConvMenu(null);
  };

  const sendOrderCard = () => {
    if (!activeConv) return;
    const orderMsg: Message = {
      id: String(Date.now()),
      senderId: "user",
      text: "",
      time: new Date().toISOString(),
      read: false,
      orderCard: {
        orderId: "ORD-001",
        productName: activeConv.productName,
        total: 250,
        status: "Kargoda",
      },
    };
    const updatedMsgs = [...activeConv.messages, orderMsg];
    setConversations((prev) => prev.map((c) => c.id === activeConv.id
      ? { ...c, messages: updatedMsgs, lastMessage: `Sipariş: ${activeConv.productName}`, lastTime: orderMsg.time }
      : c
    ));
    setActiveConv({ ...activeConv, messages: updatedMsgs });
    simulateTyping();
  };

  const handleArchiveConv = (id: string) => {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, archived: !c.archived } : c));
    if (activeConv?.id === id) setActiveConv(null);
    setConvMenu(null);
  };

  const handleDeleteConv = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConv?.id === id) setActiveConv(null);
    setConvMenu(null);
  };

  const filtered = conversations.filter(
    (c) =>
      (showArchived ? c.archived : !c.archived) &&
      (c.artisanName.toLowerCase().includes(search.toLowerCase()) ||
      c.productName.toLowerCase().includes(search.toLowerCase()))
  );

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 container mx-auto max-w-4xl overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>

        {/* Konuşma Listesi */}
        <div className={`border-r border-border flex flex-col bg-card ${activeConv ? "hidden md:flex w-80" : "flex w-full md:w-80"}`}>
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">
                Mesajlarım
                {totalUnread > 0 && <Badge className="ml-2 h-5 px-1.5 text-xs">{totalUnread}</Badge>}
              </h2>
              <button
                onClick={() => setShowArchived((v) => !v)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${showArchived ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Archive className="h-3 w-3" />
                {showArchived ? "Aktif" : "Arşiv"}
                {!showArchived && conversations.filter((c) => c.archived).length > 0 && (
                  <span className="bg-muted-foreground/20 rounded-full px-1 text-[10px]">{conversations.filter((c) => c.archived).length}</span>
                )}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Konuşma ara..." className="pl-8 h-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Konuşma bulunamadı</div>
            ) : (
              filtered.map((conv) => (
                <div
                  key={conv.id}
                  className={`relative flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${activeConv?.id === conv.id ? "bg-accent" : ""}`}
                  onClick={() => { openConversation(conv); setConvMenu(null); }}
                >
                  <Avatar className="h-11 w-11 flex-shrink-0">
                    <AvatarFallback className={`${conv.artisanColor} text-white font-bold`}>{conv.artisanInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-sm truncate">{conv.artisanName}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{relativeTime(conv.lastTime)}</span>
                    </div>
                    <p className="text-xs text-primary/70 truncate mb-0.5">{conv.productName}</p>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {conv.muted && <BellOff className="h-3 w-3 text-muted-foreground" />}
                    {conv.unread > 0 && !conv.muted && (
                      <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">{conv.unread}</Badge>
                    )}
                  </div>
                  {/* 3-nokta menü */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setConvMenu(convMenu === conv.id ? null : conv.id); }}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {convMenu === conv.id && (
                      <div className="absolute right-0 top-7 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[130px]" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => handleArchiveConv(conv.id)}
                        >
                          <Archive className="h-3.5 w-3.5" />
                          {conv.archived ? "Arşivden Çıkar" : "Arşivle"}
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => handleMuteConv(conv.id)}
                        >
                          {conv.muted ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                          {conv.muted ? "Sesi Aç" : "Sessize Al"}
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={() => handleDeleteConv(conv.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Sil
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mesaj Alanı */}
        {activeConv ? (
          <div className="flex-1 flex flex-col">
            {/* Başlık */}
            <div className="p-3 border-b border-border bg-card flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setActiveConv(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className={`${activeConv.artisanColor} text-white font-bold text-sm`}>{activeConv.artisanInitial}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{activeConv.artisanName}</p>
                <p className="text-xs text-muted-foreground">{activeConv.productName}</p>
              </div>
            </div>

            {/* Mesajlar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv.messages.map((msg) => {
                const isUser = msg.senderId === "user";
                return (
                  <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl overflow-hidden ${isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                      {/* Sipariş Kartı */}
                      {msg.orderCard && (
                        <div className={`px-3 pt-3 pb-2 min-w-[180px] ${isUser ? "" : ""}`}>
                          <div className={`rounded-lg border p-2.5 text-xs space-y-1 ${isUser ? "border-primary-foreground/20 bg-primary-foreground/10" : "border-border bg-background"}`}>
                            <div className="flex items-center gap-1.5 font-semibold">
                              <Package className="h-3.5 w-3.5" />
                              Sipariş #{msg.orderCard.orderId}
                            </div>
                            <p className="truncate text-[11px] opacity-80">{msg.orderCard.productName}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">{msg.orderCard.total}π</span>
                              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${isUser ? "bg-primary-foreground/20" : "bg-muted"}`}>{msg.orderCard.status}</span>
                            </div>
                          </div>
                          <p className={`text-xs mt-1 ${isUser ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`}>
                            {relativeTime(msg.time)}
                          </p>
                        </div>
                      )}
                      {/* Görsel */}
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Paylaşılan görsel"
                          className="w-full max-h-48 object-cover"
                        />
                      )}
                        {/* Metin */}
                      {(msg.text || !msg.image) && (
                        <div className="px-4 py-2.5">
                          {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                          <div className={`flex items-center gap-1 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
                            <p className={`text-xs ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                              {relativeTime(msg.time)}
                            </p>
                            {isUser && (
                              msg.read
                                ? <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                                : <Check className="h-3 w-3 text-primary-foreground/40" />
                            )}
                          </div>
                        </div>
                      )}
                      {/* Sadece görsel, zaman damgası dışarıda */}
                      {msg.image && !msg.text && (
                        <div className="px-3 pb-2">
                          <p className={`text-xs ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {relativeTime(msg.time)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Yazıyor animasyonu */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-1">{activeConv.artisanName.split(" ")[0]} yazıyor</span>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bekleyen görsel önizlemesi */}
            {pendingImage && (
              <div className="px-4 pb-2 flex items-center gap-2">
                <div className="relative">
                  <img src={pendingImage} alt="Gönderilecek görsel" className="h-14 w-14 rounded-lg object-cover border border-border" />
                  <button
                    onClick={() => setPendingImage(null)}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">Görsel eklenecek</span>
              </div>
            )}

            {/* Hızlı Yanıt Şablonları */}
            <div className="px-4 pt-2 pb-1 flex gap-1.5 overflow-x-auto scrollbar-none border-t border-border">
              {[
                "Evet yapabiliriz",
                "3-5 iş günü içinde kargo",
                "Fiyat teklifi göndereyim",
                "Teşekkürler!",
                "Stok mevcut",
                "Özelleştirme yapılabilir",
              ].map((template) => (
                <button
                  key={template}
                  onClick={() => setNewMessage(template)}
                  className="flex-shrink-0 text-xs border border-border rounded-full px-3 py-1 bg-muted/50 hover:bg-accent hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {template}
                </button>
              ))}
            </div>

            {/* Mesaj Gönder */}
            <div className="p-4 pt-2 border-border bg-card">
              <div className="flex gap-2">
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="flex-shrink-0 text-muted-foreground hover:text-primary"
                  onClick={sendOrderCard}
                  title="Sipariş kartı paylaş"
                >
                  <Package className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="flex-shrink-0 text-muted-foreground hover:text-primary"
                  onClick={() => imageInputRef.current?.click()}
                  title="Fotoğraf gönder"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Mesaj yazın..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && !pendingImage}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">Bir konuşma seçin</p>
              <p className="text-sm text-muted-foreground">Satıcılarınızla iletişime geçin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
