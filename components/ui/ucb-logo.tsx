import Link from "next/link";
import { cn } from "@/lib/utils";

interface UcbLogoProps {
  asLink?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  iconOnly?: boolean;
}

const SIZES = {
  sm: { icon: 30, text: "text-[15px]", gap: "gap-2"   },
  md: { icon: 38, text: "text-[19px]", gap: "gap-2.5" },
  lg: { icon: 52, text: "text-[26px]", gap: "gap-3"   },
};

function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Arka plan — turuncu yuvarlak */}
      <rect width="48" height="48" rx="12" fill="#F27A1A" />

      {/* Üst yatay çizgi (Pi üstü) */}
      <rect x="10" y="13" width="28" height="3.5" rx="1.75" fill="white" />

      {/* Sol bacak */}
      <rect x="13" y="13" width="3.5" height="22" rx="1.75" fill="white" />

      {/* Sağ bacak — yarım (π harfi) */}
      <rect x="27" y="13" width="3.5" height="16" rx="1.75" fill="white" />

      {/* Orta köprü (U bağlantısı) */}
      <path
        d="M16.5 35 Q24 42 31.5 35"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function LogoText({ sizeKey }: { sizeKey: "sm" | "md" | "lg" }) {
  const cls = SIZES[sizeKey].text;
  return (
    <span className={cn("font-black leading-none tracking-tight select-none", cls)}>
      <span className="text-primary">Ucuzcu</span>
      <span className="text-foreground">bakkal</span>
    </span>
  );
}

export function UcbLogo({
  asLink = true,
  href = "/",
  size = "md",
  className,
  iconOnly = false,
}: UcbLogoProps) {
  const { icon, gap } = SIZES[size];

  const inner = (
    <span className={cn("flex items-center select-none", gap, className)}>
      <LogoMark size={icon} />
      {!iconOnly && <LogoText sizeKey={size} />}
    </span>
  );

  if (!asLink) return inner;

  return (
    <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
      {inner}
    </Link>
  );
}
