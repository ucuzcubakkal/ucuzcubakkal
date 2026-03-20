"use client";

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  productName: string;
};

export function ImageLightbox({ images, currentIndex, isOpen, onClose, onNavigate, productName }: Props) {
  const prev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const next = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, prev, next]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Kapat butonu */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
        onClick={onClose}
        aria-label="Kapat"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Görsel sayacı */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Ana görsel */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex] || "/placeholder.svg?height=800&width=800"}
          alt={`${productName} - Görsel ${currentIndex + 1}`}
          className="w-full h-full object-contain max-h-[85vh] rounded-lg"
        />
      </div>

      {/* Önceki */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Önceki görsel"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>

          {/* Sonraki */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Sonraki görsel"
          >
            <ChevronRight className="h-7 w-7" />
          </Button>
        </>
      )}

      {/* Alt küçük resimler */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex ? "border-white scale-110" : "border-white/30 opacity-60"
              }`}
            >
              <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ZoomButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-3 left-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
      aria-label="Görseli büyüt"
    >
      <ZoomIn className="h-4 w-4" />
    </button>
  );
}
