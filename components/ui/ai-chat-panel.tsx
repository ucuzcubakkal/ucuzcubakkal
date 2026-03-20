"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiChatPanelProps {
  /** API endpoint: "/api/musteri-ai" veya "/api/satici-ai" */
  apiEndpoint: string;
  /** Kullanıcı/satıcı adı — selamlama için */
  userName?: string;
  /** "male" | "female" — hitap için */
  userGender?: "male" | "female";
  /** Hızlı soru önerileri */
  quickQuestions?: string[];
  /** Panel başlığı */
  title?: string;
  /** Alt başlık */
  subtitle?: string;
}

function getMessageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function AiChatPanel({
  apiEndpoint,
  userName,
  userGender,
  quickQuestions = [],
  title = "AI Asistan",
  subtitle = "Size nasıl yardımcı olabilirim?",
}: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: apiEndpoint }),
  });

  const handleSendWithMeta = (text: string) => {
    sendMessage(
      { text },
      {
        body: {
          userName,
          userGender,
          sellerName: userName,
          sellerGender: userGender,
        },
      }
    );
  };

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    handleSendWithMeta(text);
  };

  const handleQuick = (q: string) => {
    if (isLoading) return;
    handleSendWithMeta(q);
  };

  const salutation = userName
    ? `${userName} ${userGender === "female" ? "Hanımefendi" : "Bey"}`
    : "Değerli Üyemiz";

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs gap-1 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            Çevrimiçi
          </Badge>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setMessages([])}
              title="Sohbeti temizle"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Mesaj alanı */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Merhaba, {salutation}!</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Merak ettiğiniz her konuda size yardımcı olmaktan mutluluk duyarım.
              </p>
            </div>
            {/* Hızlı sorular */}
            {quickQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuick(q)}
                    className="text-xs bg-muted hover:bg-primary/10 hover:text-primary border border-border rounded-full px-3 py-1.5 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => {
            const text = getMessageText(msg.parts as { type: string; text?: string }[]);
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
              >
                <Avatar className="h-7 w-7 flex-shrink-0 mt-0.5">
                  <AvatarFallback className={cn("text-xs font-bold", isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap break-words",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  )}
                >
                  {text}
                </div>
              </div>
            );
          })
        )}
        {isLoading && (
          <div className="flex gap-2.5">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                <Bot className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input alanı */}
      <div className="pt-3 border-t border-border mt-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Mesajınızı yazın..."
            className="flex-1 h-10 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          AI yanıtları bilgilendirme amaçlıdır. Kritik konularda destek ekibimizle iletişime geçin.
        </p>
      </div>
    </div>
  );
}
