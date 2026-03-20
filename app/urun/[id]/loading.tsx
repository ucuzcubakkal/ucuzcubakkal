import { ProductDetailSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-border bg-card" />
      <ProductDetailSkeleton />
    </div>
  );
}
