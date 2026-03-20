"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PRODUCT_CONFIG } from "@/lib/product-config";

declare global {
  interface Window {
    pay?: (options: {
      amount: number;
      memo: string;
      metadata: Record<string, unknown>;
      onComplete: () => void;
      onError: (error: Error) => void;
    }) => void;
  }
}

// usePiAuth hook — products array'i Pi Network context'inden alır
function usePiAuth() {
  if (typeof window === "undefined") return null;
  return (window as any).__PI_AUTH__ ?? null;
}

type PaymentStatus = "idle" | "loading" | "success" | "error";

export function GlobalEcommercePaymentButton() {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const piAuth = usePiAuth();
  const products: Array<{ id: string; name: string; price_in_pi: number }> =
    piAuth?.products ?? [];

  const productId = PRODUCT_CONFIG.PRODUCT_69ade15cf0810f0a06607146;
  const product = products.find((p) => p.id === productId);

  // Ürün bulunamazsa sabit fiyatı kullan (fallback)
  const amount = product?.price_in_pi ?? 0.5;
  const productName = product?.name ?? "Global e-commerce products";

  const handlePay = () => {
    if (!window.pay) {
      setErrorMsg("Pi ödeme sistemi henüz hazır değil. Lütfen Pi Browser üzerinden tekrar deneyin.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    window.pay({
      amount,
      memo: productName,
      metadata: { productId },
      onComplete: () => {
        setStatus("success");
      },
      onError: (error: Error) => {
        setErrorMsg(error?.message ?? "Ödeme sırasında bir hata oluştu.");
        setStatus("error");
      },
    });
  };

  const isDisabled = status === "loading" || status === "success";

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      <Button
        size="lg"
        className="w-full h-12 text-base font-semibold gap-2"
        onClick={handlePay}
        disabled={isDisabled}
        aria-label={`${productName} satın al — ${amount} Pi`}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Ödeme İşleniyor...
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle className="h-5 w-5" />
            Ödeme Tamamlandı
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            {productName} — {amount} Pi ile Satın Al
          </>
        )}
      </Button>

      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4" />
          Satın alma işleminiz başarıyla tamamlandı!
        </p>
      )}

      {status === "error" && errorMsg && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </p>
      )}

      {status === "error" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setStatus("idle"); setErrorMsg(null); }}
        >
          Tekrar Dene
        </Button>
      )}
    </div>
  );
}
