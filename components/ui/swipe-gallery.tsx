"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type SwipeGalleryProps = {
  images: string[];
  productName: string;
  onImageClick?: (index: number) => void;
};

export function SwipeGallery({ images, productName, onImageClick }: SwipeGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(currentIndex + 1);
        else goTo(currentIndex - 1);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="space-y-3">
      {/* Ana Görsel */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => onImageClick?.(currentIndex)}
      >
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${productName} - ${currentIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Yön Butonları */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1); }}
              disabled={currentIndex === 0}
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1); }}
              disabled={currentIndex === images.length - 1}
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Nokta Göstergesi */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/60"
                }`}
                aria-label={`Görsel ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Sayfa İndikatörü */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Küçük Resimler */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === currentIndex ? "border-primary" : "border-border hover:border-primary/40"
              }`}
              aria-label={`Görsel ${i + 1}`}
            >
              <img src={img || "/placeholder.svg"} alt={`${productName} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
