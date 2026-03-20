"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Büyük 404 Yazısı */}
        <div className="font-serif text-[120px] md:text-[160px] font-bold text-primary/10 leading-none select-none mb-2">
          404
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
          El yapımı ürünleri keşfetmek için ana sayfaya dönebilirsiniz.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Link href="/ara">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
              <Search className="h-4 w-4" />
              Ürün Ara
            </Button>
          </Link>
        </div>

        {/* Geri dön */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Önceki sayfaya dön
        </button>
      </div>
    </div>
  );
}
