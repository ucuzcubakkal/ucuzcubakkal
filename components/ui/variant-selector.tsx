"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Variant = {
  label: string;
  value: string;
  available: boolean;
  colorCode?: string;
};

type VariantGroup = {
  name: string;
  type: "color" | "size" | "material";
  variants: Variant[];
};

type Props = {
  groups: VariantGroup[];
  onChange?: (selections: Record<string, string>) => void;
};

export function VariantSelector({ groups, onChange }: Props) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const select = (groupName: string, value: string) => {
    const updated = { ...selections, [groupName]: value };
    setSelections(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.name}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold">{group.name}</span>
            {selections[group.name] && (
              <span className="text-sm text-muted-foreground">: {selections[group.name]}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.variants.map((variant) => {
              const isSelected = selections[group.name] === variant.value;
              if (group.type === "color" && variant.colorCode) {
                return (
                  <button
                    key={variant.value}
                    onClick={() => variant.available && select(group.name, variant.value)}
                    title={variant.label}
                    disabled={!variant.available}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      isSelected ? "border-primary scale-110" : "border-transparent",
                      !variant.available && "opacity-40 cursor-not-allowed"
                    )}
                    style={{ backgroundColor: variant.colorCode }}
                  />
                );
              }
              return (
                <button
                  key={variant.value}
                  onClick={() => variant.available && select(group.name, variant.value)}
                  disabled={!variant.available}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50",
                    !variant.available && "opacity-40 cursor-not-allowed line-through"
                  )}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
