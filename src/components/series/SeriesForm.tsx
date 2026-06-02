import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { seriesSchema, type SeriesFormData } from "@/lib/validations";
import { PLATFORMS } from "@/types";
import type { Series } from "@/types";

interface SeriesFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SeriesFormData) => Promise<boolean>;
  editingSeries?: Series | null;
}

export function SeriesForm({
  open,
  onClose,
  onSubmit,
  editingSeries,
}: SeriesFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SeriesFormData>({
    resolver: zodResolver(seriesSchema),
    defaultValues: {
      name: "",
      platform: "",
      status: "watching",
      season: 1,
      episode: 0,
    },
  });

  const statusValue = watch("status");
  const platformValue = watch("platform");

  useEffect(() => {
    if (open) {
      if (editingSeries) {
        reset({
          name: editingSeries.name,
          platform: editingSeries.platform,
          status: editingSeries.status,
          season: editingSeries.season,
          episode: editingSeries.episode,
        });
      } else {
        reset({
          name: "",
          platform: "",
          status: "watching",
          season: 1,
          episode: 0,
        });
      }
    }
  }, [open, editingSeries, reset]);

  const handleFormSubmit = async (data: SeriesFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {editingSeries ? "Editar Série" : "Adicionar Série"}
          </DialogTitle>
          <DialogDescription>
            {editingSeries
              ? "Atualize as informações da série."
              : "Adicione uma nova série ao seu tracker."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome da Série</Label>
            <Input
              id="name"
              placeholder="Ex: Breaking Bad"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Platform */}
          <div className="space-y-1.5">
            <Label htmlFor="platform">Plataforma</Label>
            <Select
              value={platformValue}
              onValueChange={(val) => setValue("platform", val, { shouldValidate: true })}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Selecione a plataforma" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-xs text-red-500">{errors.platform.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(val) =>
                setValue("status", val as SeriesFormData["status"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="watching">▶ Assistindo</SelectItem>
                <SelectItem value="paused">⏸ Pausada</SelectItem>
                <SelectItem value="finished">✅ Finalizada</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Season & Episode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="season">Temporada</Label>
              <Input
                id="season"
                type="number"
                min={1}
                max={99}
                {...register("season", { valueAsNumber: true })}
              />
              {errors.season && (
                <p className="text-xs text-red-500">{errors.season.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="episode">Episódio</Label>
              <Input
                id="episode"
                type="number"
                min={0}
                max={9999}
                {...register("episode", { valueAsNumber: true })}
              />
              {errors.episode && (
                <p className="text-xs text-red-500">{errors.episode.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : editingSeries
                ? "Salvar Alterações"
                : "Adicionar Série"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
