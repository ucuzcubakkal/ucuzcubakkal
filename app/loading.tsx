import { ProductGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-16 border-b border-border bg-card" />
      {/* Search bar skeleton */}
      <div className="border-b border-border bg-card py-3 px-4">
        <Skeleton className="h-11 max-w-2xl mx-auto rounded-lg" />
      </div>
      {/* Hero skeleton */}
      <div className="bg-secondary py-16">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="h-5 w-2/3 max-w-sm" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Products skeleton */}
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-6 w-48 mb-5" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
