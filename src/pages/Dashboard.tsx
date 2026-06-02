import { useState, useMemo, useEffect } from "react";
import { Plus, Search, RefreshCw, Tv2, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSeries } from "@/hooks/useSupabase";
import { Header } from "@/components/layout/Header";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SeriesCard } from "@/components/series/SeriesCard";
import { SeriesForm } from "@/components/series/SeriesForm";
import { StatusFilter } from "@/components/series/StatusFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Series, SeriesStatus } from "@/types";
import type { SeriesFormData } from "@/lib/validations";

type FilterOption = SeriesStatus | "all";

export default function Dashboard() {
  const {
    series,
    loading,
    fetchSeries,
    addSeries,
    updateSeries,
    deleteSeries,
    incrementEpisode,
    incrementSeason,
    markAsFinished,
    getSummary,
  } = useSeries();

  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [userFullName, setUserFullName] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email);
        const name =
          data.user.user_metadata?.full_name ??
          data.user.user_metadata?.name ??
          undefined;
        setUserFullName(name as string | undefined);
      }
    });
  }, []);

  const summary = getSummary();

  const filterCounts = {
    all: series.length,
    watching: series.filter((s) => s.status === "watching").length,
    paused: series.filter((s) => s.status === "paused").length,
    finished: series.filter((s) => s.status === "finished").length,
  };

  const filteredSeries = useMemo(() => {
    let result = series;

    if (activeFilter !== "all") {
      result = result.filter((s) => s.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.platform.toLowerCase().includes(q)
      );
    }

    return result;
  }, [series, activeFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingSeries(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (s: Series) => {
    setEditingSeries(s);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: SeriesFormData): Promise<boolean> => {
    if (editingSeries) {
      return await updateSeries(editingSeries.id, data);
    }
    return await addSeries(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSeries();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userEmail={userEmail} userFullName={userFullName} />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Page title */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {userFullName ? `Olá, ${userFullName.split(" ")[0]}! 👋` : "Meu Painel"}
            </h1>
            <p className="text-sm text-slate-500">
              Gerencie suas séries e acompanhe o progresso
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Atualizar"
              className="h-9 w-9"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button onClick={handleOpenAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Série
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards summary={summary} loading={loading} />

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome ou plataforma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
            <StatusFilter
              activeFilter={activeFilter}
              onChange={setActiveFilter}
              counts={filterCounts}
            />
          </div>
        </div>

        {/* Series Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        ) : filteredSeries.length === 0 ? (
          <EmptyState
            hasSearch={!!searchQuery}
            hasFilter={activeFilter !== "all"}
            onAddNew={handleOpenAdd}
            onClearFilters={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
          />
        ) : (
          <>
            <p className="text-xs text-slate-400">
              {filteredSeries.length}{" "}
              {filteredSeries.length === 1 ? "série encontrada" : "séries encontradas"}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSeries.map((s) => (
                <SeriesCard
                  key={s.id}
                  series={s}
                  onEdit={handleOpenEdit}
                  onDelete={deleteSeries}
                  onIncrementEpisode={incrementEpisode}
                  onIncrementSeason={incrementSeason}
                  onMarkFinished={markAsFinished}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* FAB for mobile */}
      <button
        onClick={handleOpenAdd}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 active:scale-95 transition-all sm:hidden"
        aria-label="Adicionar série"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Series Form Dialog */}
      <SeriesForm
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingSeries(null);
        }}
        onSubmit={handleSubmit}
        editingSeries={editingSeries}
      />
    </div>
  );
}

interface EmptyStateProps {
  hasSearch: boolean;
  hasFilter: boolean;
  onAddNew: () => void;
  onClearFilters: () => void;
}

function EmptyState({
  hasSearch,
  hasFilter,
  onAddNew,
  onClearFilters,
}: EmptyStateProps) {
  if (hasSearch || hasFilter) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <Search className="mb-3 h-10 w-10 text-slate-300" />
        <h3 className="text-base font-semibold text-slate-700">
          Nenhuma série encontrada
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Tente ajustar os filtros ou a busca
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="mt-4"
        >
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
        <Tv2 className="h-8 w-8 text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700">
        Nenhuma série adicionada
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-400">
        Comece adicionando suas séries favoritas para acompanhar o progresso.
      </p>
      <Button onClick={onAddNew} className="mt-5 gap-2">
        <Plus className="h-4 w-4" />
        Adicionar minha primeira série
      </Button>
    </div>
  );
}
