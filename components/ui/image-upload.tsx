"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
};

export function ImageUpload({ value, onChange, maxImages = 5, label = "Fotoğraf Ekle" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = maxImages - value.length;
      if (remaining <= 0) {
        toast({ title: "Limit Aşıldı", description: `En fazla ${maxImages} fotoğraf yükleyebilirsiniz.`, variant: "destructive" });
        return;
      }

      const validFiles = Array.from(files).slice(0, remaining).filter((f) => {
        if (!f.type.startsWith("image/")) {
          toast({ title: "Geçersiz Dosya", description: "Sadece resim dosyası yükleyebilirsiniz.", variant: "destructive" });
          return false;
        }
        if (f.size > 5 * 1024 * 1024) {
          toast({ title: "Dosya Çok Büyük", description: `${f.name} 5MB sınırını aşıyor.`, variant: "destructive" });
          return false;
        }
        return true;
      });

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          onChange([...value, url]);
        };
        reader.readAsDataURL(file);
      });
    },
    [value, onChange, maxImages, toast]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Mevcut Resimler */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
              <img src={url} alt={`Ürün ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Kapak
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Yükleme Alanı */}
      {value.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">
            Sürükle bırak veya tıkla &bull; Maks. 5MB &bull; {value.length}/{maxImages}
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-3 gap-2">
            <Upload className="h-3.5 w-3.5" />
            Dosya Seç
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
      />
    </div>
  );
}
