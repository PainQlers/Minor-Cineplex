import { MajorMoviesScraperService } from './major-movies-scraper.service';
import { ScrapeRunsService } from './scrape-runs.service';

describe('MajorMoviesScraperService', () => {
  it('skips movies without a title and continues saving snapshots', async () => {
    const scrapeRunsService = {
      createRun: jest.fn().mockResolvedValue({ id: 'run-id' }),
      saveSnapshot: jest.fn().mockResolvedValue({ id: 'snapshot-id' }),
      saveSnapshotWithError: jest.fn(),
      completeRun: jest.fn().mockResolvedValue(undefined),
    } as unknown as ScrapeRunsService;
    const service = new MajorMoviesScraperService(scrapeRunsService);

    jest.spyOn(service, 'scrapeMajorMovies').mockResolvedValue([
      { title: 'Valid Movie', show_date: '17 December 2025' },
      { title: '   ', link: '/movie/missing-title' },
    ]);

    await expect(service.scrapeAndSaveSnapshots()).resolves.toEqual({
      status: 'success',
      source: 'majorcineplex',
      fetched: 2,
      upserted: 1,
      skipped: 1,
      failed: 0,
      errors: [],
    });
    expect(scrapeRunsService.createRun).toHaveBeenCalledWith(
      'majorcineplex',
      'movies',
    );
    expect(scrapeRunsService.saveSnapshot).toHaveBeenCalledTimes(1);
    expect(scrapeRunsService.saveSnapshot).toHaveBeenCalledWith(
      'run-id',
      expect.objectContaining({
        title: 'Valid Movie',
        show_date: '17 December 2025',
      }),
      expect.objectContaining({
        title: 'Valid Movie',
      }),
    );
    expect(scrapeRunsService.completeRun).toHaveBeenCalledWith(
      'run-id',
      'success',
      {
        fetched: 2,
        upserted: 1,
        skipped: 1,
        failed: 0,
      },
    );
  });

  it('records per-movie snapshot errors without stopping the batch', async () => {
    const scrapeRunsService = {
      createRun: jest.fn().mockResolvedValue({ id: 'run-id' }),
      saveSnapshot: jest
        .fn()
        .mockRejectedValueOnce(new Error('snapshot insert failed'))
        .mockResolvedValueOnce({ id: 'snapshot-id' }),
      saveSnapshotWithError: jest.fn().mockResolvedValue(undefined),
      completeRun: jest.fn().mockResolvedValue(undefined),
    } as unknown as ScrapeRunsService;
    const service = new MajorMoviesScraperService(scrapeRunsService);

    jest.spyOn(service, 'scrapeMajorMovies').mockResolvedValue([
      { title: 'Broken Movie', link: '/movie/broken' },
      { title: 'Valid Movie', link: '/movie/valid' },
    ]);

    await expect(service.scrapeAndSaveSnapshots()).resolves.toEqual({
      status: 'success',
      source: 'majorcineplex',
      fetched: 2,
      upserted: 1,
      skipped: 0,
      failed: 1,
      errors: [
        {
          title: 'Broken Movie',
          link: '/movie/broken',
          message: 'snapshot insert failed',
        },
      ],
    });
    expect(scrapeRunsService.saveSnapshot).toHaveBeenCalledTimes(2);
    expect(scrapeRunsService.saveSnapshotWithError).toHaveBeenCalledWith(
      'run-id',
      { title: 'Broken Movie', link: '/movie/broken' },
      expect.objectContaining({
        title: 'Broken Movie',
      }),
      'snapshot insert failed',
    );
    expect(scrapeRunsService.completeRun).toHaveBeenCalledWith(
      'run-id',
      'partial',
      {
        fetched: 2,
        upserted: 1,
        skipped: 0,
        failed: 1,
      },
    );
  });

  it('marks the run as failed when scraping fails before snapshots are saved', async () => {
    const scrapeRunsService = {
      createRun: jest.fn().mockResolvedValue({ id: 'run-id' }),
      saveSnapshot: jest.fn(),
      saveSnapshotWithError: jest.fn(),
      completeRun: jest.fn().mockResolvedValue(undefined),
    } as unknown as ScrapeRunsService;
    const service = new MajorMoviesScraperService(scrapeRunsService);

    jest
      .spyOn(service, 'scrapeMajorMovies')
      .mockRejectedValue(new Error('list scrape failed'));

    await expect(service.scrapeAndSaveSnapshots()).rejects.toThrow(
      'list scrape failed',
    );
    expect(scrapeRunsService.saveSnapshot).not.toHaveBeenCalled();
    expect(scrapeRunsService.completeRun).toHaveBeenCalledWith(
      'run-id',
      'failed',
      { fetched: 0, upserted: 0, skipped: 0, failed: 0 },
      'list scrape failed',
    );
  });
});
