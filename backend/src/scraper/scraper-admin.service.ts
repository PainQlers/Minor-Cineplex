import { BadRequestException, Injectable } from '@nestjs/common';
import { UpsertMovieDto } from '@/movies/dto/upsert-movie.dto';
import { MovieRecord, MoviesService } from '@/movies/movies.service';
import {
  MovieScrapeSnapshot,
  ScrapeRunsService,
  SnapshotCompareStatus,
} from './scrape-runs.service';

const COMPARE_FIELDS = [
  'title',
  'poster_url',
  'show_date',
  'genre',
  'duration',
  'description',
  'rating',
  'trailer_url',
  'link',
] as const;

const STATUS_PRIORITY: Record<SnapshotCompareStatus, number> = {
  new: 0,
  changed: 1,
  invalid: 2,
  failed: 3,
  unchanged: 4,
  pending: 5,
};

type CompareField = (typeof COMPARE_FIELDS)[number];
type ApplyAction = 'approve' | 'ignore' | 'mark_inactive';

export type MovieCompareRow = {
  snapshot: MovieScrapeSnapshot;
  matchedMovie: MovieRecord | null;
  compareStatus: SnapshotCompareStatus;
  diffFields: CompareField[];
};

export type ApplySnapshotsRequest = {
  action: ApplyAction;
  snapshotIds: string[];
};

@Injectable()
export class ScraperAdminService {
  constructor(
    private readonly scrapeRunsService: ScrapeRunsService,
    private readonly moviesService: MoviesService,
  ) {}

  async listRuns(limit?: number) {
    return this.scrapeRunsService.listRuns(limit);
  }

  async getRunCompare(
    runId: string,
    options: {
      status?: string;
      q?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    await this.scrapeRunsService.getRun(runId);
    const status = options.status ?? 'all';
    const query = options.q?.trim().toLowerCase() ?? '';
    const page = Math.max(options.page ?? 1, 1);
    const pageSize = Math.min(Math.max(options.pageSize ?? 50, 1), 100);
    const snapshotRows = await this.scrapeRunsService.getSnapshotsByRun(runId);
    const rows = await this.buildCompareRowsFromSnapshots(snapshotRows);

    const filteredRows = rows.filter((row) => {
      if (status !== 'all' && row.compareStatus !== status) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        row.snapshot.title,
        row.snapshot.link,
        row.snapshot.source_key,
        row.matchedMovie?.title,
        row.matchedMovie?.link,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    });
    const sortedRows = filteredRows.sort((left, right) =>
      this.compareRows(left, right),
    );
    const total = sortedRows.length;
    const start = (page - 1) * pageSize;
    const pagedRows = sortedRows.slice(start, start + pageSize);

    return {
      runId,
      page,
      pageSize,
      total,
      totals: this.getTotals(rows),
      rows: pagedRows,
    };
  }

  async applySnapshots(runId: string, request: ApplySnapshotsRequest) {
    if (!request.snapshotIds?.length) {
      throw new BadRequestException('snapshotIds is required');
    }

    if (!['approve', 'ignore', 'mark_inactive'].includes(request.action)) {
      throw new BadRequestException('Unsupported action');
    }

    const selectedIds = Array.from(new Set(request.snapshotIds));
    const selectedSnapshots = await this.scrapeRunsService.getSnapshotsByIds(
      runId,
      selectedIds,
    );
    const compareRows = await this.buildCompareRows(runId);
    const compareById = new Map(
      compareRows.map((row) => [row.snapshot.id, row]),
    );
    const result = {
      action: request.action,
      requested: selectedIds.length,
      applied: 0,
      failed: 0,
      errors: [] as Array<{
        snapshotId: string;
        title?: string | null;
        message: string;
      }>,
    };

    for (const snapshot of selectedSnapshots) {
      const row = compareById.get(snapshot.id);

      try {
        if (!row) {
          throw new Error('Snapshot was not found in compare result');
        }

        if (request.action === 'approve') {
          await this.approveSnapshot(row);
        } else if (request.action === 'ignore') {
          await this.scrapeRunsService.updateSnapshotApplyResult(snapshot.id, {
            compare_status: 'unchanged',
            error_message: null,
          });
        } else {
          await this.markMatchedMovieInactive(row);
        }

        result.applied += 1;
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          snapshotId: snapshot.id,
          title: snapshot.title,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return result;
  }

  private async approveSnapshot(row: MovieCompareRow) {
    if (row.compareStatus === 'invalid' || row.compareStatus === 'failed') {
      throw new Error(`Cannot approve ${row.compareStatus} snapshot`);
    }

    const movieDto = this.snapshotToMovieDto(row.snapshot);
    const importedMovie = await this.moviesService.upsertFromSnapshot(movieDto);

    await this.scrapeRunsService.updateSnapshotApplyResult(row.snapshot.id, {
      compare_status: row.compareStatus,
      imported_movie_id: importedMovie.id,
      error_message: null,
    });
  }

  private async markMatchedMovieInactive(row: MovieCompareRow) {
    if (!row.matchedMovie?.id) {
      throw new Error('No matched movie to mark inactive');
    }

    const inactiveMovie = await this.moviesService.markInactive(
      row.matchedMovie.id,
      `Marked inactive from scrape snapshot ${row.snapshot.id}`,
    );

    await this.scrapeRunsService.updateSnapshotApplyResult(row.snapshot.id, {
      compare_status: row.compareStatus,
      imported_movie_id: inactiveMovie.id,
      error_message: null,
    });
  }

  private async buildCompareRows(runId: string): Promise<MovieCompareRow[]> {
    const snapshots = await this.scrapeRunsService.getSnapshotsByRun(runId);
    return this.buildCompareRowsFromSnapshots(snapshots);
  }

  private async buildCompareRowsFromSnapshots(
    snapshots: MovieScrapeSnapshot[],
  ): Promise<MovieCompareRow[]> {
    const links = snapshots
      .map((snapshot) => snapshot.link || snapshot.source_key || '')
      .filter(Boolean);
    const titles = snapshots
      .map((snapshot) => snapshot.title?.trim() ?? '')
      .filter(Boolean);
    const movies = await this.moviesService.findMatchesByLinksAndTitles(
      links,
      titles,
    );
    const moviesByLink = new Map(
      movies.filter((movie) => movie.link).map((movie) => [movie.link, movie]),
    );
    const moviesByTitle = new Map(
      movies
        .filter((movie) => movie.title)
        .map((movie) => [movie.title, movie]),
    );

    return snapshots.map((snapshot) => {
      const matchedMovie =
        moviesByLink.get(snapshot.link || snapshot.source_key || '') ??
        moviesByTitle.get(snapshot.title ?? '') ??
        null;
      const diffFields = matchedMovie
        ? this.getDiffFields(snapshot, matchedMovie)
        : [];
      const compareStatus = this.getCompareStatus(
        snapshot,
        matchedMovie,
        diffFields,
      );

      return {
        snapshot,
        matchedMovie,
        diffFields,
        compareStatus,
      };
    });
  }

  private getCompareStatus(
    snapshot: MovieScrapeSnapshot,
    matchedMovie: MovieRecord | null,
    diffFields: CompareField[],
  ): SnapshotCompareStatus {
    if (snapshot.compare_status === 'failed') {
      return 'failed';
    }

    if (!snapshot.title?.trim()) {
      return 'invalid';
    }

    if (!matchedMovie) {
      return 'new';
    }

    return diffFields.length > 0 ? 'changed' : 'unchanged';
  }

  private getDiffFields(
    snapshot: MovieScrapeSnapshot,
    movie: MovieRecord,
  ): CompareField[] {
    return COMPARE_FIELDS.filter(
      (field) =>
        this.normalize(snapshot[field]) !== this.normalize(movie[field]),
    );
  }

  private snapshotToMovieDto(snapshot: MovieScrapeSnapshot): UpsertMovieDto {
    const title = snapshot.title?.trim();

    if (!title) {
      throw new Error('Snapshot title is required');
    }

    return {
      title,
      description: snapshot.description ?? undefined,
      duration: snapshot.duration ?? undefined,
      genre: snapshot.genre ?? undefined,
      show_date: snapshot.show_date ?? undefined,
      poster_url: snapshot.poster_url ?? undefined,
      link: snapshot.link ?? undefined,
      rating: snapshot.rating ?? undefined,
      trailer_url: snapshot.trailer_url ?? undefined,
    };
  }

  private getTotals(rows: MovieCompareRow[]) {
    return rows.reduce(
      (totals, row) => {
        totals[row.compareStatus] += 1;
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

  private compareRows(left: MovieCompareRow, right: MovieCompareRow) {
    const priorityDiff =
      STATUS_PRIORITY[left.compareStatus] - STATUS_PRIORITY[right.compareStatus];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const leftUpdatedAt = new Date(left.snapshot.created_at).getTime();
    const rightUpdatedAt = new Date(right.snapshot.created_at).getTime();

    if (leftUpdatedAt !== rightUpdatedAt) {
      return rightUpdatedAt - leftUpdatedAt;
    }

    return (left.snapshot.title ?? '').localeCompare(right.snapshot.title ?? '');
  }

  private normalize(value: unknown) {
    return String(value ?? '').trim();
  }
}
