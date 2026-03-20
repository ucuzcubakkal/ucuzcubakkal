import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade ve Değişim",
  description:
    "Ucuzcubakkal'da kolayca iade ve değişim talebi oluşturun. 14 gün iade garantisi.",
  openGraph: {
    title: "İade ve Değişim | Ucuzcubakkal",
    description: "14 gün iade garantisiyle güvenle alışveriş yapın.",
  },
};

export default function IadeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
