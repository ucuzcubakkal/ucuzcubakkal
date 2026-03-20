import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetayLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border bg-card" />

      {/* Kapak görseli */}
      <Skeleton className="aspect-[21/9] md:aspect-[3/1] w-full" />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Yazar meta */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-44 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-14 rounded-lg" />
            <Skeleton className="h-8 w-10 rounded-lg" />
          </div>
        </div>

        {/* İçerik paragraflar */}
        <div className="space-y-4 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className={`h-4 rounded ${i % 2 === 0 ? "w-3/4" : "w-5/6"}`} />
            </div>
          ))}
        </div>

        {/* Etiketler */}
        <div className="flex gap-2 mb-8 pb-8 border-b border-border">
          {[60, 80, 50, 70].map((w, i) => (
            <Skeleton key={i} className={`h-6 w-${w === 60 ? "16" : w === 80 ? "20" : w === 50 ? "14" : "18"} rounded-full`} />
          ))}
        </div>

        {/* Yazar kartı */}
        <div className="rounded-xl border border-border p-5 flex items-start gap-4 mb-8">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
          </div>
        </div>

        {/* İlgili yazılar */}
        <Skeleton className="h-6 w-36 rounded mb-4" />
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border border-border p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
