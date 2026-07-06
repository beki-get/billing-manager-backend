import { addDays } from '../../utils/date.js';

describe('date utils', () => {
  it('adds the requested number of days to a date', () => {
    const start = new Date('2026-01-01T00:00:00.000Z');

    const result = addDays(start, 5);

    expect(result).toEqual(new Date('2026-01-06T00:00:00.000Z'));
  });
});
