import { Tv, Play, PauseCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SeriesSummary } from "@/types";

interface SummaryCardsProps {
  summary: SeriesSummary;
  loading: boolean;
}

const cards = [
  {
    key: "total" as const,
    label: "Total de Séries",
    icon: Tv,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    key: "watching" as const,
    label: "Assistindo",
    icon: Play,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    key: "paused" as const,
    label: "Pausadas",
    icon: PauseCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    key: "finished" as const,
    label: "Finalizadas",
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
];

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color, bg, border }) => (
        <Card
          key={key}
          className={`border ${border} transition-transform hover:scale-[1.02]`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 leading-tight">
                  {label}
                </p>
                {loading ? (
                  <div className="mt-1 h-7 w-10 animate-pulse rounded bg-slate-100" />
                ) : (
                  <p className={`mt-1 text-2xl font-bold ${color}`}>
                    {summary[key]}
                  </p>
                )}
              </div>
              <div className={`rounded-xl p-2.5 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
