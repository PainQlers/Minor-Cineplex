import { parseReleaseDate } from './major-date.util';

describe('parseReleaseDate', () => {
  it.each([
    ['17 December 2025', '2025-12-17'],
    ['Release Date : 2 Jan 26', '2026-01-02'],
    ['05/04/2026', '2026-04-05'],
    ['2026-4-7', '2026-04-07'],
    ['1 มกราคม 2569', '2026-01-01'],
  ])('parses %s', (input, expected) => {
    expect(parseReleaseDate(input)).toBe(expected);
  });

  it('returns undefined for empty values', () => {
    expect(parseReleaseDate('')).toBeUndefined();
    expect(parseReleaseDate(null)).toBeUndefined();
  });

  it('preserves unrecognized non-empty text', () => {
    expect(parseReleaseDate('Coming soon')).toBe('Coming soon');
  });
});
