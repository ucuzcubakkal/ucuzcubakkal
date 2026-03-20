"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (error) {
        console.log("Paylaşım iptal edildi");
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Bağlantı kopyalandı",
          description: "Ürün bağlantısı panonuza kopyalandı"
        });
      } catch (error) {
        toast({
          title: "Hata",
          description: "Bağlantı kopyalanamadı",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Paylaş
    </Button>
  );
}
