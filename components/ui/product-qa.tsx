"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ChevronDown, ChevronUp, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface QAItem {
  id: string;
  question: string;
  askedBy: string;
  askedAt: string;
  answer?: string;
  answeredAt?: string;
  isOfficial?: boolean;
}

interface ProductQAProps {
  sellerName: string;
  sellerId?: string;
  initialQA?: QAItem[];
}

const DEFAULT_QA: QAItem[] = [
  {
    id: "1",
    question: "Bu ürünün yıkama talimatları nelerdir?",
    askedBy: "Mehmet K.",
    askedAt: "2 Mart 2026",
    answer: "30 derece yıkama programında yıkayabilirsiniz. Makine kurutma önerilmez, serin bir ortamda doğal kurutun.",
    answeredAt: "2 Mart 2026",
    isOfficial: true,
  },
  {
    id: "2",
    question: "Farklı renk seçenekleri var mı?",
    askedBy: "Ayşe Y.",
    askedAt: "28 Şubat 2026",
    answer: "Evet! Mavi, kırmızı ve doğal krem tonlarında üretebilirim. Sipariş notuna istediğiniz rengi yazmanız yeterli.",
    answeredAt: "28 Şubat 2026",
    isOfficial: true,
  },
  {
    id: "3",
    question: "Hediye paketi yapılıyor mu?",
    askedBy: "Zeynep A.",
    askedAt: "25 Şubat 2026",
    answer: undefined,
  },
];

export function ProductQA({ sellerName, initialQA = DEFAULT_QA }: ProductQAProps) {
  const { toast } = useToast();
  const [qas, setQas] = useState<QAItem[]>(initialQA);
  const [expanded, setExpanded] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const visibleQAs = expanded ? qas : qas.slice(0, 2);

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const newItem: QAItem = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      askedBy: "Siz",
      askedAt: "Simdi",
    };
    setQas(prev => [newItem, ...prev]);
    setNewQuestion("");
    setSubmitting(false);
    toast({ title: "Sorunuz iletildi", description: `${sellerName} en kısa sürede yanıt verecek.` });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Soru & Cevap</h3>
        <Badge variant="secondary" className="text-xs">{qas.length}</Badge>
      </div>

      {/* Yeni soru formu */}
      <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Satıcıya soru sor</p>
        <Textarea
          placeholder="Ürün hakkında merak ettiğiniz bir şey var mı?"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="text-sm resize-none h-20 bg-background"
          maxLength={300}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{newQuestion.length}/300</span>
          <Button
            size="sm"
            className="h-7 text-xs gap-1.5"
            disabled={!newQuestion.trim() || submitting}
            onClick={handleSubmit}
          >
            <Send className="h-3 w-3" />
            {submitting ? "Gönderiliyor..." : "Sor"}
          </Button>
        </div>
      </div>

      {/* Soru listesi */}
      <div className="space-y-3">
        {visibleQAs.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
            {/* Soru */}
            <div className="flex items-start gap-2.5">
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarFallback className="text-[11px] bg-primary/15 text-primary">
                  {item.askedBy[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold">{item.askedBy}</span>
                  <span className="text-[10px] text-muted-foreground">{item.askedAt}</span>
                </div>
                <p className="text-sm mt-0.5 leading-relaxed">{item.question}</p>
              </div>
            </div>

            {/* Cevap */}
            {item.answer ? (
              <div className="ml-9 rounded-lg bg-primary/5 border border-primary/15 p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  <span className="text-[11px] font-bold text-primary">{sellerName}</span>
                  {item.isOfficial && (
                    <Badge className="h-4 text-[9px] px-1.5 bg-primary/10 text-primary border-0 font-bold">Satıcı</Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground ml-auto">{item.answeredAt}</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground">{item.answer}</p>
              </div>
            ) : (
              <div className="ml-9">
                <p className="text-[11px] text-muted-foreground italic">Henüz yanıt verilmedi...</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {qas.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs text-primary flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-primary/5 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Daha az göster</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> Tüm soruları gör ({qas.length})</>
          )}
        </button>
      )}
    </div>
  );
}
