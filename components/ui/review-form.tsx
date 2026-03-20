"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { createReview } from "@/lib/services/reviews";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
  artisanId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ productId, artisanId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Hata",
        description: "Lütfen bir puan seçin",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const userId = "demo-user";
      
      await createReview({
        product_id: productId,
        user_id: userId,
        artisan_id: artisanId,
        rating,
        comment: comment.trim() || undefined
      });

      toast({
        title: "Başarılı",
        description: "Yorumunuz kaydedildi"
      });

      setRating(0);
      setComment("");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum kaydedilemedi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Değerlendirme Yap</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2 block">Puanınız</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment" className="mb-2 block">
              Yorumunuz (İsteğe bağlı)
            </Label>
            <Textarea
              id="comment"
              placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 karakter
            </p>
          </div>

          <Button type="submit" disabled={loading || rating === 0} className="w-full">
            {loading ? "Kaydediliyor..." : "Değerlendirmeyi Gönder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
