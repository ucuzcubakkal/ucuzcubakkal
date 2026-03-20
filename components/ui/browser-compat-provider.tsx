"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  detectEnv,
  applyLegacyPolyfills,
  type EnvInfo,
} from "@/lib/env-compat";
import { X, AlertTriangle, Info, Smartphone } from "lucide-react";

// ─── Context ─────────────────────────────────────────────────────────

const EnvContext = createContext<EnvInfo | null>(null);

export function useEnv(): EnvInfo | null {
  return useContext(EnvContext);
}

// ─── IE11 Upgrade Banner ──────────────────────────────────────────────

function IEBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        background: "#fff3cd",
        borderBottom: "2px solid #f27a1a",
        padding: "10px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#7a4600",
        zIndex: 9999,
        position: "relative",
      }}
    >
      <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <strong>Tarayıcınız desteklenmiyor.</strong>{" "}
        Internet Explorer, tam deneyim için desteklenmemektedir.{" "}
        Lütfen{" "}
        <a
          href="https://www.google.com/chrome/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#f27a1a", fontWeight: "bold" }}
        >
          Google Chrome
        </a>
        ,{" "}
        <a
          href="https://www.microsoft.com/edge"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#f27a1a", fontWeight: "bold" }}
        >
          Microsoft Edge
        </a>{" "}
        veya{" "}
        <a
          href="https://www.mozilla.org/firefox/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#f27a1a", fontWeight: "bold" }}
        >
          Firefox
        </a>{" "}
        kullanın.
      </div>
      <button
        onClick={onDismiss}
        aria-label="Kapat"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          color: "#7a4600",
          flexShrink: 0,
        }}
      >
        <X style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
}

// ─── DApp Environment Banner ─────────────────────────────────────────

function DAppBanner({
  runtime,
  onDismiss,
}: {
  runtime: string;
  onDismiss: () => void;
}) {
  const isPi = runtime === "pi-browser";
  const isMetaMask = runtime === "web3-dapp";

  if (!isPi && !isMetaMask) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-primary-foreground"
      style={{ background: "#f27a1a" }}
    >
      <Smartphone className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="flex-1">
        {isPi
          ? "Pi Browser ile baglandiniz — Pi Network odeme aktif."
          : "Web3 cuzdan algilandi — Kripto odeme desteği aktif."}
      </span>
      <button
        onClick={onDismiss}
        aria-label="Kapat"
        className="p-1 hover:opacity-70 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Offline Banner ───────────────────────────────────────────────────

function OfflineBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white"
      style={{ background: "#dc2626" }}
    >
      <Info className="h-3.5 w-3.5 flex-shrink-0" />
      <span>
        Cevrimdisi gorunuyorsunuz. Bazi ozellikler sinirli calisabilir.
      </span>
    </div>
  );
}

// ─── Main Provider ────────────────────────────────────────────────────

export function BrowserCompatProvider({ children }: { children: ReactNode }) {
  const [env, setEnv] = useState<EnvInfo | null>(null);
  const [showIEBanner, setShowIEBanner] = useState(false);
  const [showDAppBanner, setShowDAppBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const info = detectEnv();
    setEnv(info);

    // IE uyarısını bir kez göster
    if (info.isLegacy) {
      const dismissed = sessionStorage.getItem("ie-banner-dismissed");
      if (!dismissed) setShowIEBanner(true);
      // Legacy polyfill'leri yükle
      applyLegacyPolyfills().catch(() => {/* polyfill yüklenemedi, devam et */});
    }

    // DApp ortam bilgisini göster
    if (info.isDApp) {
      const dismissed = sessionStorage.getItem("dapp-banner-dismissed");
      if (!dismissed) setShowDAppBanner(true);
    }

    // body'e ortam sınıfları ekle (CSS hedefleme için)
    const body = document.body;
    if (info.isLegacy) body.classList.add("is-legacy-browser");
    if (info.isDApp) body.classList.add("is-dapp");
    if (info.isMobileDevice) body.classList.add("is-mobile");
    if (info.runtime === "pi-browser") body.classList.add("is-pi-browser");
    if (info.runtime === "pwa") body.classList.add("is-pwa");

    // Offline/online dinleyicileri
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const dismissIE = () => {
    setShowIEBanner(false);
    try { sessionStorage.setItem("ie-banner-dismissed", "1"); } catch { /* IE private mode */ }
  };

  const dismissDApp = () => {
    setShowDAppBanner(false);
    try { sessionStorage.setItem("dapp-banner-dismissed", "1"); } catch { /* noop */ }
  };

  return (
    <EnvContext.Provider value={env}>
      {/* Banners render outside main content flow */}
      {showIEBanner && <IEBanner onDismiss={dismissIE} />}
      {!showIEBanner && showDAppBanner && env && (
        <DAppBanner runtime={env.runtime} onDismiss={dismissDApp} />
      )}
      {isOffline && <OfflineBanner />}
      {children}
    </EnvContext.Provider>
  );
}
