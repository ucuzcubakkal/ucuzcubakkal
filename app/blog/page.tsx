"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, User, Search, Clock } from "lucide-react";
import { Header } from "@/components/header";
import { useState } from "react";

const BLOG_POSTS = [
  {
    id: 1,
    title: "El Dokuma Kilimlerin Hikayesi",
    excerpt: "Anadolu'nun dört bir yanından gelen geleneksel kilim motifleri ve anlamları. Yüzyıllarca aktarılan bir sanatın modern dünyadaki yeri...",
    category: "El Sanatları",
    author: "Ayşe Yılmaz",
    date: "2026-02-15",
    readTime: "5 dk",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
  },
  {
    id: 2,
    title: "Seramik Sanatında Yeni Trendler",
    excerpt: "Modern seramik tasarımlarında geleneksel ve çağdaş tekniklerin buluşması. Fırın sıcaklıkları, sırlar ve renkler üzerine...",
    category: "Seramik",
    author: "Mehmet Demir",
    date: "2026-02-10",
    readTime: "7 dk",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 3,
    title: "Pi ile Alışverişin Geleceği",
    excerpt: "Pi Network ekosistemi büyürken e-ticaret pazarı da dijital dönüşümünü yaşıyor. Satıcılar için yeni fırsatlar...",
    category: "Pi Network",
    author: "Can Arslan",
    date: "2026-02-05",
    readTime: "4 dk",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 4,
    title: "Ahşap Oymacılığı: Sabır ve Ustalık",
    excerpt: "Türkiye'nin dört bir yanındaki ahşap ustaları ve onların vazgeçilmez aletleri. Bir ustanın gözünden ahşap işçiliği...",
    category: "El Sanatları",
    author: "Fatma Kaya",
    date: "2026-01-28",
    readTime: "6 dk",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 5,
    title: "Sürdürülebilir Moda: Etik Üretim ve Bilinçli Tüketim",
    excerpt: "Hızlı modanın yarattığı tahribata karşı, sürdürülebilir giyimin yükselişi. Bilinçli tüketim rehberi...",
    category: "Moda",
    author: "Zeynep Aydın",
    date: "2026-01-20",
    readTime: "8 dk",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 6,
    title: "Satıcılarımızla Tanışın: Ayşe Hanım Atölyesi",
    excerpt: "35 yıldır kilim dokuyan Ayşe Hanım ile atölyesinde bir gün. Başarılı bir satıcının ilham veren hikayesi...",
    category: "Satıcılar",
    author: "Editörler",
    date: "2026-01-15",
    readTime: "9 dk",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
];

const CATEGORIES = ["Tümü", "El Sanatları", "Seramik", "Pi Network", "Moda", "Satıcılar"];

const categoryColors: Record<string, string> = {
  "El Sanatları": "bg-purple-100 text-purple-800",
  "Seramik": "bg-blue-100 text-blue-800",
  "Pi Network": "bg-yellow-100 text-yellow-800",
  "Moda": "bg-pink-100 text-pink-800",
  "Satıcılar": "bg-green-100 text-green-800",
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filtered = BLOG_POSTS.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "Tümü" || post.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || activeCategory !== "Tümü" || search !== "");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="bg-secondary py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-center">Blog ve Hikayeler</h1>
          <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
            El sanatları dünyasından hikayeler, teknikler ve ilham veren içerikler
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Blog yazısı ara..."
              className="pl-10 h-11 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Kategori Filtreleri */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Öne Çıkan Yazı */}
        {featured && activeCategory === "Tümü" && search === "" && (
          <Link href={`/blog/${featured.id}`} className="block mb-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="md:flex">
                <div className="md:w-1/2 aspect-video md:aspect-auto overflow-hidden bg-muted">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="md:w-1/2 p-6 flex flex-col justify-center">
                  <Badge className="w-fit mb-3 bg-primary text-primary-foreground">Öne Çıkan</Badge>
                  <Badge className={`w-fit mb-3 text-xs ${categoryColors[featured.category] || "bg-muted text-foreground"}`}>
                    {featured.category}
                  </Badge>
                  <h2 className="font-serif text-2xl font-bold mb-3 group-hover:text-primary transition-colors text-balance">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{featured.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{featured.readTime} okuma</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(featured.date).toLocaleDateString("tr-TR")}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        )}

        {/* Blog Yazıları Grid */}
        {rest.length === 0 && filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Arama kriterinize uygun yazı bulunamadı.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("Tümü"); }}>
              Filtreyi Temizle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(search !== "" || activeCategory !== "Tümü" ? filtered : rest).map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border group h-full flex flex-col">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <Badge className={`w-fit mb-2 text-xs ${categoryColors[post.category] || "bg-muted text-foreground"}`}>
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors text-balance line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
