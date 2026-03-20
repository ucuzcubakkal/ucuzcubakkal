import type { Metadata } from "next";

const SITE_URL = "https://ucuzcubakkal.com";
const SITE_NAME = "Ucuzcu Bakkal";

// ─── Slug üretici ───────────────────────────────────────────────────────────
// Kötü: /urun/12345   İyi: /urun/1/el-yapimi-deri-cuzdan
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function productCanonicalUrl(id: string, name: string): string {
  return `${SITE_URL}/urun/${id}/${toSlug(name)}`;
}

export function categoryCanonicalUrl(slug: string): string {
  return `${SITE_URL}/kategori/${slug}`;
}

// ─── Genel sayfa metadata üretici ───────────────────────────────────────────
interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function generateSEO({ title, description, path = "", image }: SEOProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ─── Product Schema — Google Rich Results: yıldız + fiyat ──────────────────
export interface ProductSchemaInput {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  brand?: string;
  category?: string;
  stock: number;
  sellerName?: string;
}

export function generateProductSchema(p: ProductSchemaInput): object {
  const availability =
    p.stock === 0
      ? "https://schema.org/OutOfStock"
      : p.stock <= 5
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/InStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((img) =>
      img.startsWith("http") ? img : `${SITE_URL}${img}`
    ),
    sku: p.id,
    brand: { "@type": "Brand", name: p.brand ?? SITE_NAME },
    category: p.category,
    offers: {
      "@type": "Offer",
      url: productCanonicalUrl(p.id, p.name),
      priceCurrency: "PI",
      price: p.price,
      availability,
      seller: { "@type": "Organization", name: p.sellerName ?? SITE_NAME },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

// ─── BreadcrumbList Schema ───────────────────────────────────────────────────
export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
    })),
  };
}

// ─── Organization Schema (Ana Sayfa — tek kez render edilir) ────────────────
export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-192.png`,
    description:
      "Pi Network topluluğu için tasarlanmış, el sanatlarını ve özgün ürünleri buluşturan global e-ticaret platformu.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
  };
}

// ─── WebSite Schema — Google Sitelinks Searchbox ────────────────────────────
export function generateWebSiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/ara?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── CollectionPage Schema (Kategori sayfası) ────────────────────────────────
export function generateCategorySchema(params: {
  name: string;
  description: string;
  slug: string;
  productCount: number;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${params.name} — ${SITE_NAME}`,
    description: params.description,
    url: categoryCanonicalUrl(params.slug),
    numberOfItems: params.productCount,
  };
}
