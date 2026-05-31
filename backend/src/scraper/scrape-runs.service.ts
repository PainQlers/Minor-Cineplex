import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { SupabaseService } from '@/libs/supabase/supabase.service';

export type ScrapeRunStatus = 'running' | 'success' | 'failed' | 'partial';
export type SnapshotCompareStatus =
  | 'pending'
  | 'new'
  | 'changed'
  | 'unchanged'
  | 'invalid'
  | 'failed';

export interface ScrapeRun {
  id: string;
  source: string;
  target: string;
  status: ScrapeRunStatus;
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
}

export interface MovieScrapeSnapshot {
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
}

export type SnapshotInput = {
  title?: string;
  poster_url?: string;
  show_date?: string;
  genre?: string;
  duration?: string;
  link?: string;
  description?: string;
  rating?: string;
  trailer_url?: string;
};

@Injectable()
export class ScrapeRunsService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async listRuns(limit = 20): Promise<ScrapeRun[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const { data, error } = await this.supabase
      .from('scrape_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(safeLimit);

    if (error) {
      throw new Error(`Failed to list scrape runs: ${error.message}`);
    }

    return (data ?? []) as ScrapeRun[];
  }

  async getRun(runId: string): Promise<ScrapeRun> {
    const { data, error } = await this.supabase
      .from('scrape_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (error) {
      throw new Error(`Failed to get scrape run: ${error.message}`);
    }

    return data as ScrapeRun;
  }

  async createRun(source: string, target = 'movies'): Promise<ScrapeRun> {
    const { data, error } = await this.supabase
      .from('scrape_runs')
      .insert({
        source,
        target,
        status: 'running',
        fetched: 0,
        upserted: 0,
        skipped: 0,
        failed: 0,
        new_count: 0,
        changed_count: 0,
        unchanged_count: 0,
        invalid_count: 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create scrape run: ${error.message}`);
    }

    return data as ScrapeRun;
  }

  async updateRun(runId: string, updates: Partial<ScrapeRun>): Promise<void> {
    const { error } = await this.supabase
      .from('scrape_runs')
      .update(updates)
      .eq('id', runId);

    if (error) {
      throw new Error(`Failed to update scrape run: ${error.message}`);
    }
  }

  async completeRun(
    runId: string,
    status: Exclude<ScrapeRunStatus, 'running'>,
    stats: {
      fetched: number;
      upserted: number;
      skipped: number;
      failed: number;
      new_count?: number;
      changed_count?: number;
      unchanged_count?: number;
      invalid_count?: number;
    },
    errorMessage?: string,
  ): Promise<void> {
    await this.updateRun(runId, {
      status,
      fetched: stats.fetched,
      upserted: stats.upserted,
      skipped: stats.skipped,
      failed: stats.failed,
      new_count: stats.new_count ?? 0,
      changed_count: stats.changed_count ?? 0,
      unchanged_count: stats.unchanged_count ?? 0,
      invalid_count: stats.invalid_count ?? 0,
      error_message: errorMessage,
      finished_at: new Date().toISOString(),
    });
  }

  async getSnapshotsByRun(runId: string): Promise<MovieScrapeSnapshot[]> {
    const { data, error } = await this.supabase
      .from('movie_scrape_snapshots')
      .select('*')
      .eq('run_id', runId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get snapshots: ${error.message}`);
    }

    return (data ?? []) as MovieScrapeSnapshot[];
  }

  async getSnapshotsByRunPage(
    runId: string,
    options: {
      page: number;
      pageSize: number;
      q?: string;
    },
  ): Promise<{ rows: MovieScrapeSnapshot[]; total: number }> {
    const from = (options.page - 1) * options.pageSize;
    const to = from + options.pageSize - 1;
    let query = this.supabase
      .from('movie_scrape_snapshots')
      .select('*', { count: 'exact' })
      .eq('run_id', runId)
      .order('created_at', { ascending: false });

    if (options.q?.trim()) {
      const keyword = options.q.trim().replace(/[%_]/g, '\\$&');
      query = query.or(
        `title.ilike.%${keyword}%,link.ilike.%${keyword}%,source_key.ilike.%${keyword}%`,
      );
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error(`Failed to get snapshots page: ${error.message}`);
    }

    return {
      rows: (data ?? []) as MovieScrapeSnapshot[],
      total: count ?? 0,
    };
  }

  async getSnapshotStatusCounts(runId: string) {
    const { data, error } = await this.supabase
      .from('movie_scrape_snapshots')
      .select('compare_status')
      .eq('run_id', runId);

    if (error) {
      throw new Error(`Failed to get snapshot status counts: ${error.message}`);
    }

    return (data ?? []).reduce(
      (totals, row) => {
        const status = row.compare_status as SnapshotCompareStatus;
        totals[status] += 1;
        return totals;
      },
      {
        new: 0,
        changed: 0,
        unchanged: 0,
        invalid: 0,
        failed: 0,
        pending: 0,
      } satisfies Record<SnapshotCompareStatus, number>,
    );
  }

  async getSnapshotsByIds(runId: string, snapshotIds: string[]) {
    if (snapshotIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('movie_scrape_snapshots')
      .select('*')
      .eq('run_id', runId)
      .in('id', snapshotIds);

    if (error) {
      throw new Error(`Failed to get selected snapshots: ${error.message}`);
    }

    return (data ?? []) as MovieScrapeSnapshot[];
  }

  async saveSnapshot(
    runId: string,
    movie: SnapshotInput,
    rawPayload: Record<string, unknown>,
  ): Promise<MovieScrapeSnapshot> {
    const { data, error } = await this.supabase
      .from('movie_scrape_snapshots')
      .insert({
        run_id: runId,
        source: 'majorcineplex',
        source_key: movie.link || movie.title || undefined,
        title: movie.title,
        poster_url: movie.poster_url,
        show_date: movie.show_date,
        genre: movie.genre,
        duration: movie.duration,
        link: movie.link,
        description: movie.description,
        rating: movie.rating,
        trailer_url: movie.trailer_url,
        raw_payload: rawPayload,
        content_hash: this.generateContentHash(movie),
        compare_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save snapshot: ${error.message}`);
    }

    return data as MovieScrapeSnapshot;
  }

  async saveSnapshotWithError(
    runId: string,
    movie: Pick<SnapshotInput, 'title' | 'link'>,
    rawPayload: Record<string, unknown>,
    errorMessage: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('movie_scrape_snapshots')
      .insert({
        run_id: runId,
        source: 'majorcineplex',
        source_key: movie.link || movie.title || 'unknown',
        title: movie.title,
        link: movie.link,
        raw_payload: rawPayload,
        compare_status: 'failed',
        error_message: errorMessage,
      });

    if (error) {
      throw new Error(`Failed to save error snapshot: ${error.message}`);
    }
  }

  async updateSnapshotApplyResult(
    snapshotId: string,
    updates: {
      compare_status?: SnapshotCompareStatus;
      imported_movie_id?: string | null;
      error_message?: string | null;
    },
  ) {
    const { error } = await this.supabase
      .from('movie_scrape_snapshots')
      .update(updates)
      .eq('id', snapshotId);

    if (error) {
      throw new Error(`Failed to update snapshot: ${error.message}`);
    }
  }

  private generateContentHash(movie: Record<string, unknown>): string {
    return createHash('sha256')
      .update(JSON.stringify(this.sortObject(movie)))
      .digest('hex');
  }

  private sortObject(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sortObject(item));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, entryValue]) => [key, this.sortObject(entryValue)]),
      );
    }

    return value;
  }
}
