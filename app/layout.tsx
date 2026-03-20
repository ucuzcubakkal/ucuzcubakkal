import type React from "react";
import type { Metadata, Viewport } from "next";
import { Open_Sans, Playfair_Display } from "next/font/google";
import { APP_CONFIG } from "@/lib/app-config";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "600", "700"],
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["700"],
});

const appDescription = APP_CONFIG.DESCRIPTION;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a8a",
};

export const metadata: Metadata = {
  title: {
    default: "Ucuzcubakkal — Global E-Ticaret Platformu",
    template: "%s | Ucuzcubakkal",
  },
  description: "Milyonlarca ürün, yüz binlerce satıcı. Elektronikten modaya, ev dekorasyonundan gıdaya — her şey Ucuzcubakkal'da. Pi Network ile güvenli ödeme.",
  manifest: "/manifest.json",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ucuzcubakkal",
    title: "Ucuzcubakkal — Global E-Ticaret Platformu",
    description: "Milyonlarca ürün, yüz binlerce satıcı. Pi Network ile güvenli ödeme.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ucuzcubakkal",
    description: "Global e-ticaret platformu — Pi Network ile alışveriş yapın.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ucuzcubakkal",
  },
    generator: 'v0.app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ucuzcubakkal" />
        <meta name="dapp-platform" content="pi-network" />
        <meta name="web3-compatible" content="true" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${openSans.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="ucuzcubakkal-theme"
        >
          <AuthProvider>
            <CartProvider>
              <div className="pb-16 md:pb-0">
                {children}
                <SiteFooter />
              </div>
              <BottomNav />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
