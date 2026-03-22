"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon, Plus, Trash2, Edit, GripVertical, FileText, Eye, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  active: boolean;
  color: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  status: "taslak" | "yayinda";
  date: string;
}

const INIT_BANNERS: Banner[] = [
  { id: "B1", title: "Pi ile Alışverişin Tadını Çıkar", subtitle: "Binlerce özgün ürün, tek tıkla sipariş", cta: "Keşfet", active: true,  color: "#f27a1a" },
  { id: "B2", title: "Satıcı Ol, Kazan",                subtitle: "El emeğini dünyaya sun",              cta: "Başvur",  active: false, color: "#3b82f6" },
  { id: "B3", title: "Bahar Fırsatları",                  subtitle: "Seçili ürünlerde %20 indirim",        cta: "Fırsatlar",active: true, color: "#10b981" },
];

const INIT_POSTS: BlogPost[] = [
  { id: "P1", title: "Pi Network ile Güvenli Alışveriş", excerpt: "Pi ile nasıl ödeme yapılır?", status: "yayinda", date: "2026-03-10" },
  { id: "P2", title: "Satıcı Olmanın Avantajları",       excerpt: "Zanaatkarlar için rehber.",    status: "taslak",  date: "2026-03-08" },
];

export function AdminContentManager() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(INIT_BANNERS);
  const [posts, setPosts] = useState<BlogPost[]>(INIT_POSTS);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<"banners" | "blog">("banners");

  const toggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast({ title: "Banner guncellendi", duration: 2000 });
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    toast({ title: "Banner silindi", duration: 2000 });
  };

  const publishPost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "yayinda" } : p));
    toast({ title: "Icerik yayinlandi", duration: 2000 });
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Yazi silindi", duration: 2000 });
  };

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex border border-border rounded-xl overflow-hidden w-fit text-sm">
        <button onClick={() => setActiveTab("banners")}
          className={`px-4 py-2 flex items-center gap-2 transition-colors ${activeTab === "banners" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
          <ImageIcon className="h-3.5 w-3.5" /> Ana Sayfa Banners
        </button>
        <button onClick={() => setActiveTab("blog")}
          className={`px-4 py-2 flex items-center gap-2 transition-colors ${activeTab === "blog" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
          <FileText className="h-3.5 w-3.5" /> Blog & Duyurular
        </button>
      </div>

      {activeTab === "banners" && (
        <Card className="border shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Banner Yoneticisi</CardTitle>
                <CardDescription className="text-xs">Aktif bannerlar ana sayfada gosterilir</CardDescription>
              </div>
              <Button size="sm" className="h-8 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Yeni Banner
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {banners.map(banner => (
              <div key={banner.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: banner.color + "20", border: `2px solid ${banner.color}` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: banner.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{banner.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{banner.subtitle}</p>
                </div>
                <Badge className="text-xs flex-shrink-0" style={{ backgroundColor: banner.color + "20", color: banner.color, border: `1px solid ${banner.color}40` }}>
                  {banner.cta}
                </Badge>
                <Switch checked={banner.active} onCheckedChange={() => toggleBanner(banner.id)} />
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteBanner(banner.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "blog" && (
        <div className="space-y-4">
          <Card className="border shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Blog Yazilari & Duyurular</CardTitle>
                  <CardDescription className="text-xs">Yayindaki yazilar ana sayfada ve SEO'da gosterilir</CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setEditPost({ id: "", title: "", excerpt: "", status: "taslak", date: new Date().toISOString().slice(0, 10) })}>
                  <Plus className="h-3.5 w-3.5" /> Yeni Yazi
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts.map(post => (
                <div key={post.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.excerpt} · {post.date}</p>
                  </div>
                  <Badge className={`text-xs flex-shrink-0 ${post.status === "yayinda" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {post.status}
                  </Badge>
                  <div className="flex gap-1 flex-shrink-0">
                    {post.status === "taslak" && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-green-600" onClick={() => publishPost(post.id)}>
                        <Eye className="h-3 w-3" /> Yayinla
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditPost(post)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => deletePost(post.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {editPost !== null && (
            <Card className="border border-primary/30 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{editPost.id ? "Duzenle" : "Yeni Yazi"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Baslik</Label>
                  <Input className="h-9 text-sm" value={editPost.title} onChange={e => setEditPost({ ...editPost, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Icerik / Ozet</Label>
                  <Textarea className="text-sm resize-none" rows={4} value={editPost.excerpt} onChange={e => setEditPost({ ...editPost, excerpt: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1.5" onClick={() => {
                    if (editPost.id) {
                      setPosts(prev => prev.map(p => p.id === editPost.id ? editPost : p));
                    } else {
                      setPosts(prev => [...prev, { ...editPost, id: `P${Date.now()}` }]);
                    }
                    setEditPost(null);
                    toast({ title: "Yazi kaydedildi", duration: 2000 });
                  }}>
                    <Save className="h-3.5 w-3.5" /> Kaydet
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditPost(null)}>Iptal</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
