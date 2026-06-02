import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import type { Series, SeriesSummary } from "@/types";
import type { SeriesFormData } from "@/lib/validations";

export function useSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setSeries(data ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar séries";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const addSeries = useCallback(
    async (formData: SeriesFormData): Promise<boolean> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Usuário não autenticado");

        const { error } = await supabase.from("series").insert({
          ...formData,
          user_id: userData.user.id,
        });

        if (error) throw error;
        toast.success("Série adicionada com sucesso!");
        await fetchSeries();
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao adicionar série";
        toast.error(msg);
        return false;
      }
    },
    [fetchSeries]
  );

  const updateSeries = useCallback(
    async (id: string, formData: Partial<SeriesFormData>): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from("series")
          .update(formData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Série atualizada com sucesso!");
        await fetchSeries();
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atualizar série";
        toast.error(msg);
        return false;
      }
    },
    [fetchSeries]
  );

  const deleteSeries = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase.from("series").delete().eq("id", id);
        if (error) throw error;
        toast.success("Série removida com sucesso!");
        await fetchSeries();
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao remover série";
        toast.error(msg);
        return false;
      }
    },
    [fetchSeries]
  );

  const incrementEpisode = useCallback(
    async (s: Series): Promise<void> => {
      try {
        const { error } = await supabase
          .from("series")
          .update({ episode: s.episode + 1 })
          .eq("id", s.id);

        if (error) throw error;
        setSeries((prev) =>
          prev.map((item) =>
            item.id === s.id ? { ...item, episode: item.episode + 1 } : item
          )
        );
        toast.success(`+1 episódio em "${s.name}"`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atualizar episódio";
        toast.error(msg);
      }
    },
    []
  );

  const incrementSeason = useCallback(
    async (s: Series): Promise<void> => {
      try {
        const { error } = await supabase
          .from("series")
          .update({ season: s.season + 1, episode: 0 })
          .eq("id", s.id);

        if (error) throw error;
        setSeries((prev) =>
          prev.map((item) =>
            item.id === s.id
              ? { ...item, season: item.season + 1, episode: 0 }
              : item
          )
        );
        toast.success(`Avançou para Temporada ${s.season + 1} em "${s.name}"`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atualizar temporada";
        toast.error(msg);
      }
    },
    []
  );

  const markAsFinished = useCallback(
    async (s: Series): Promise<void> => {
      try {
        const { error } = await supabase
          .from("series")
          .update({ status: "finished", episode: 0 })
          .eq("id", s.id);

        if (error) throw error;
        setSeries((prev) =>
          prev.map((item) =>
            item.id === s.id
              ? { ...item, status: "finished", episode: 0 }
              : item
          )
        );
        toast.success(`"${s.name}" marcada como finalizada! 🎉`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao finalizar série";
        toast.error(msg);
      }
    },
    []
  );

  const getSummary = useCallback((): SeriesSummary => {
    return {
      total: series.length,
      watching: series.filter((s) => s.status === "watching").length,
      paused: series.filter((s) => s.status === "paused").length,
      finished: series.filter((s) => s.status === "finished").length,
    };
  }, [series]);

  return {
    series,
    loading,
    error,
    fetchSeries,
    addSeries,
    updateSeries,
    deleteSeries,
    incrementEpisode,
    incrementSeason,
    markAsFinished,
    getSummary,
  };
}
