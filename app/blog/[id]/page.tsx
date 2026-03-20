"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import {
  Calendar, User, Clock, ArrowLeft, Share2,
  BookOpen, ChevronRight, Heart
} from "lucide-react";
import { useState } from "react";

const BLOG_POSTS: Record<string, {
  id: number; title: string; excerpt: string; category: string;
  author: string; authorBio: string; date: string; readTime: string;
  image: string; content: string[]; tags: string[];
  related: number[];
}> = {
  "1": {
    id: 1,
    title: "El Dokuma Kilimlerin Hikayesi",
    excerpt: "Anadolu'nun dört bir yanından gelen geleneksel kilim motifleri ve anlamları.",
    category: "El Sanatları",
    author: "Ayşe Yılmaz",
    authorBio: "15 yıldır el sanatları üzerine araştırma yapan bir etnograf.",
    date: "2026-02-15",
    readTime: "5 dk",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["kilim", "dokuma", "Anadolu", "el sanatları"],
    related: [4, 6],
    content: [
      "Anadolu kilim sanatı, binlerce yıllık bir kültürel mirasın dokusu içinde şekillenmiştir. Her bir motif, yalnızca estetik bir tercih değil; doğaya, inançlara ve günlük yaşama dair derin sembolik anlamlar taşır.",
      "Kilim dokumacılığında kullanılan yün, genellikle koyunların ilkbahar kırkımından elde edilir. Boyamada ise köklü bir geleneğe sahip bitkisel boyalar tercih edilir: ceviz kabuğu, soğan kabuğu, çivit ve kınadan elde edilen tonlar, yüzyıllar boyunca değişmez renkler olmuştur.",
      "Her bölgenin kendine özgü motifleri vardır. Konya kilimleri geometrik formlarıyla, Ege kilimleri ise çiçek motiflerinin yoğunluğuyla tanınır. Bir kilimin hangi bölgeden geldiğini, hangi ustanın elinden çıktığını bu motifler anlatır.",
      "Modern dünyada el dokuma kilimler yalnızca bir yer örtüsü değil; duvar süsü, koleksiyon parçası ve yatırım aracı haline gelmiştir. Pi Network gibi yeni nesil ödeme sistemleriyle, Anadolu'nun bu köklü sanatı artık dünyanın dört bir yanına ulaşabilmektedir.",
      "Ucuzcubakkal olarak, her kilimin arkasındaki emeğe saygı duyuyor; satıcıları ve alıcıları doğrudan buluşturuyoruz. Bir kilim satın aldığınızda, yalnızca bir ürün değil; bir hikaye, bir emek, bir kültür parçası alıyorsunuz.",
    ],
  },
  "2": {
    id: 2,
    title: "Seramik Sanatında Yeni Trendler",
    excerpt: "Modern seramik tasarımlarında geleneksel ve çağdaş tekniklerin buluşması.",
    category: "Seramik",
    author: "Mehmet Demir",
    authorBio: "İzmir'de 20 yıldır seramik atölyesi işleten bir sanatçı.",
    date: "2026-02-10",
    readTime: "7 dk",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["seramik", "çömlek", "pişirme", "tasarım"],
    related: [1, 4],
    content: [
      "Seramik, insanlığın en eski el sanatlarından biridir. Çamur, su ve ateşin birleşiminden doğan bu sanat; günümüzde hem geleneksel formlarını korumakta hem de çağdaş tasarım anlayışıyla yeniden yorumlanmaktadır.",
      "Son yıllarda wabi-sabi estetiği, seramik dünyasında büyük yankı uyandırmaktadır. Kusursuz olmayan, doğallığı ön plana çıkaran formlar; üretim bantlarının pürüzsüz ürünlerine karşı güçlü bir alternatif sunmaktadır.",
      "Fırın teknikleri de büyük bir çeşitlilik göstermektedir. Geleneksel Raku tekniği, ani sıcaklık değişimleriyle beklenmedik renk ve desen oluşturur. Soda ve odun fırını gibi yöntemler ise her parçayı biricik kılan yüzeyler ortaya çıkarır.",
      "Türkiye'nin İznik, Kütahya ve Çanakkale gibi şehirleri, özgün seramik gelenekleriyle uluslararası alanda tanınmaktadır. Bu kentlerin ustalarından alınan seramikler, dünya genelinde koleksiyonerlerin gözdeleri arasında yer almaktadır.",
      "Ucuzcubakkal'da yer alan seramik satıcılarımız, her parçayı el torna ya da elle şekillendirme yöntemiyle üretmektedir. Sipariş verirken satıcıyla doğrudan iletişim kurarak renk, boyut ve kişisel mesaj gibi tercihleri belirleyebilirsiniz.",
    ],
  },
  "3": {
    id: 3,
    title: "Pi ile Alışverişin Geleceği",
    excerpt: "Pi Network ekosistemi büyürken e-ticaret pazarı da dijital dönüşümünü yaşıyor.",
    category: "Pi Network",
    author: "Can Arslan",
    authorBio: "Blockchain teknolojileri ve merkezi olmayan ekonomiler üzerine yazan bir teknoloji gazetecisi.",
    date: "2026-02-05",
    readTime: "4 dk",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Pi Network", "blockchain", "e-ticaret", "kripto"],
    related: [5],
    content: [
      "Pi Network, 2019'da piyasaya çıktığından bu yana milyonlarca kullanıcıya ulaşmıştır. Mobil cihazlarda düşük enerji tüketimiyle madencilik yapılabilmesi, bu kripto para birimini kitlesel kullanım için cazip hale getirmiştir.",
      "Global e-ticaret pazarı, Pi'nin güçlü yönleriyle son derece iyi örtüşmektedir. Düşük işlem maliyetleri, sınır ötesi transferlerin kolaylığı ve Pi topluluğunun güçlü dayanışma kültürü; satıcıları küresel pazara taşımak için ideal bir zemin oluşturmaktadır.",
      "Geleneksel ödeme sistemleri, özellikle uluslararası alışverişlerde yüksek komisyon ve döviz kuru riskleri nedeniyle satıcıları dezavantajlı konuma sokmaktadır. Pi, bu engelleri ortadan kaldıran bir alternatif sunmaktadır.",
      "Ucuzcubakkal olarak Pi Network ile entegrasyon sürecimizde, kullanıcıların Pi cüzdanlarından doğrudan ödeme yapabilmesini hedefliyoruz. Bu entegrasyon tamamlandığında, dünyanın dört bir yanındaki satıcılara Pi ödemesi yapmak bir tıklama kadar kolay olacak.",
    ],
  },
  "4": {
    id: 4,
    title: "Ahşap Oymacılığı: Sabır ve Ustalık",
    excerpt: "Türkiye'nin dört bir yanındaki ahşap ustaları ve onların vazgeçilmez aletleri.",
    category: "El Sanatları",
    author: "Fatma Kaya",
    authorBio: "Geleneksel Türk el sanatları üzerine kitaplar yazan bir araştırmacı.",
    date: "2026-01-28",
    readTime: "6 dk",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["ahşap", "oymacılık", "mobilya", "usta"],
    related: [1, 6],
    content: [
      "Ahşap oymacılığı, Türk el sanatları geleneğinin en köklü dallarından biridir. Osmanlı döneminde camiler, saraylar ve köşkler bu sanatın en görkemli örnekleriyle süslenmiştir.",
      "Günümüz ahşap ustaları ise geleneği modern ihtiyaçlarla harmanlayarak masa, tabak, kaşık, çerçeve ve dekoratif panolar üretmektedir. Ceviz, meşe, kiraz ve elma ağacı; tercih edilen başlıca ağaç türleridir.",
      "Bir ahşap parçanın oymaya hazır hale gelmesi aylar sürebilir. Ağacın kurutulması, zımparalanması, temel formun oluşturulması ve ardından ince oyma işlemlerinin yapılması; her aşamada deneyim ve sabır gerektirmektedir.",
      "Bir ustanın elindeki kalemi izlemek, adeta meditasyon gibidir. Her vuruş hesaplıdır, her çizgi anlam taşır. Bu yüzden özenle üretilmiş ahşap ürünler; seri üretim taklitlerinden her zaman farklı ve üstün bir değer taşır.",
    ],
  },
  "5": {
    id: 5,
    title: "Sürdürülebilir Moda: Etik Üretim ve Bilinçli Tüketim",
    excerpt: "Hızlı modanın yarattığı tahribata karşı, sürdürülebilir giyimin yükselişi.",
    category: "Moda",
    author: "Zeynep Aydın",
    authorBio: "Sürdürülebilir moda üzerine içerik üreten bir moda editörü.",
    date: "2026-01-20",
    readTime: "8 dk",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["moda", "sürdürülebilir", "etik üretim", "bilinçli tüketim"],
    related: [3],
    content: [
      "Hızlı moda endüstrisi, her yıl milyonlarca ton tekstil atığı üretmekte ve küresel su kaynaklarını ciddi ölçüde kirletmektedir. Bu tabloya karşı giderek güçlenen bir akım yükselmektedir: yavaş moda ve etik üretim.",
      "Özenle üretilmiş bir gömlek ya da kazak; yalnızca estetik bir tercih değil, aynı zamanda çevresel bir sorumluluk bilincidir. Her parça, gerçek bir insanın emeğiyle, düşünerek ve özenle üretilmektedir.",
      "Türkiye, keten, pamuk ve ipek gibi doğal liflerin zengin üretim geçmişiyle etik giyim için güçlü bir satıcı tabanına sahiptir. Ege'nin keten kumaşları, Bursa'nın ipeği ve Doğu Anadolu'nun yünü; bu mirası canlı tutan başlıca kaynaklardır.",
      "Ucuzcubakkal'da moda kategorisinde yer alan satıcılar, siparişe özel üretim yapmaktadır. Beden, renk, desen ve kumaş gibi detaylar; alıcı ile satıcı arasındaki doğrudan iletişimle belirlenmektedir. Bu yaklaşım hem israfı önler hem de her parçayı gerçek anlamda kişiye özel kılar.",
    ],
  },
  "6": {
    id: 6,
    title: "Satıcılarımızla Tanışın: Ayşe Hanım Atölyesi",
    excerpt: "35 yıldır kilim dokuyan Ayşe Hanım ile atölyesinde bir gün.",
    category: "Satıcılar",
    author: "Editörler",
    authorBio: "Ucuzcubakkal editör ekibi.",
    date: "2026-01-15",
    readTime: "9 dk",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["satıcı", "kilim", "atölye", "röportaj"],
    related: [1, 4],
    content: [
      "Konya'nın Karatay ilçesinde, dar bir sokağın köşesindeki atölye; dışarıdan sıradan görünse de içine girildiğinde renkli iplikler ve ahşap dokuma tezgahlarıyla bambaşka bir dünyaya açılır.",
      "Ayşe Hanım, 12 yaşında annesinin yanında öğrendiği kilim dokumacılığını bugün de aynı tutkuyla sürdürmektedir. 35 yılda ürettiği kilimlerin bir kısmı Türkiye'de özel koleksiyonlarda, bir kısmı ise yurt dışında müzelerde sergilenmektedir.",
      "Bir kilimi tamamlamak haftalar, bazen aylar sürer. Tasarımı kafasında olan Ayşe Hanım, kağıda çizmez; doğrudan tezgaha geçer. Her motifi ezberden dokar, her rengi kendi elleriyle boyadığı ipliklerden seçer.",
      "Platformumuza katılmadan önce ürünlerini yalnızca yerel pazara satan Ayşe Hanım, artık sipariş aldığında mutlu bir şaşkınlık yaşıyor: 'Japonya'dan sipariş geldi deyince inanamadım. Kilimim okyanus aştı.' Bu sözler, Ucuzcubakkal'ın neden var olduğunu en iyi özetleyen cümlelerden biri.",
      "Ayşe Hanım'ın eserlerini görmek ve sipariş vermek için mağaza profilini ziyaret edebilirsiniz. Her satın alma, 35 yıllık bir ustanın emeğini doğrudan desteklemek demektir.",
    ],
  },
};

const categoryColors: Record<string, string> = {
  "El Sanatları": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "Seramik": "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "Pi Network": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Moda": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "Satıcılar": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const ALL_POSTS_BRIEF = [
  { id: 1, title: "El Dokuma Kilimlerin Hikayesi", category: "El Sanatları", readTime: "5 dk" },
  { id: 2, title: "Seramik Sanatında Yeni Trendler", category: "Seramik", readTime: "7 dk" },
  { id: 3, title: "Pi ile Alışverişin Geleceği", category: "Pi Network", readTime: "4 dk" },
  { id: 4, title: "Ahşap Oymacılığı: Sabır ve Ustalık", category: "El Sanatları", readTime: "6 dk" },
  { id: 5, title: "Sürdürülebilir Moda: Etik Üretim", category: "Moda", readTime: "8 dk" },
  { id: 6, title: "Satıcılarımızla Tanışın: Ayşe Hanım", category: "Satıcılar", readTime: "9 dk" },
];

export default function BlogDetailPage() {
  const { id } = useParams();
  const post = BLOG_POSTS[String(id)];
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 80) + 20);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack title="Blog" />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <BookOpen className="h-16 w-16 text-muted-foreground opacity-40 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Yazı bulunamadı</h2>
          <p className="text-muted-foreground mb-6">Bu blog yazısı mevcut değil veya kaldırılmış.</p>
          <Link href="/blog"><Button>Blog'a Dön</Button></Link>
        </div>
      </div>
    );
  }

  const relatedPosts = ALL_POSTS_BRIEF.filter((p) => post.related.includes(p.id));

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => prev ? c - 1 : c + 1);
      return !prev;
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  // Okuma süresi ve karakter sayısına göre progress
  const wordCount = post.content.join(" ").split(" ").length;

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title="Blog" />

      {/* Kapak Görseli */}
      <div className="relative aspect-[21/9] md:aspect-[3/1] bg-muted overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Badge className={`mb-3 border-0 ${categoryColors[post.category] || "bg-muted text-foreground"}`}>
            {post.category}
          </Badge>
          <h1 className="font-serif text-2xl md:text-4xl font-bold text-balance leading-tight max-w-3xl">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {/* Yazar ve Meta Bilgileri */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {post.author[0]}
            </div>
            <div>
              <p className="font-semibold text-sm">{post.author}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} okuma
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {wordCount} kelime
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 ${liked ? "text-rose-500" : ""}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* İçerik */}
        <article className="prose prose-neutral dark:prose-invert max-w-none mb-10">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-foreground mb-5 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* Etiketler */}
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Yazar Kartı */}
        <Card className="mb-8">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg flex-shrink-0">
              {post.author[0]}
            </div>
            <div>
              <p className="font-semibold mb-1 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {post.author}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.authorBio}</p>
            </div>
          </CardContent>
        </Card>

        {/* İlgili Yazılar */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-bold mb-4">İlgili Yazılar</h2>
            <div className="space-y-3">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-border group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <Badge className={`text-xs border-0 mb-1.5 ${categoryColors[rp.category] || "bg-muted"}`}>
                          {rp.category}
                        </Badge>
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">
                          {rp.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> {rp.readTime} okuma
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog'a Dön */}
        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Tüm Yazılara Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
