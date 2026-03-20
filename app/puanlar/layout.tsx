import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bakkal Puanlarım",
  description:
    "Ucuzcubakkal sadakat programı: alışveriş yap, puan kazan, Pi indirimi olarak kullan.",
  openGraph: {
    title: "Bakkal Puanlarım | Ucuzcubakkal",
    description: "Her alışverişte puan kazanın, biriktirin ve Pi indirimi olarak kullanın.",
  },
};

export default function PuanlarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
