"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "followed_artisans";

export function useFollowArtisan(artisanId: string) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const followed: string[] = raw ? JSON.parse(raw) : [];
    setIsFollowing(followed.includes(artisanId));
    // Simüle edilmiş takipçi sayısı
    setFollowerCount(Math.floor(Math.random() * 900) + 100);
  }, [artisanId]);

  const toggle = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const followed: string[] = raw ? JSON.parse(raw) : [];
    let updated: string[];
    if (followed.includes(artisanId)) {
      updated = followed.filter((id) => id !== artisanId);
      setFollowerCount((c) => c - 1);
      setIsFollowing(false);
    } else {
      updated = [...followed, artisanId];
      setFollowerCount((c) => c + 1);
      setIsFollowing(true);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { isFollowing, followerCount, toggle };
}
