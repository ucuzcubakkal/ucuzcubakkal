import { Skeleton } from "@/components/ui/skeleton";

export default function SaticiLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border bg-card" />

      {/* Kapak */}
      <Skeleton className="h-40 md:h-56 w-full" />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profil kartı */}
        <div className="relative -mt-12 mb-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0 -mt-8" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-6 w-40 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              <Skeleton className="h-9 w-24 rounded-lg flex-shrink-0" />
            </div>
            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center space-y-1">
                  <Skeleton className="h-6 w-10 rounded mx-auto" />
                  <Skeleton className="h-3 w-14 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ürün grid */}
        <Skeleton className="h-6 w-32 rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
