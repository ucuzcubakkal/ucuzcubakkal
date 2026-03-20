"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImagePlus, Video, Play, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type MediaUploadValue = {
  images: string[];   // base64 ya da URL — min 1 maks 6
  video: string | null; // base64 — maks 15 sn, maks ~15MB
};

type MediaUploadProps = {
  value: MediaUploadValue;
  onChange: (val: MediaUploadValue) => void;
};

const MAX_IMAGES = 6;
const MAX_IMG_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_VIDEO_DURATION_S = 15;
const MIN_IMG_WIDTH = 1080;
const MIN_IMG_HEIGHT = 1080;

export function MediaUpload({ value, onChange }: MediaUploadProps) {
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const [isDraggingVid, setIsDraggingVid] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // ── Resim işleme ─────────────────────────────────────────────────
  const processImages = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = MAX_IMAGES - value.images.length;
      if (remaining <= 0) {
        toast({ title: "Limit aşıldı", description: `En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz.`, variant: "destructive" });
        return;
      }
      const accepted = Array.from(files).slice(0, remaining).filter((f) => {
        if (!f.type.startsWith("image/")) {
          toast({ title: "Geçersiz dosya", description: `${f.name} bir resim dosyası değil.`, variant: "destructive" });
          return false;
        }
        if (f.size > MAX_IMG_SIZE_MB * 1024 * 1024) {
          toast({ title: "Dosya çok büyük", description: `${f.name} — maks ${MAX_IMG_SIZE_MB}MB.`, variant: "destructive" });
          return false;
        }
        return true;
      });
      accepted.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          // Çözünürlük kontrolü — min 1080x1080 px
          const img = new Image();
          img.onload = () => {
            if (img.width < MIN_IMG_WIDTH || img.height < MIN_IMG_HEIGHT) {
              toast({
                title: "Fotoğraf çözünürlüğü yetersiz",
                description: `${file.name} — Minimum ${MIN_IMG_WIDTH}x${MIN_IMG_HEIGHT}px olmalıdır. Yüklenen: ${img.width}x${img.height}px.`,
                variant: "destructive",
              });
              return;
            }
            onChange({ ...value, images: [...value.images, url] });
          };
          img.src = url;
        };
        reader.readAsDataURL(file);
      });
    },
    [value, onChange, toast]
  );

  const removeImage = (idx: number) => {
    onChange({ ...value, images: value.images.filter((_, i) => i !== idx) });
  };

  const setCover = (idx: number) => {
    const imgs = [...value.images];
    const [item] = imgs.splice(idx, 1);
    imgs.unshift(item);
    onChange({ ...value, images: imgs });
    toast({ title: "Kapak fotoğrafı güncellendi", duration: 1500 });
  };

  // ── Video işleme ─────────────────────────────────────────────────
  const processVideo = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("video/")) {
        toast({ title: "Geçersiz dosya", description: "Lütfen bir video dosyası seçin (mp4, mov, webm).", variant: "destructive" });
        return;
      }
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        toast({ title: "Video çok büyük", description: `Maks ${MAX_VIDEO_SIZE_MB}MB yükleyebilirsiniz.`, variant: "destructive" });
        return;
      }

      setVideoLoading(true);
      const url = URL.createObjectURL(file);
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.src = url;
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (videoEl.duration > MAX_VIDEO_DURATION_S) {
          setVideoLoading(false);
          toast({
            title: "Video çok uzun",
            description: `Yüklediğiniz video ${videoEl.duration.toFixed(1)} sn. Maks ${MAX_VIDEO_DURATION_S} sn olmalı.`,
            variant: "destructive",
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange({ ...value, video: e.target?.result as string });
          setVideoLoading(false);
          toast({ title: "Video yüklendi", description: `${videoEl.duration.toFixed(1)} sn — onay bekliyor.`, duration: 2500 });
        };
        reader.readAsDataURL(file);
      };
      videoEl.onerror = () => {
        setVideoLoading(false);
        URL.revokeObjectURL(url);
        toast({ title: "Video okunamadı", description: "Farklı bir format deneyin.", variant: "destructive" });
      };
    },
    [value, onChange, toast]
  );

  return (
    <div className="space-y-5">
      {/* ── Resimler ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">
            Ürün Fotoğrafları
            <span className="ml-1 text-muted-foreground font-normal text-xs">(en az 1, en fazla 6)</span>
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            value.images.length === 0 ? "bg-destructive/10 text-destructive" :
            value.images.length >= MAX_IMAGES ? "bg-primary/10 text-primary" :
            "bg-muted text-muted-foreground"
          }`}>
            {value.images.length}/{MAX_IMAGES}
          </span>
        </div>

        {/* Mevcut resimler */}
        {value.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {value.images.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border group">
                <img src={url} alt={`Resim ${i + 1}`} className="w-full h-full object-cover" />
                {/* Kapak etiketi */}
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center bg-primary text-primary-foreground text-[9px] font-bold py-0.5">
                    KAPAK
                  </span>
                )}
                {/* Hover aksiyonlar */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => setCover(i)}
                      title="Kapak yap"
                      className="bg-white/90 text-foreground rounded-full p-1 hover:bg-white transition-colors"
                    >
                      <Star className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    title="Sil"
                    className="bg-destructive text-white rounded-full p-1 hover:bg-destructive/80 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Yükleme alanı */}
        {value.images.length < MAX_IMAGES && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingImg(true); }}
            onDragLeave={() => setIsDraggingImg(false)}
            onDrop={(e) => { e.preventDefault(); setIsDraggingImg(false); processImages(e.dataTransfer.files); }}
            onClick={() => imgRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              isDraggingImg ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            <ImagePlus className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Fotoğraf Ekle</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sürükle & bırak ya da tıkla &bull; JPG, PNG, WEBP &bull; Maks {MAX_IMG_SIZE_MB}MB
            </p>
            <p className="text-xs text-amber-600 font-medium mt-1">
              Min. {MIN_IMG_WIDTH}x{MIN_IMG_HEIGHT}px &bull; Beyaz/gri arka plan tercih edilir
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-3 gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Dosya Seç
            </Button>
          </div>
        )}
        <input ref={imgRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => processImages(e.target.files)} />
      </div>

      {/* ── Video ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">
            Ürün Videosu
            <span className="ml-1 text-muted-foreground font-normal text-xs">(isteğe bağlı, maks 15 sn)</span>
          </p>
          {value.video && (
            <button
              type="button"
              onClick={() => onChange({ ...value, video: null })}
              className="text-xs text-destructive hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Videoyu Kaldır
            </button>
          )}
        </div>

        {value.video ? (
          <div className="relative rounded-xl overflow-hidden border border-border bg-black aspect-video max-h-48">
            <video
              src={value.video}
              controls
              className="w-full h-full object-contain"
            />
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              VIDEO
            </span>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingVid(true); }}
            onDragLeave={() => setIsDraggingVid(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingVid(false);
              processVideo(e.dataTransfer.files?.[0]);
            }}
            onClick={() => !videoLoading && vidRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              isDraggingVid ? "border-primary bg-primary/5" :
              videoLoading ? "border-border opacity-60 cursor-wait" :
              "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            {videoLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Video isleniyor...</p>
              </div>
            ) : (
              <>
                <Video className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Video Yükle</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  MP4, MOV, WEBM &bull; Maks {MAX_VIDEO_SIZE_MB}MB &bull; En fazla {MAX_VIDEO_DURATION_S} saniye
                </p>
                <Button type="button" variant="outline" size="sm" className="mt-3 gap-1.5">
                  <Play className="h-3.5 w-3.5" />
                  Video Seç
                </Button>
              </>
            )}
          </div>
        )}
        <input ref={vidRef} type="file" accept="video/mp4,video/mov,video/quicktime,video/webm" className="hidden"
          onChange={(e) => processVideo(e.target.files?.[0])} />
      </div>
    </div>
  );
}
