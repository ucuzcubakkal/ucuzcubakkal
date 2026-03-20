import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Ara",
  description:
    "Ucuzcubakkal'da milyonlarca ürünü arayın. Kategori, fiyat ve puana göre filtreleyin.",
  openGraph: {
    title: "Ürün Ara | Ucuzcubakkal",
    description: "Milyonlarca ürün arasında arama yapın, en iyi fiyatı bulun.",
  },
};

export default function AraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
