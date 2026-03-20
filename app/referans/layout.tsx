import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arkadaşını Getir",
  description:
    "Ucuzcubakkal'ı arkadaşlarınla paylaş, her başarılı davette her iki tarafa 10π indirim kazan.",
  openGraph: {
    title: "Arkadaşını Getir | Ucuzcubakkal",
    description: "Referans linkinizi paylaşın, siz de arkadaşınız da 10π kazanın.",
  },
};

export default function ReferansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
