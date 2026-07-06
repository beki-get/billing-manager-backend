import paymentController from '../../controllers/paymentController.js';
import Invoice from '../../models/Invoice.js';
import paymentService from '../../services/paymentService.js';

jest.mock('../../models/Invoice.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

jest.mock('../../services/paymentService.js', () => ({
  __esModule: true,
  default: {
    initializePaymentSession: jest.fn(),
  },
}));

describe('paymentController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  it('redirects to the payment gateway for a valid invoice', async () => {
    req.params.invoiceId = '507f1f77bcf86cd799439011';
    Invoice.findById.mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      amount: 100,
      currency: 'ETB',
      customerEmail: 'client@example.com',
      customerName: 'Jane Doe',
      invoiceNumber: 'INV-1',
      status: 'pending',
    });
    paymentService.initializePaymentSession.mockResolvedValue({ data: { checkout_url: 'https://pay.test' } });

    await paymentController.initializeInvoicePayment(req, res);

    expect(res.redirect).toHaveBeenCalledWith('https://pay.test');
  });

  it('returns 400 for an invalid invoice id format', async () => {
    req.params.invoiceId = 'invalid';

    await paymentController.initializeInvoicePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.objectContaining({ code: 'INVALID_INVOICE_ID' }),
    }));
  });

  it('marks an invoice as paid when the webhook is successful', async () => {
    req.body = { event: 'charge.success', status: 'success', reference: '507f1f77bcf86cd799439011' };
    const invoice = { _id: '507f1f77bcf86cd799439011', status: 'pending', save: jest.fn().mockResolvedValue(true) };
    Invoice.findById.mockResolvedValue(invoice);

    await paymentController.handleChapaWebhook(req, res);

    expect(invoice.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invoice payment status updated successfully' });
  });

  it('returns the payment success view markup', () => {
    paymentController.handlePaymentSuccessView(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Payment Captured Successfully'));
  });
});
