import { Movie } from "./movie";

export type SnapshotCompareStatus =
  | "pending"
  | "new"
  | "changed"
  | "unchanged"
  | "invalid"
  | "failed";

export type ApplySnapshotAction = "approve" | "ignore" | "mark_inactive";

export type ScrapeRun = {
  id: string;
  source: string;
  target: string;
  status: "running" | "success" | "failed" | "partial";
  fetched: number;
  upserted: number;
  skipped: number;
  failed: number;
  new_count: number;
  changed_count: number;
  unchanged_count: number;
  invalid_count: number;
  error_message?: string | null;
  started_at: string;
  finished_at?: string | null;
  created_at: string;
};

export type MovieScrapeSnapshot = {
  id: string;
  run_id: string;
  source: string;
  source_key?: string | null;
  title?: string | null;
  poster_url?: string | null;
  show_date?: string | null;
  genre?: string | null;
  duration?: string | null;
  link?: string | null;
  description?: string | null;
  rating?: string | null;
  trailer_url?: string | null;
  raw_payload: Record<string, unknown>;
  content_hash?: string | null;
  compare_status: SnapshotCompareStatus;
  imported_movie_id?: string | null;
  error_message?: string | null;
  created_at: string;
};

export type MovieCompareRow = {
  snapshot: MovieScrapeSnapshot;
  matchedMovie: (Movie & { is_active?: boolean | null }) | null;
  compareStatus: SnapshotCompareStatus;
  diffFields: Array<
    | "title"
    | "poster_url"
    | "show_date"
    | "genre"
    | "duration"
    | "description"
    | "rating"
    | "trailer_url"
    | "link"
  >;
};

export type CompareRunsResponse = {
  runId: string;
  page: number;
  pageSize: number;
  total: number;
  totals: Record<SnapshotCompareStatus, number>;
  rows: MovieCompareRow[];
};

export type ApplySnapshotsRequest = {
  action: ApplySnapshotAction;
  snapshotIds: string[];
};

export type ApplySnapshotsResponse = {
  action: ApplySnapshotAction;
  requested: number;
  applied: number;
  failed: number;
  errors: Array<{
    snapshotId: string;
    title?: string | null;
    message: string;
  }>;
};
