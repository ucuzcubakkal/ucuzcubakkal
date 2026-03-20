/**
 * env-compat.ts
 * Universal environment detection for:
 *   - Web3 DApps: Pi Browser, MetaMask, WalletConnect WebView
 *   - Mobile: iOS Safari, Android Chrome, WebView
 *   - Web2: Chrome, Firefox, Safari, Edge
 *   - Legacy: Internet Explorer 11
 */

// ─── Type declarations ────────────────────────────────────────────────
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (scopes: string[], callbacks?: object) => Promise<unknown>;
    };
    web3?: object;
    // IE11 detection
    ActiveXObject?: unknown;
    MSInputMethodContext?: unknown;
    DocumentTouch?: unknown;
  }
  interface Document {
    documentMode?: number; // IE-only property
  }
}

// ─── Browser / Runtime detection ─────────────────────────────────────

export type BrowserEnv =
  | "ie"
  | "edge-legacy"
  | "chrome"
  | "firefox"
  | "safari"
  | "opera"
  | "samsung"
  | "pi-browser"
  | "metamask"
  | "coinbase-wallet"
  | "walletconnect"
  | "unknown";

export type PlatformEnv = "mobile-ios" | "mobile-android" | "mobile-other" | "desktop" | "unknown";

export type RuntimeEnv = "pi-browser" | "web3-dapp" | "pwa" | "web2" | "ie" | "unknown";

function ua(): string {
  return typeof navigator !== "undefined" ? (navigator.userAgent ?? "") : "";
}

/** Detect Internet Explorer 11 */
export function isIE(): boolean {
  if (typeof document === "undefined") return false;
  return !!document.documentMode || /Trident\//.test(ua());
}

/** Detect legacy Edge (EdgeHTML, before Chromium) */
export function isEdgeLegacy(): boolean {
  return /Edge\/\d/.test(ua());
}

/** Detect Pi Browser */
export function isPiBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return (
    ua().includes("PiBrowser") ||
    ua().includes("Pi/") ||
    typeof window.Pi !== "undefined"
  );
}

/** Detect MetaMask in-app browser */
export function isMetaMask(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.ethereum?.isMetaMask) && !window.ethereum?.isCoinbaseWallet;
}

/** Detect Coinbase Wallet in-app browser */
export function isCoinbaseWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.ethereum?.isCoinbaseWallet;
}

/** Detect any injected Web3 provider */
export function hasWeb3Provider(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.ethereum !== "undefined" || typeof window.web3 !== "undefined";
}

/** Detect iOS (iPhone, iPad, iPod) */
export function isIOS(): boolean {
  return /iPhone|iPad|iPod/.test(ua()) || (
    /Mac/.test(ua()) &&
    typeof navigator !== "undefined" &&
    navigator.maxTouchPoints > 1
  );
}

/** Detect Android */
export function isAndroid(): boolean {
  return /Android/.test(ua());
}

/** Detect any mobile device */
export function isMobile(): boolean {
  return isIOS() || isAndroid() || /Mobile|webOS|BlackBerry|IEMobile|Opera Mini/.test(ua());
}

/** Detect PWA standalone mode */
export function isPWA(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

/** Detect Safari (but not Chrome on iOS) */
export function isSafari(): boolean {
  return /Safari/.test(ua()) && !/Chrome|CriOS|FxiOS/.test(ua());
}

/** Detect Chrome */
export function isChrome(): boolean {
  return /Chrome/.test(ua()) && !/Edg|OPR/.test(ua());
}

// ─── Composite environment resolver ──────────────────────────────────

export interface EnvInfo {
  browser: BrowserEnv;
  platform: PlatformEnv;
  runtime: RuntimeEnv;
  supportsServiceWorker: boolean;
  supportsWebP: boolean;
  supportsCSS: {
    grid: boolean;
    customProperties: boolean;
    backdropFilter: boolean;
    gap: boolean;
  };
  isLegacy: boolean;
  isDApp: boolean;
  isMobileDevice: boolean;
}

export function detectEnv(): EnvInfo {
  const _ua = ua();
  const isServer = typeof window === "undefined";

  const browser: BrowserEnv = (() => {
    if (isIE()) return "ie";
    if (isEdgeLegacy()) return "edge-legacy";
    if (isPiBrowser()) return "pi-browser";
    if (isMetaMask()) return "metamask";
    if (isCoinbaseWallet()) return "coinbase-wallet";
    if (/SamsungBrowser/.test(_ua)) return "samsung";
    if (/OPR|Opera/.test(_ua)) return "opera";
    if (/Firefox|FxiOS/.test(_ua)) return "firefox";
    if (isSafari()) return "safari";
    if (isChrome()) return "chrome";
    return "unknown";
  })();

  const platform: PlatformEnv = (() => {
    if (isServer) return "unknown";
    if (isIOS()) return "mobile-ios";
    if (isAndroid()) return "mobile-android";
    if (isMobile()) return "mobile-other";
    return "desktop";
  })();

  const runtime: RuntimeEnv = (() => {
    if (isIE() || isEdgeLegacy()) return "ie";
    if (isPiBrowser()) return "pi-browser";
    if (hasWeb3Provider()) return "web3-dapp";
    if (isPWA()) return "pwa";
    return "web2";
  })();

  // CSS feature detection (client only)
  const supportsCSS = isServer ? {
    grid: true, customProperties: true, backdropFilter: true, gap: true,
  } : {
    grid: typeof CSS !== "undefined" && CSS.supports?.("display", "grid"),
    customProperties: typeof CSS !== "undefined" && CSS.supports?.("color", "var(--test)"),
    backdropFilter: typeof CSS !== "undefined" && (
      CSS.supports?.("backdrop-filter", "blur(1px)") ||
      CSS.supports?.("-webkit-backdrop-filter", "blur(1px)")
    ),
    gap: typeof CSS !== "undefined" && CSS.supports?.("gap", "1rem"),
  };

  return {
    browser,
    platform,
    runtime,
    supportsServiceWorker: !isServer && "serviceWorker" in navigator,
    supportsWebP: !isServer && !isIE() && !isEdgeLegacy(),
    supportsCSS,
    isLegacy: isIE() || isEdgeLegacy(),
    isDApp: isPiBrowser() || hasWeb3Provider(),
    isMobileDevice: !isServer && isMobile(),
  };
}

// ─── Polyfill helpers ────────────────────────────────────────────────

/** Load a script tag once (idempotent) */
export function loadScript(src: string, id: string): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (document.getElementById(id)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

/**
 * Apply IE11/legacy polyfills on demand.
 * Called once in the BrowserCompatProvider.
 */
export async function applyLegacyPolyfills(): Promise<void> {
  if (typeof window === "undefined") return;

  // Fetch polyfill for IE11
  if (!window.fetch) {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.20/fetch.min.js",
      "polyfill-fetch"
    );
  }

  // Promise polyfill for IE11
  if (!window.Promise) {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/es6-promise@4.2.8/dist/es6-promise.auto.min.js",
      "polyfill-promise"
    );
  }

  // Array.from / Object.assign / CustomEvent for IE11
  if (!Array.from) {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/core-js-bundle@3.39.0/minified.js",
      "polyfill-corejs"
    );
  }

  // IntersectionObserver (lazy loading) for IE11/Edge Legacy
  if (!window.IntersectionObserver) {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.js",
      "polyfill-io"
    );
  }
}

/** Safe localStorage wrapper — falls back silently in IE/private mode */
export const safeStorage = {
  get(key: string): string | null {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key: string, value: string): void {
    try { localStorage.setItem(key, value); } catch { /* noop */ }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  },
};
