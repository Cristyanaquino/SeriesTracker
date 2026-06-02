import { useState } from "react";
import {
  Tv,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronsRight,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Series } from "@/types";
import { STATUS_LABELS } from "@/types";

interface SeriesCardProps {
  series: Series;
  onEdit: (series: Series) => void;
  onDelete: (id: string) => Promise<boolean>;
  onIncrementEpisode: (series: Series) => Promise<void>;
  onIncrementSeason: (series: Series) => Promise<void>;
  onMarkFinished: (series: Series) => Promise<void>;
}

export function SeriesCard({
  series,
  onEdit,
  onDelete,
  onIncrementEpisode,
  onIncrementSeason,
  onMarkFinished,
}: SeriesCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statusVariantMap: Record<
    Series["status"],
    "watching" | "paused" | "finished"
  > = {
    watching: "watching",
    paused: "paused",
    finished: "finished",
  };

  const formatProgress = () => {
    const s = String(series.season).padStart(2, "0");
    const e = String(series.episode).padStart(2, "0");
    return `S${s}E${e}`;
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(series.id);
    setDeleting(false);
  };

  const handleIncrementEpisode = async () => {
    setUpdating(true);
    await onIncrementEpisode(series);
    setUpdating(false);
  };

  const handleIncrementSeason = async () => {
    setUpdating(true);
    await onIncrementSeason(series);
    setUpdating(false);
  };

  const handleMarkFinished = async () => {
    setUpdating(true);
    await onMarkFinished(series);
    setUpdating(false);
  };

  const platformColors: Record<string, string> = {
    Netflix: "bg-red-50 text-red-600",
    "Prime Video": "bg-sky-50 text-sky-600",
    "Disney+": "bg-blue-50 text-blue-600",
    "HBO Max": "bg-purple-50 text-purple-700",
    "Apple TV+": "bg-slate-50 text-slate-700",
    "Paramount+": "bg-indigo-50 text-indigo-600",
    Globoplay: "bg-orange-50 text-orange-600",
    Crunchyroll: "bg-orange-50 text-orange-500",
    "Star+": "bg-blue-50 text-blue-500",
    Peacock: "bg-green-50 text-green-600",
    Hulu: "bg-green-50 text-green-500",
  };

  const platformColor =
    platformColors[series.platform] ?? "bg-slate-50 text-slate-600";

  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200 border-slate-200">
      {/* Status bar */}
      <div
        className={`h-1 w-full ${
          series.status === "watching"
            ? "bg-emerald-400"
            : series.status === "paused"
            ? "bg-amber-400"
            : "bg-blue-400"
        }`}
      />

      <CardContent className="flex flex-col gap-3 p-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <Tv className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3
                className="font-semibold text-slate-900 leading-tight truncate max-w-[160px]"
                title={series.name}
              >
                {series.name}
              </h3>
              <span
                className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${platformColor}`}
              >
                {series.platform}
              </span>
            </div>
          </div>
          <Badge variant={statusVariantMap[series.status]} className="shrink-0">
            {STATUS_LABELS[series.status]}
          </Badge>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PlayCircle className="h-4 w-4 text-slate-400" />
            <span className="text-xl font-bold text-slate-800 tracking-tight font-mono">
              {formatProgress()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>T{series.season}</span>
            <span>·</span>
            <span>Ep {series.episode}</span>
          </div>
        </div>

        {/* Quick Actions */}
        {series.status !== "finished" && (
          <div className="flex items-center gap-1.5">
            <Button
              size="xs"
              variant="secondary"
              className="flex-1 text-xs gap-1"
              disabled={updating}
              onClick={handleIncrementEpisode}
              title="Próximo episódio"
            >
              <ChevronRight className="h-3 w-3" />
              +1 Ep
            </Button>
            <Button
              size="xs"
              variant="secondary"
              className="flex-1 text-xs gap-1"
              disabled={updating}
              onClick={handleIncrementSeason}
              title="Próxima temporada"
            >
              <ChevronsRight className="h-3 w-3" />
              +1 Temp
            </Button>
            <Button
              size="xs"
              variant="secondary"
              className="flex-1 text-xs gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              disabled={updating}
              onClick={handleMarkFinished}
              title="Marcar como finalizada"
            >
              <CheckCircle2 className="h-3 w-3" />
              Finalizar
            </Button>
          </div>
        )}

        {series.status === "finished" && (
          <div className="flex items-center justify-center gap-1.5 rounded-md bg-blue-50 py-1.5 text-xs text-blue-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Série Finalizada
          </div>
        )}

        {/* Edit / Delete */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
          <Button
            size="xs"
            variant="ghost"
            className="flex-1 text-xs text-slate-600"
            onClick={() => onEdit(series)}
          >
            <Pencil className="h-3 w-3" />
            Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="xs"
                variant="ghost"
                className="flex-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                disabled={deleting}
              >
                <Trash2 className="h-3 w-3" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir série?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir{" "}
                  <strong>"{series.name}"</strong>? Esta ação não pode ser
                  desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
