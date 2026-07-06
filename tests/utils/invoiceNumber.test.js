import { generateInvoiceNumber } from '../../utils/invoiceNumber.js';

describe('invoiceNumber utils', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-06T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('generates an invoice number using the date, business id, and sequence', () => {
    const result = generateInvoiceNumber('business-1', 4);

    expect(result).toBe('INV-20260706-business-1-4');
  });
});
