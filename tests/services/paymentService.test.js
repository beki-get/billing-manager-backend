describe('paymentService', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, CHAPA_BASE_URL: 'https://chapa.test', REQUEST_TIMEOUT_MS: '1000', CHAPA_SECRET_KEY: 'secret', APP_BASE_URL: 'https://app.test' };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('initializes a payment session with the expected payload', async () => {
    const paymentService = (await import('../../services/paymentService.js')).default;
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { checkout_url: 'https://pay.test' } }),
    });

    const result = await paymentService.initializePaymentSession({
      amount: 100,
      currency: 'ETB',
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      txRef: 'tx-1',
      invoiceNumber: 'INV-1',
      callbackUrl: 'https://callback.test',
    });

    expect(global.fetch).toHaveBeenCalledWith('https://chapa.test/transaction/initialize', expect.objectContaining({ method: 'POST' }));
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(requestBody).toEqual(expect.objectContaining({
      amount: 100,
      currency: 'ETB',
      email: 'ada@example.com',
      first_name: 'Ada',
      last_name: 'Lovelace',
      tx_ref: 'tx-1',
      callback_url: 'https://callback.test',
      return_url: 'https://app.test/api/payments/success',
    }));
    expect(result).toEqual({ data: { checkout_url: 'https://pay.test' } });
  });
});
