"use client";

import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { useFollowArtisan } from "@/hooks/use-follow-artisan";
import { useToast } from "@/hooks/use-toast";

type FollowButtonProps = {
  artisanId: string;
  artisanName: string;
  size?: "sm" | "default";
};

export function FollowButton({ artisanId, artisanName, size = "sm" }: FollowButtonProps) {
  const { isFollowing, followerCount, toggle } = useFollowArtisan(artisanId);
  const { toast } = useToast();

  const handleFollow = () => {
    toggle();
    toast({
      title: isFollowing ? "Takipten Çıkıldı" : "Takip Ediliyor",
      description: isFollowing
        ? `${artisanName} takibinizden çıkarıldı.`
        : `${artisanName} artık takip ediyorsunuz. Yeni ürünlerden haberdar olacaksınız.`,
      duration: 2500,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size={size}
        variant={isFollowing ? "secondary" : "default"}
        onClick={handleFollow}
        className="gap-1.5"
      >
        {isFollowing ? (
          <>
            <UserCheck className="h-3.5 w-3.5" />
            Takip Ediliyor
          </>
        ) : (
          <>
            <UserPlus className="h-3.5 w-3.5" />
            Takip Et
          </>
        )}
      </Button>
      <span className="text-xs text-muted-foreground">{followerCount} takipçi</span>
    </div>
  );
}
