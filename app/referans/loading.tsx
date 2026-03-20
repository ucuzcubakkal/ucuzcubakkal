import { Skeleton } from "@/components/ui/skeleton";

export default function ReferansLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <Skeleton className="h-52 w-full" />

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-5">
        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-2 text-center">
              <Skeleton className="h-5 w-5 rounded mx-auto" />
              <Skeleton className="h-6 w-12 rounded mx-auto" />
              <Skeleton className="h-3 w-16 rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* Kod kartı */}
        <div className="rounded-xl border border-border p-5 space-y-3">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Nasıl çalışır */}
        <div className="rounded-xl border border-border p-5 space-y-4">
          <Skeleton className="h-5 w-28 rounded" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
