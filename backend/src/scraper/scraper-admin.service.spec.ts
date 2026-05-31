import { MoviesService } from '@/movies/movies.service';
import { ScrapeRunsService } from './scrape-runs.service';
import { ScraperAdminService } from './scraper-admin.service';

const baseRun = {
  id: 'run-id',
  source: 'majorcineplex',
  target: 'movies',
  status: 'success' as const,
  fetched: 3,
  upserted: 3,
  skipped: 0,
  failed: 0,
  new_count: 0,
  changed_count: 0,
  unchanged_count: 0,
  invalid_count: 0,
  started_at: '2026-04-23T00:00:00.000Z',
  created_at: '2026-04-23T00:00:00.000Z',
};

const snapshots = [
  {
    id: 'snapshot-link-changed',
    run_id: 'run-id',
    source: 'majorcineplex',
    source_key: '/movie/link-match',
    title: 'Link Match New Title',
    poster_url: 'poster-new.jpg',
    show_date: '2026-04-23',
    genre: 'Action',
    duration: '120 min',
    link: '/movie/link-match',
    description: 'New description',
    rating: '13+',
    trailer_url: 'trailer.mp4',
    raw_payload: {},
    compare_status: 'pending' as const,
    created_at: '2026-04-23T00:00:00.000Z',
  },
  {
    id: 'snapshot-title-unchanged',
    run_id: 'run-id',
    source: 'majorcineplex',
    source_key: 'Title Match',
    title: 'Title Match',
    poster_url: 'poster.jpg',
    show_date: '2026-04-23',
    genre: 'Drama',
    duration: '90 min',
    link: null,
    description: 'Same description',
    rating: 'G',
    trailer_url: null,
    raw_payload: {},
    compare_status: 'pending' as const,
    created_at: '2026-04-23T00:00:00.000Z',
  },
  {
    id: 'snapshot-new',
    run_id: 'run-id',
    source: 'majorcineplex',
    source_key: '/movie/new',
    title: 'New Movie',
    poster_url: null,
    show_date: null,
    genre: null,
    duration: null,
    link: '/movie/new',
    description: null,
    rating: null,
    trailer_url: null,
    raw_payload: {},
    compare_status: 'pending' as const,
    created_at: '2026-04-23T00:00:00.000Z',
  },
  {
    id: 'snapshot-invalid',
    run_id: 'run-id',
    source: 'majorcineplex',
    source_key: '/movie/invalid',
    title: '   ',
    raw_payload: {},
    compare_status: 'pending' as const,
    created_at: '2026-04-23T00:00:00.000Z',
  },
];

const movies = [
  {
    id: 'movie-link',
    title: 'Old Link Match Title',
    poster_url: 'poster-old.jpg',
    show_date: '2026-04-23',
    genre: 'Action',
    duration: '120 min',
    link: '/movie/link-match',
    description: 'Old description',
    rating: '13+',
    trailer_url: 'trailer.mp4',
  },
  {
    id: 'movie-title',
    title: 'Title Match',
    poster_url: 'poster.jpg',
    show_date: '2026-04-23',
    genre: 'Drama',
    duration: '90 min',
    link: null,
    description: 'Same description',
    rating: 'G',
    trailer_url: null,
  },
];

function createService() {
  const scrapeRunsService = {
    listRuns: jest.fn().mockResolvedValue([baseRun]),
    getRun: jest.fn().mockResolvedValue(baseRun),
    getSnapshotsByRun: jest.fn().mockResolvedValue(snapshots),
    getSnapshotsByRunPage: jest.fn().mockResolvedValue({
      rows: snapshots,
      total: snapshots.length,
    }),
    getSnapshotStatusCounts: jest.fn().mockResolvedValue({
      new: 0,
      changed: 0,
      unchanged: 0,
      invalid: 0,
      failed: 0,
      pending: snapshots.length,
    }),
    getSnapshotsByIds: jest.fn().mockResolvedValue([snapshots[0]]),
    updateSnapshotApplyResult: jest.fn().mockResolvedValue(undefined),
  } as unknown as ScrapeRunsService;
  const moviesService = {
    findMatchesByLinksAndTitles: jest.fn().mockResolvedValue(movies),
    upsertFromSnapshot: jest.fn().mockResolvedValue({ id: 'movie-link' }),
    markInactive: jest.fn().mockResolvedValue({ id: 'movie-link' }),
  } as unknown as MoviesService;

  return {
    scrapeRunsService,
    moviesService,
    service: new ScraperAdminService(scrapeRunsService, moviesService),
  };
}

describe('ScraperAdminService', () => {
  it('compares snapshots with link match, title fallback, new, and invalid statuses', async () => {
    const { service } = createService();

    await expect(
      service.getRunCompare('run-id', { status: 'all', page: 1, pageSize: 10 }),
    ).resolves.toMatchObject({
      total: 4,
      totals: {
        changed: 1,
        unchanged: 1,
        new: 1,
        invalid: 1,
      },
      rows: expect.arrayContaining([
        expect.objectContaining({
          snapshot: expect.objectContaining({ id: 'snapshot-link-changed' }),
          matchedMovie: expect.objectContaining({ id: 'movie-link' }),
          compareStatus: 'changed',
          diffFields: expect.arrayContaining([
            'title',
            'poster_url',
            'description',
          ]),
        }),
        expect.objectContaining({
          snapshot: expect.objectContaining({ id: 'snapshot-title-unchanged' }),
          matchedMovie: expect.objectContaining({ id: 'movie-title' }),
          compareStatus: 'unchanged',
        }),
        expect.objectContaining({
          snapshot: expect.objectContaining({ id: 'snapshot-new' }),
          matchedMovie: null,
          compareStatus: 'new',
        }),
        expect.objectContaining({
          snapshot: expect.objectContaining({ id: 'snapshot-invalid' }),
          compareStatus: 'invalid',
        }),
      ]),
    });
  });

  it('approves selected snapshots by upserting movies and updating imported id', async () => {
    const { moviesService, scrapeRunsService, service } = createService();

    await expect(
      service.applySnapshots('run-id', {
        action: 'approve',
        snapshotIds: ['snapshot-link-changed'],
      }),
    ).resolves.toMatchObject({
      action: 'approve',
      requested: 1,
      applied: 1,
      failed: 0,
    });
    expect(moviesService.upsertFromSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Link Match New Title',
        link: '/movie/link-match',
      }),
    );
    expect(scrapeRunsService.updateSnapshotApplyResult).toHaveBeenCalledWith(
      'snapshot-link-changed',
      {
        compare_status: 'changed',
        imported_movie_id: 'movie-link',
        error_message: null,
      },
    );
  });

  it('marks matched movies inactive without deleting them', async () => {
    const { moviesService, service } = createService();

    await expect(
      service.applySnapshots('run-id', {
        action: 'mark_inactive',
        snapshotIds: ['snapshot-link-changed'],
      }),
    ).resolves.toMatchObject({
      action: 'mark_inactive',
      applied: 1,
      failed: 0,
    });
    expect(moviesService.markInactive).toHaveBeenCalledWith(
      'movie-link',
      expect.stringContaining('snapshot-link-changed'),
    );
  });
});
