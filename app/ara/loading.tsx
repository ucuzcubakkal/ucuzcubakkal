import { Skeleton } from "@/components/ui/skeleton";

export default function AramaLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header placeholder */}
      <div className="h-14 border-b border-border bg-card" />

      <div className="container mx-auto px-4 py-6">
        {/* Arama kutusu */}
        <Skeleton className="h-11 w-full max-w-xl rounded-lg mb-6" />

        <div className="flex gap-6">
          {/* Filtre sidebar */}
          <div className="hidden md:block w-56 flex-shrink-0 space-y-4">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>

          {/* Sonuç grid */}
          <div className="flex-1">
            <Skeleton className="h-7 w-48 rounded mb-1" />
            <Skeleton className="h-4 w-28 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                    <div className="flex justify-between items-center pt-1">
                      <Skeleton className="h-5 w-14 rounded" />
                      <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
