import { Skeleton } from "@/components/ui/skeleton";

export default function IadeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border bg-card" />

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-5">
        {/* Süreç adımları */}
        <div className="rounded-xl border border-border p-5">
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Uyarı notu */}
        <Skeleton className="h-20 w-full rounded-xl" />

        {/* Sipariş seçimi */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <Skeleton className="h-5 w-32 rounded" />
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
