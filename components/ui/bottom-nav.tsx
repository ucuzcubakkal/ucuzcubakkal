"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Sparkles, Heart, Wallet } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/",              icon: Home,        label: "Kesfet"      },
  { href: "/kategoriler",   icon: LayoutGrid,  label: "Kategoriler" },
  { href: "/ucuzcu-ai",     icon: Sparkles,    label: "Ucuzcu AI",  accent: true },
  { href: "/favoriler",     icon: Heart,       label: "Favorilerim" },
  { href: "/profil",        icon: Wallet,      label: "Profil"     },
];

const HIDDEN_PATHS = ["/admin", "/giris", "/odeme"];

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { isLoggedIn } = useAuth();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const href =
            item.href === "/profil" && !isLoggedIn ? "/giris" : item.href;

          // active: exact for home, prefix for others
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          if (item.accent) {
            /* Ucuzcu AI — floating center button */
            return (
              <Link
                key={item.href}
                href={href}
                className="flex flex-col items-center justify-center flex-1 gap-0.5 -mt-3 relative"
                aria-label={item.label}
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? "bg-primary shadow-primary/40"
                      : "bg-primary shadow-primary/30"
                  }`}
                >
                  <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
                </div>
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 gap-1 py-2 relative active:opacity-70 transition-opacity"
              aria-label={item.label}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {/* Sepet sayaci — favoriler üzerinden sepet yerine burada artık yok, ama wallet badge */}
                {item.href === "/profil" && isLoggedIn && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" />
                )}
              </div>

              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
              )}

              <span
                className={`text-[10px] font-medium transition-colors leading-none ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
