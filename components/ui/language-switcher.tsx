"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Language } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n-context";

const FLAGS: Record<Language, string> = { tr: "🇹🇷", en: "🇬🇧" };
const LABELS: Record<Language, string> = { tr: "Türkçe", en: "English" };

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-sm gap-1">
          <span>{FLAGS[lang]}</span>
          <span className="hidden sm:inline text-xs">{LABELS[lang]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[130px]">
        {(Object.keys(FLAGS) as Language[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className={`gap-2 ${lang === l ? "bg-accent font-medium" : ""}`}
          >
            <span>{FLAGS[l]}</span>
            <span>{LABELS[l]}</span>
            {lang === l && <span className="ml-auto text-primary text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
