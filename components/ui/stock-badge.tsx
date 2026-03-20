"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type Props = {
  stock: number;
  className?: string;
};

export function StockBadge({ stock, className = "" }: Props) {
  if (stock === 0) {
    return (
      <div className={`flex items-center gap-1.5 text-destructive text-sm font-medium ${className}`}>
        <XCircle className="h-4 w-4" />
        <span>Tükendi</span>
      </div>
    );
  }

  if (stock <= 3) {
    return (
      <div className={`flex items-center gap-1.5 text-orange-500 text-sm font-medium ${className}`}>
        <AlertTriangle className="h-4 w-4" />
        <span>Son {stock} ürün kaldı!</span>
      </div>
    );
  }

  if (stock <= 10) {
    return (
      <div className={`flex items-center gap-1.5 text-green-600 text-sm font-medium ${className}`}>
        <CheckCircle className="h-4 w-4" />
        <span>Stokta {stock} adet</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-green-600 text-sm font-medium ${className}`}>
      <CheckCircle className="h-4 w-4" />
      <span>Stokta var</span>
    </div>
  );
}
