"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Search, Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SeoMetaEditorProps {
  productName?: string;
}

export function SeoMetaEditor({ productName = "Ürün Adı" }: SeoMetaEditorProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(`${productName} | Ucuzcubakkal`);
  const [desc, setDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [preview, setPreview] = useState(false);

  const titleLen = title.length;
  const descLen  = desc.length;
  const titleOk  = titleLen >= 30 && titleLen <= 60;
  const descOk   = descLen  >= 80 && descLen  <= 160;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> SEO Meta Duzenleyici
          </CardTitle>
          <Button
            variant="outline" size="sm"
            className="h-6 text-xs gap-1"
            onClick={() => setPreview(!preview)}
          >
            <Eye className="h-3 w-3" /> {preview ? "Formu Goster" : "Onizleme"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {preview ? (
          /* Google Onizleme */
          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Google Arama Sonucu Onizleme</span>
            </div>
            <div className="max-w-[480px]">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium leading-tight line-clamp-1">
                {title || "Sayfa Basligi"}
              </p>
              <p className="text-[11px] text-green-700 dark:text-green-400 mt-0.5">
                ucuzcubakkal.com › urun › {productName.toLowerCase().replace(/\s+/g, "-")}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                {desc || "Meta açıklama buraya gelecek. Arama sonuçlarında bu metin görünür."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Baslik */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Meta Baslik</Label>
                <span className={cn("text-[10px] font-medium", titleOk ? "text-green-600" : "text-orange-500")}>
                  {titleLen}/60 {titleOk && <CheckCircle2 className="inline h-3 w-3" />}
                </span>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="30-60 karakter ideal"
                className="h-8 text-sm"
                maxLength={70}
              />
              {!titleOk && (
                <p className="text-[10px] text-orange-500">Ideal uzunluk: 30-60 karakter</p>
              )}
            </div>

            {/* Aciklama */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Meta Aciklama</Label>
                <span className={cn("text-[10px] font-medium", descOk ? "text-green-600" : "text-orange-500")}>
                  {descLen}/160 {descOk && <CheckCircle2 className="inline h-3 w-3" />}
                </span>
              </div>
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="80-160 karakter ideal. Ürünü kısaca tanıtın."
                className="text-sm resize-none h-20"
                maxLength={170}
              />
            </div>

            {/* Anahtar Kelimeler */}
            <div className="space-y-1.5">
              <Label className="text-xs">Anahtar Kelimeler</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="virgülle ayrın: el yapımı, kilim, dekorasyon"
                className="h-8 text-sm"
              />
              {keywords && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {keywords.split(",").filter(k => k.trim()).map((k, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] h-5">{k.trim()}</Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <Button
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => toast({ title: "SEO bilgileri kaydedildi", description: "Degisiklikler arama motorlarına yansıyacak." })}
        >
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
}
