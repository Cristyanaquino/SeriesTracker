import { cn } from "@/lib/utils";
import type { SeriesStatus } from "@/types";

type FilterOption = SeriesStatus | "all";

interface StatusFilterProps {
  activeFilter: FilterOption;
  onChange: (filter: FilterOption) => void;
  counts: {
    all: number;
    watching: number;
    paused: number;
    finished: number;
  };
}

const filters: { value: FilterOption; label: string; emoji: string }[] = [
  { value: "all", label: "Todas", emoji: "🎬" },
  { value: "watching", label: "Assistindo", emoji: "▶️" },
  { value: "paused", label: "Pausadas", emoji: "⏸" },
  { value: "finished", label: "Finalizadas", emoji: "✅" },
];

export function StatusFilter({
  activeFilter,
  onChange,
  counts,
}: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const count = counts[f.value];
        const isActive = activeFilter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
              isActive
                ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"
            )}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
            <span
              className={cn(
                "ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
