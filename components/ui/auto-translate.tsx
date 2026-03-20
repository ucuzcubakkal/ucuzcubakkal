"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Languages, CheckCircle2, Loader2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "İngilizce",    flag: "🇬🇧", enabled: true },
  { code: "ar", label: "Arapça",       flag: "🇸🇦", enabled: true },
  { code: "es", label: "İspanyolca",   flag: "🇪🇸", enabled: false },
  { code: "de", label: "Almanca",      flag: "🇩🇪", enabled: false },
  { code: "fr", label: "Fransızca",    flag: "🇫🇷", enabled: false },
  { code: "zh", label: "Çince",        flag: "🇨🇳", enabled: false },
];

const MOCK_ORIGINAL = "El yapımı pamuklu kilim yastık. Geleneksel Anadolu motifleriyle dokunmuş, doğal boyalar kullanılmıştır. Boyutlar: 45x45 cm.";

const MOCK_TRANSLATIONS: Record<string, string> = {
  en: "Handmade cotton kilim cushion. Woven with traditional Anatolian motifs, using natural dyes. Dimensions: 45x45 cm.",
  ar: "وسادة كيليم قطنية مصنوعة يدوياً. منسوجة بزخارف الأناضول التقليدية بأصباغ طبيعية. الأبعاد: 45×45 سم.",
  es: "Cojín de kilim de algodón hecho a mano. Tejido con motivos anatolios tradicionales con tintes naturales. Dimensiones: 45x45 cm.",
  de: "Handgefertigtes Baumwoll-Kilim-Kissen. Mit traditionellen anatolischen Motiven gewebt, mit Naturfarben. Abmessungen: 45x45 cm.",
  fr: "Coussin kilim en coton fait main. Tissé avec des motifs anatoliens traditionnels avec des teintures naturelles. Dimensions : 45x45 cm.",
  zh: "手工棉质基利姆靠垫。采用安纳托利亚传统图案，使用天然染料编织而成。尺寸：45x45厘米。",
};

export function AutoTranslate() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState(LANGUAGES);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [translating, setTranslating] = useState<string | null>(null);
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [previewLang, setPreviewLang] = useState<string | null>(null);

  const toggleLang = (code: string) => {
    setLanguages((prev) => prev.map((l) => l.code === code ? { ...l, enabled: !l.enabled } : l));
  };

  const translateAll = () => {
    const enabledLangs = languages.filter((l) => l.enabled);
    let i = 0;
    const run = () => {
      if (i >= enabledLangs.length) {
        setTranslating(null);
        toast({ title: `${enabledLangs.length} dile çevrildi`, description: "Tüm ürün açıklamaları güncellendi." });
        return;
      }
      setTranslating(enabledLangs[i].code);
      setTimeout(() => {
        setTranslated((prev) => ({ ...prev, [enabledLangs[i].code]: MOCK_TRANSLATIONS[enabledLangs[i].code] || "" }));
        i++;
        run();
      }, 600);
    };
    run();
  };

  const enabledCount = languages.filter((l) => l.enabled).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Otomatik Çeviri
        </CardTitle>
        <CardDescription className="text-xs">
          Ürün başlık ve açıklamalarını seçili dillere otomatik çevirin. Global alıcılara ulaşın.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Otomatik çeviri toggle */}
        <div className="flex items-center justify-between bg-muted/40 rounded-xl p-3">
          <div>
            <p className="text-sm font-medium">Yeni ürünlerde otomatik çeviri</p>
            <p className="text-xs text-muted-foreground">Yeni ürün eklendiğinde seçili dillere anında çevrilir</p>
          </div>
          <Switch checked={autoEnabled} onCheckedChange={setAutoEnabled} />
        </div>

        {/* Dil seçimi */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">HEDEF DİLLER</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => toggleLang(lang.code)}
                className={cn("flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all text-left",
                  lang.enabled ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                )}>
                <span className="text-base">{lang.flag}</span>
                <span className="text-xs font-medium flex-1 truncate">{lang.label}</span>
                {translated[lang.code] && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />}
                {translating === lang.code && <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full gap-2" onClick={translateAll} disabled={!!translating || enabledCount === 0}>
          {translating
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Çevriliyor...</>
            : <><Languages className="h-4 w-4" /> {enabledCount} Dile Çevir</>
          }
        </Button>

        {/* Önizleme */}
        {Object.keys(translated).length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">ÇEVİRİ ÖNİZLEME</Label>
              <div className="flex gap-1.5 flex-wrap">
                {languages.filter((l) => translated[l.code]).map((lang) => (
                  <button key={lang.code} onClick={() => setPreviewLang(previewLang === lang.code ? null : lang.code)}
                    className={cn("text-xs px-2.5 py-1 rounded-full border transition-colors",
                      previewLang === lang.code ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary/50"
                    )}>
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
              {previewLang && (
                <div className="bg-muted/40 rounded-xl p-3 space-y-2">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">Orijinal (TR)</p>
                  <p className="text-xs">{MOCK_ORIGINAL}</p>
                  <Separator />
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">
                    {languages.find((l) => l.code === previewLang)?.label}
                  </p>
                  <p className="text-xs">{translated[previewLang]}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
