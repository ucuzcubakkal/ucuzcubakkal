"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config";

export type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: "buyer" | "artisan" | "admin";
  piUsername: string;
  piUid: string;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "error";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  status: AuthStatus;
  errorMessage: string | null;
  loginWithPi: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Pi SDK tip tanımları
declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: string[],
        callbacks?: { onIncompletePaymentFound?: (payment: unknown) => void }
      ) => Promise<{ accessToken: string; user: { uid: string; username: string } }>;
    };
  }
}

const STORAGE_KEY = "ucuzcubakkal_pi_user";

// Gerçek Pi SDK URL'si — placeholder değilse kullan, yoksa CDN'den yükle
const PI_SDK_URL = (PI_NETWORK_CONFIG.SDK_URL && !PI_NETWORK_CONFIG.SDK_URL.includes("PLACEHOLDER"))
  ? PI_NETWORK_CONFIG.SDK_URL
  : "https://sdk.minepi.com/pi-sdk.js";

// Backend hazır mı?
const BACKEND_READY =
  BACKEND_URLS.LOGIN &&
  !BACKEND_URLS.LOGIN.includes("PLACEHOLDER") &&
  !BACKEND_URLS.LOGIN.includes("<");

function isInPiBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent ?? "";
  return ua.includes("PiBrowser") || ua.includes("Pi/") || !!window.Pi;
}

function isInIframe(): boolean {
  try { return window.self !== window.top; } catch { return true; }
}

async function loadPiSDK(): Promise<boolean> {
  if (typeof window.Pi !== "undefined") return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = PI_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false); // hata fırlatma, false döndür
    document.head.appendChild(script);
  });
}

function requestParentCredentials(): Promise<{ accessToken: string; appId: string | null } | null> {
  if (!isInIframe()) return Promise.resolve(null);
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      window.removeEventListener("message", handler);
      resolve(null);
    }, 2000);
    const handler = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      let data: any;
      try { data = typeof event.data === "string" ? JSON.parse(event.data) : event.data; } catch { return; }
      if (data?.type !== "@pi:app:sdk:communication_information_request" || data?.id !== requestId) return;
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      const token = data?.payload?.accessToken;
      resolve(token ? { accessToken: token, appId: data?.payload?.appId ?? null } : null);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage(
      JSON.stringify({ type: "@pi:app:sdk:communication_information_request", id: requestId }), "*"
    );
  });
}

function buildDemoUser(username = "pi_kullanici"): User {
  return {
    id: `demo_${Date.now()}`,
    name: username,
    piUsername: username,
    piUid: `uid_${Math.random().toString(36).slice(2, 10)}`,
    role: "buyer",
  };
}

async function authenticateWithBackend(accessToken: string, appId?: string | null): Promise<User> {
  if (!BACKEND_READY) {
    // Backend henüz yapılandırılmamış — demo kullanıcı döndür
    return buildDemoUser("pi_misafir");
  }
  const endpoint = appId ? BACKEND_URLS.LOGIN_PREVIEW : BACKEND_URLS.LOGIN;
  const body = appId ? { pi_auth_token: accessToken, app_id: appId } : { pi_auth_token: accessToken };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Sunucu hatası, lütfen tekrar deneyin.");
  const data = await res.json();
  return {
    id: data.uid ?? data.user?.uid ?? String(Date.now()),
    name: data.username ?? data.user?.username ?? "Pi Kullanıcısı",
    piUsername: data.username ?? data.user?.username ?? "pi_kullanici",
    piUid: data.uid ?? data.user?.uid ?? "",
    avatar: data.avatar ?? undefined,
    role: data.role ?? "buyer",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sayfa yüklendiğinde kayıtlı oturumu geri yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
        setStatus("authenticated");
        return;
      }
    } catch { /* */ }
    setStatus("idle");
  }, []);

  const loginWithPi = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      // Adım 1 — iframe üzerinden token al (App Studio / Pi Browser preview)
      const parentCreds = await requestParentCredentials();
      if (parentCreds) {
        const loggedUser = await authenticateWithBackend(parentCreds.accessToken, parentCreds.appId);
        setUser(loggedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
        setStatus("authenticated");
        return;
      }

      // Adım 2 — Pi SDK yükle ve authenticate et (Pi Browser ortamı)
      const sdkLoaded = await loadPiSDK();
      if (sdkLoaded && typeof window.Pi !== "undefined") {
        try {
          await window.Pi.init({ version: "2.0", sandbox: PI_NETWORK_CONFIG.SANDBOX });
          const auth = await window.Pi.authenticate(["username", "payments"], {
            onIncompletePaymentFound: () => {},
          });
          const loggedUser = await authenticateWithBackend(auth.accessToken);
          loggedUser.piUsername = auth.user.username;
          loggedUser.piUid = auth.user.uid;
          loggedUser.name = auth.user.username;
          setUser(loggedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
          setStatus("authenticated");
          return;
        } catch {
          // SDK yüklendi ama authenticate başarısız — demo moda geç
        }
      }

      // Adım 3 — Pi Browser dışı ortam (geliştirme / demo mod)
      // Gerçek Pi Browser'da bu adıma gelinmez
      const demoUser = buildDemoUser("demo_kullanici");
      setUser(demoUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      setStatus("authenticated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Giriş sırasında bir hata oluştu.";
      setErrorMessage(msg);
      setStatus("error");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStatus("idle");
    setErrorMessage(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === "loading",
        isLoggedIn: status === "authenticated" && !!user,
        status,
        errorMessage,
        loginWithPi,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır");
  return ctx;
}
