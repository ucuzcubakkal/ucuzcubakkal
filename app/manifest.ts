import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ucuzcubakkal - Global E-Ticaret Platformu",
    short_name: "Ucuzcubakkal",
    description: "Pi topluluğu için milyonlarca ürün, yüz binlerce satıcı. Global e-ticaret platformu.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F27A1A",
    orientation: "portrait",
    categories: ["shopping", "marketplace"],
    lang: "tr",
    icons: [
      {
        src: "/placeholder.svg?height=192&width=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/placeholder.svg?height=512&width=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Alışverişe Başla",
        url: "/kategori/tumu",
        description: "Tüm ürünleri gör",
      },
      {
        name: "Sepetim",
        url: "/sepet",
        description: "Sepetimi görüntüle",
      },
      {
        name: "Kampanyalar",
        url: "/kampanyalar",
        description: "Güncel kampanyalar",
      },
    ],
    screenshots: [
      {
        src: "/placeholder.svg?height=812&width=375",
        sizes: "375x812",
        type: "image/png",
        label: "Ana Sayfa",
      },
    ],
  };
}
