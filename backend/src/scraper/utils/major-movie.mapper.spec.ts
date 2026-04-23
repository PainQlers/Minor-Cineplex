import { toMovieUpsertDto } from './major-movie.mapper';

describe('toMovieUpsertDto', () => {
  it('returns null when the movie has no title', () => {
    expect(toMovieUpsertDto({ title: '   ' })).toBeNull();
    expect(toMovieUpsertDto({})).toBeNull();
  });

  it('normalizes a scraped Major movie into an upsert dto', () => {
    expect(
      toMovieUpsertDto({
        title: '  Example Movie  ',
        poster_url: '"https://example.com/poster.jpg"',
        show_date: '17 December 2025',
        genre: ' Action ',
        duration: ' 120 min ',
        link: '/movie/example',
        rating: ' TBC ',
      }),
    ).toEqual({
      title: 'Example Movie',
      description: undefined,
      duration: '120 min',
      genre: 'Action',
      show_date: '2025-12-17',
      poster_url: 'https://example.com/poster.jpg',
      link: '/movie/example',
      rating: 'TBC',
      trailer_url: undefined,
    });
  });
});
