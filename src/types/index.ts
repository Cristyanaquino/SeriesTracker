export type SeriesStatus = "watching" | "paused" | "finished";

export interface Series {
  id: string;
  user_id: string;
  name: string;
  platform: string;
  season: number;
  episode: number;
  status: SeriesStatus;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  created_at: string;
}

export interface SeriesSummary {
  total: number;
  watching: number;
  paused: number;
  finished: number;
}

export const STATUS_LABELS: Record<SeriesStatus, string> = {
  watching: "Assistindo",
  paused: "Pausada",
  finished: "Finalizada",
};

export const STATUS_COLORS: Record<SeriesStatus, string> = {
  watching: "bg-emerald-100 text-emerald-700 border-emerald-200",
  paused: "bg-amber-100 text-amber-700 border-amber-200",
  finished: "bg-blue-100 text-blue-700 border-blue-200",
};

export const PLATFORMS = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "HBO Max",
  "Apple TV+",
  "Paramount+",
  "Globoplay",
  "Crunchyroll",
  "Star+",
  "Peacock",
  "Hulu",
  "Outro",
];
