import { MoviesService } from '@/movies/movies.service';
import { MajorMoviesScraperService } from './major-movies-scraper.service';

describe('MajorMoviesScraperService', () => {
  it('skips movies without a title and continues upserting the rest', async () => {
    const moviesService = {
      upsert: jest.fn().mockResolvedValue({ id: 'movie-id' }),
    } as unknown as MoviesService;
    const service = new MajorMoviesScraperService(moviesService);

    jest.spyOn(service, 'scrapeMajorMovies').mockResolvedValue([
      { title: 'Valid Movie', show_date: '17 December 2025' },
      { title: '   ', link: '/movie/missing-title' },
    ]);

    await expect(service.scrapeAndUpsertMajorMovies()).resolves.toEqual({
      status: 'success',
      source: 'majorcineplex',
      fetched: 2,
      upserted: 1,
      skipped: 1,
      failed: 0,
      errors: [],
    });
    expect(moviesService.upsert).toHaveBeenCalledTimes(1);
    expect(moviesService.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Valid Movie',
        show_date: '2025-12-17',
      }),
    );
  });

  it('records per-movie upsert errors without stopping the batch', async () => {
    const moviesService = {
      upsert: jest
        .fn()
        .mockRejectedValueOnce(new Error('duplicate conflict'))
        .mockResolvedValueOnce({ id: 'movie-id' }),
    } as unknown as MoviesService;
    const service = new MajorMoviesScraperService(moviesService);

    jest.spyOn(service, 'scrapeMajorMovies').mockResolvedValue([
      { title: 'Broken Movie', link: '/movie/broken' },
      { title: 'Valid Movie', link: '/movie/valid' },
    ]);

    await expect(service.scrapeAndUpsertMajorMovies()).resolves.toEqual({
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
          message: 'duplicate conflict',
        },
      ],
    });
    expect(moviesService.upsert).toHaveBeenCalledTimes(2);
  });
});
