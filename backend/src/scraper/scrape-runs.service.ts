/**
 * ScrapeRunsService - Service สำหรับจัดการ scrape_runs และ movie_scrape_snapshots
 *
 * เปลี่ยน flow จาก:
 *   scrape → upsert movies (direct)
 * เป็น:
 *   scrape → create scrape_run → save snapshots → รอ process ทีหลัง
 */

import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Type สำหรับ scrape_runs
export interface ScrapeRun {
  id: string;
  source: string;
  target: string;
  status: 'running' | 'success' | 'failed' | 'partial';
  fetched: number;
  upserted: number;
  skipped: number;
  failed: number;
  new_count: number;
  changed_count: number;
  unchanged_count: number;
  invalid_count: number;
  error_message?: string;
  started_at: string;
  finished_at?: string;
  created_at: string;
}

// Type สำหรับ movie_scrape_snapshots
export interface MovieScrapeSnapshot {
  id: string;
  run_id: string;
  source: string;
  source_key?: string;
  title?: string;
  poster_url?: string;
  show_date?: string;
  genre?: string;
  duration?: string;
  link?: string;
  description?: string;
  rating?: string;
  trailer_url?: string;
  raw_payload: Record<string, unknown>;
  content_hash?: string;
  compare_status: 'pending' | 'new' | 'changed' | 'unchanged' | 'invalid' | 'failed';
  imported_movie_id?: string;
  error_message?: string;
  created_at: string;
}

@Injectable()
export class ScrapeRunsService {
  private readonly supabase: SupabaseClient;

  constructor() {
    // สร้าง Supabase client จาก env
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * createRun - สร้าง scrape_run ใหม่ก่อนเริ่ม scraping
   *
   * @param source - แหล่งที่มา เช่น 'majorcineplex'
   * @param target - target table เช่น 'movies'
   * @returns ScrapeRun ที่สร้างขึ้น
   */
  async createRun(
    source: string,
    target: string = 'movies',
  ): Promise<ScrapeRun> {
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

  /**
   * updateRun - อัพเดทสถานะและสถิติของ scrape_run
   *
   * @param runId - ID ของ scrape_run
   * @param updates - ข้อมูลที่ต้องการอัพเดท
   */
  async updateRun(
    runId: string,
    updates: Partial<ScrapeRun>,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('scrape_runs')
      .update(updates)
      .eq('id', runId);

    if (error) {
      throw new Error(`Failed to update scrape run: ${error.message}`);
    }
  }

  /**
   * completeRun - จบการทำงานของ scrape_run
   *
   * @param runId - ID ของ scrape_run
   * @param status - สถานะสุดท้าย (success, failed, partial)
   * @param stats - สถิติต่างๆ
   * @param errorMessage - ข้อความ error (ถ้ามี)
   */
  async completeRun(
    runId: string,
    status: 'success' | 'failed' | 'partial',
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
    const { error } = await this.supabase
      .from('scrape_runs')
      .update({
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
      })
      .eq('id', runId);

    if (error) {
      throw new Error(`Failed to complete scrape run: ${error.message}`);
    }
  }

  /**
   * saveSnapshot - บันทึก movie snapshot ลง database
   *
   * @param runId - ID ของ scrape_run ที่ snapshot นี้สังกัด
   * @param movie - ข้อมูลหนังจาก scraping
   * @param rawPayload - ข้อมูลดิบทั้งหมด
   * @returns MovieScrapeSnapshot ที่สร้างขึ้น
   */
  async saveSnapshot(
    runId: string,
    movie: {
      title?: string;
      poster_url?: string;
      show_date?: string;
      genre?: string;
      duration?: string;
      link?: string;
      description?: string;
      rating?: string;
      trailer_url?: string;
    },
    rawPayload: Record<string, unknown>,
  ): Promise<MovieScrapeSnapshot> {
    // สร้าง content hash สำหรับเปรียบเทียบข้อมูล
    const contentHash = this.generateContentHash(movie);

    // source_key = ใช้ link หรือ title เป็น unique key
    const sourceKey = movie.link || movie.title || undefined;

    const { data, error } = await this.supabase
      .from('movie_scrape_snapshots')
      .insert({
        run_id: runId,
        source: 'majorcineplex',
        source_key: sourceKey,
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
        content_hash: contentHash,
        compare_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save snapshot: ${error.message}`);
    }

    return data as MovieScrapeSnapshot;
  }

  /**
   * saveSnapshotWithError - บันทึก snapshot ที่มี error
   *
   * @param runId - ID ของ scrape_run
   * @param movie - ข้อมูลหนัง (อาจไม่ครบ)
   * @param rawPayload - ข้อมูลดิบ
   * @param errorMessage - ข้อความ error
   */
  async saveSnapshotWithError(
    runId: string,
    movie: {
      title?: string;
      link?: string;
    },
    rawPayload: Record<string, unknown>,
    errorMessage: string,
  ): Promise<void> {
    await this.supabase.from('movie_scrape_snapshots').insert({
      run_id: runId,
      source: 'majorcineplex',
      source_key: movie.link || movie.title || 'unknown',
      title: movie.title,
      link: movie.link,
      raw_payload: rawPayload,
      compare_status: 'failed',
      error_message: errorMessage,
    });
  }

  /**
   * generateContentHash - สร้าง hash จากข้อมูล movie เพื่อเปรียบเทียบ
   *
   * @param movie - ข้อมูลหนัง
   * @returns hash string
   */
  private generateContentHash(movie: Record<string, unknown>): string {
    // ใช้ JSON.stringify + simple hash (หรือจะใช้ crypto ก็ได้)
    const content = JSON.stringify(movie);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}
