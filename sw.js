// Ucuzcubakkal Universal Service Worker v2.0
// Environments: Web3 DApps (Pi Browser, MetaMask), Mobile (iOS/Android), Web2 (Chrome, Firefox, Safari, Edge)
// NOTE: IE11 does not support Service Workers — the SwRegistrar component handles this gracefully.
const CACHE_NAME = "ucuzcubakkal-v2";
const STATIC_CACHE = "ucuzcubakkal-static-v2";
const DYNAMIC_CACHE = "ucuzcubakkal-dynamic-v2";
const PI_SDK_CACHE = "ucuzcubakkal-pi-sdk-v2";

const STATIC_ASSETS = [
  "/",
  "/kategori/tumu",
  "/zanaatkarlar",
  "/sepet",
  "/favoriler",
  "/offline",
];

// Install — statik varlıkları önbelleğe al
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Ucuzcubakkal Service Worker...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate — eski önbellekleri temizle
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Ucuzcubakkal Service Worker...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== PI_SDK_CACHE)
            .map((k) => {
              return caches.delete(k);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch — cross-environment strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Pi SDK — cache-first (SDK rarely changes, avoid re-download on each boot)
  if (url.hostname === "sdk.minepi.com") {
    event.respondWith(piSdkCacheStrategy(request));
    return;
  }

  // CDN polyfills (for IE/legacy) — cache-first
  if (url.hostname === "cdn.jsdelivr.net") {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Cross-origin requests (wallet callbacks, external APIs) — network only
  if (url.origin !== location.origin) return;

  // API isteklerini önbelleğe alma
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Görseller için Cache-First
  if (
    request.destination === "image" ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/)
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Sayfalar için Stale-While-Revalidate
  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Diger statik varliklar
  event.respondWith(cacheFirstStrategy(request));
});

// Stratejiler

// Pi SDK: cache-first, 7 gun TTL
async function piSdkCacheStrategy(request) {
  const cache = await caches.open(PI_SDK_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    const date = cached.headers.get("sw-cached-at");
    const age = date ? Date.now() - parseInt(date, 10) : Infinity;
    // 7 days TTL
    if (age < 7 * 24 * 60 * 60 * 1000) return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set("sw-cached-at", String(Date.now()));
      const cachedResponse = new Response(await response.clone().arrayBuffer(), {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      cache.put(request, cachedResponse);
    }
    return response;
  } catch {
    return cached || new Response("Pi SDK offline", { status: 503 });
  }
}

async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline - İçerik yüklenemiyor", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: "Çevrimdışısınız" }), {
      headers: { "Content-Type": "application/json" },
      status: 503,
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || fetchPromise || caches.match("/offline") || new Response("Çevrimdışı", { status: 503 });
}

// Push Bildirim
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || "Yeni bir bildiriminiz var",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    tag: data.tag || "ucuzcubakkal",
    data: { url: data.url || "/" },
    actions: [
      { action: "open", title: "Görüntüle" },
      { action: "close", title: "Kapat" },
    ],
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Ucuzcubakkal",
      options
    )
  );
});

// Bildirime tıklandığında
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "close") return;
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Arka plan senkronizasyon (sepet, favoriler gibi)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-cart") {
    console.log("[SW] Background sync: cart");
    event.waitUntil(syncCart());
  }
  if (event.tag === "sync-favorites") {
    console.log("[SW] Background sync: favorites");
    event.waitUntil(syncFavorites());
  }
});

async function syncCart() {
  // Gerçek uygulamada IndexedDB'den okunur ve API'ye gönderilir
  console.log("[SW] Cart sync completed");
}

async function syncFavorites() {
  console.log("[SW] Favorites sync completed");
}
