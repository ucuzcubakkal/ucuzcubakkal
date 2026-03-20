import { Skeleton } from "@/components/ui/skeleton";

export default function PuanlarLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border bg-card" />

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-5">
        {/* İstatistik üçlü */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-2 text-center">
              <Skeleton className="h-5 w-5 rounded mx-auto" />
              <Skeleton className="h-6 w-12 rounded mx-auto" />
              <Skeleton className="h-3 w-16 rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* Puan hero */}
        <Skeleton className="h-48 w-full rounded-xl" />

        {/* Nasıl puan kazanılır */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <Skeleton className="h-5 w-40 rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Ödüller */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <Skeleton className="h-5 w-36 rounded" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
