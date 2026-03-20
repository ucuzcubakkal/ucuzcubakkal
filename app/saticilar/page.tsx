"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Package, Shield, Store, TrendingUp, Filter } from "lucide-react";
import { Header } from "@/components/header";
import { VerifiedBadge } from "@/components/verified-badge";

const SELLERS = [
  { id: "s1", name: "TechStore", category: "Elektronik", bio: "Türkiye'nin en güvenilir elektronik satıcısı. 10 yıllık deneyim, 1200+ ürün çeşidi.", location: "İstanbul", products: 1243, rating: 4.9, reviews: 28750, color: "bg-blue-500", verified: true, badge: "Süper Satıcı", joinedYear: 2015, responseTime: "2 saat" },
  { id: "s2", name: "FashionHub", category: "Giyim & Moda", bio: "Güncel moda trendlerini en uygun fiyatlarla sunan güvenilir mağaza.", location: "İzmir", products: 876, rating: 4.8, reviews: 19320, color: "bg-rose-500", verified: true, badge: "Süper Satıcı", joinedYear: 2018, responseTime: "4 saat" },
  { id: "s3", name: "HomeBot", category: "Ev & Yaşam", bio: "Ev aletleri ve dekorasyon ürünlerinde uzmanlaşmış güvenilir satıcı.", location: "Ankara", products: 432, rating: 4.7, reviews: 11430, color: "bg-amber-500", verified: true, badge: "Doğrulanmış", joinedYear: 2019, responseTime: "6 saat" },
  { id: "s4", name: "SportZone", category: "Spor & Outdoor", bio: "Her bütçeye uygun spor malzemeleri ve outdoor ekipmanları.", location: "Bursa", products: 654, rating: 4.9, reviews: 15870, color: "bg-green-600", verified: true, badge: "Süper Satıcı", joinedYear: 2017, responseTime: "3 saat" },
  { id: "s5", name: "LeatherCo", category: "Aksesuar", bio: "Hakiki deri çanta, kemer ve ayakkabı. El yapımı kalite, uygun fiyat.", location: "Gaziantep", products: 287, rating: 4.8, reviews: 8920, color: "bg-brown-500 bg-orange-800", verified: true, badge: "Doğrulanmış", joinedYear: 2020, responseTime: "8 saat" },
  { id: "s6", name: "KidsToys", category: "Anne & Bebek", bio: "Çocukların sever, ebeveynler güvenir. Güvenli ve eğlenceli oyuncaklar.", location: "İstanbul", products: 521, rating: 4.9, reviews: 22140, color: "bg-pink-500", verified: true, badge: "Süper Satıcı", joinedYear: 2016, responseTime: "2 saat" },
  { id: "s7", name: "GamerZone", category: "Elektronik", bio: "Oyun donanımları ve aksesuarlarında uzman. En yeni ürünler en hızlı.", location: "Ankara", products: 398, rating: 4.7, reviews: 9870, color: "bg-purple-600", verified: false, badge: "Doğrulanmış", joinedYear: 2021, responseTime: "5 saat" },
  { id: "s8", name: "KahveDünyası", category: "Süpermarket", bio: "Türkiye'nin dört bir yanından özel kahve çeşitleri ve kahve makineleri.", location: "Trabzon", products: 143, rating: 4.8, reviews: 6540, color: "bg-stone-600", verified: true, badge: "Doğrulanmış", joinedYear: 2022, responseTime: "12 saat" },
  { id: "s9", name: "OpticPlus", category: "Aksesuar", bio: "Güneş gözlüğü ve optik çerçevelerde Türkiye'nin öncü satıcısı.", location: "İzmir", products: 312, rating: 4.7, reviews: 7320, color: "bg-cyan-600", verified: false, badge: null, joinedYear: 2021, responseTime: "6 saat" },
];

const CATEGORIES = ["Tümü", "Elektronik", "Giyim & Moda", "Ev & Yaşam", "Spor & Outdoor", "Anne & Bebek", "Aksesuar", "Süpermarket"];

export default function SaticilarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = SELLERS
    .filter((s) =>
      (category === "Tümü" || s.category === category) &&
      (!searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()) || s.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "products") return b.products - a.products;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page hero */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Satıcılar</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-5">
            Güvenilir satıcılarımızdan alışveriş yapın. Tüm satıcılarımız kimlik doğrulamasından geçmektedir.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: "Toplam Satıcı", value: "50.000+" },
              { label: "Süper Satıcı", value: "1.200+" },
              { label: "Ülke", value: "45" },
              { label: "Müşteri Memnuniyeti", value: "%98" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xl font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Satıcı adı, kategori veya şehir ara..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 h-10">
              <SelectValue placeholder="Sırala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">En Yüksek Puan</SelectItem>
              <SelectItem value="products">En Fazla Ürün</SelectItem>
              <SelectItem value="reviews">En Çok Değerlendirme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} satıcı bulundu</p>

        {/* Sellers grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Satıcı bulunamadı</h3>
            <p className="text-muted-foreground text-sm">Farklı bir arama terimi deneyin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((seller) => (
              <Link key={seller.id} href={`/satici/${seller.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-border group hover:-translate-y-0.5 h-full">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`h-14 w-14 rounded-xl ${seller.color} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
                        {seller.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">
                            {seller.name}
                          </h3>
                          <VerifiedBadge verified={seller.verified} type="kyc" size="sm" />
                        </div>
                        {seller.badge && (
                          <Badge className={`text-[10px] px-1.5 py-0 mt-0.5 ${seller.badge === "Süper Satıcı" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {seller.badge}
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{seller.category}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{seller.bio}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{seller.location}</span>
                      <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" />{seller.products.toLocaleString("tr-TR")} ürün</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{seller.joinedYear}'den beri</span>
                    </div>

                    {/* Rating & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(seller.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                          ))}
                        </div>
                        <span className="font-bold text-sm">{seller.rating}</span>
                        <span className="text-xs text-muted-foreground">({seller.reviews.toLocaleString("tr-TR")})</span>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Mağazaya Git
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Become a seller CTA */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-primary to-orange-600 p-6 text-white text-center">
          <Store className="h-8 w-8 mx-auto mb-2 opacity-80" />
          <h3 className="font-bold text-lg mb-1">Siz de Satıcı Olun</h3>
          <p className="text-sm opacity-80 mb-4 max-w-md mx-auto">Milyonlarca alıcıya ulaşın. İlk 3 ay komisyonsuz, Pi Network ile anında tahsilat.</p>
          <Link href="/basvuru">
            <Button size="sm" variant="secondary" className="text-foreground font-bold px-6">
              Hemen Başvur
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
