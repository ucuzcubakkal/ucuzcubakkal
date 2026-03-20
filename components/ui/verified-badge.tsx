"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type VerifiedBadgeProps = {
  verified: boolean;
  /** "kyc" = Pi Network KYC mavi tik | "platform" = platform dogrulamasi */
  type?: "kyc" | "platform";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4.5 w-4.5",
  lg: "h-6 w-6",
};

export function VerifiedBadge({
  verified,
  type = "kyc",
  size = "md",
  showLabel = false,
  className,
}: VerifiedBadgeProps) {
  if (!verified) return null;

  const isKyc = type === "kyc";

  // KYC = Twitter/X stili evrensel mavi tik (#1D9BF0)
  // Platform = site dogrulamasi, lacivert primary tonu
  const iconColor = isKyc ? "#1D9BF0" : "hsl(var(--primary))";
  const label = isKyc ? "Pi Network KYC Dogrulanmis Satici" : "Ucuzcubakkal Dogrulanmis";
  const description = isKyc
    ? "Bu satici Pi Network kimlik dogrulama (KYC) surecini tamamlamistir. Bilgileri gercek ve dogrulanmistir."
    : "Bu satici Ucuzcubakkal platformu tarafindan dogrulanmistir.";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-1 cursor-help", className)}>
            <BadgeCheck
              className={cn(sizeMap[size], "flex-shrink-0 drop-shadow-sm")}
              style={{ color: iconColor }}
              aria-label={label}
            />
            {showLabel && (
              <span
                className="text-xs font-semibold"
                style={{ color: iconColor }}
              >
                {isKyc ? "KYC Dogrulandi" : "Dogrulandi"}
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-center space-y-1">
          <p className="font-semibold text-xs">{label}</p>
          <p className="text-muted-foreground text-[11px] leading-relaxed">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
