import invoiceController from '../../controllers/invoiceController.js';
import Invoice from '../../models/Invoice.js';
import invoiceService from '../../services/invoiceService.js';

jest.mock('../../models/Invoice.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

jest.mock('../../services/invoiceService.js', () => ({
  __esModule: true,
  default: {
    createInvoice: jest.fn(),
    getInvoices: jest.fn(),
    updateInvoiceStatus: jest.fn(),
  },
}));

describe('invoiceController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {},
      user: { businesses: ['business-1'] },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('creates an invoice for the current user business', async () => {
    req.body = {
      customerName: 'Lina',
      customerEmail: 'lina@example.com',
      amount: 100,
      dueDate: '2026-08-01',
      businessId: 'business-1',
    };
    invoiceService.createInvoice.mockResolvedValue({ _id: 'invoice-1' });

    await invoiceController.createInvoice(req, res);

    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expect.objectContaining({
      businessId: 'business-1',
      customerName: 'Lina',
      customerEmail: 'lina@example.com',
      amount: 100,
      dueDate: '2026-08-01',
      invoiceNumber: expect.stringMatching(/^INV-/),
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invoice created successfully',
    }));
  });

  it('returns 400 when required invoice fields are missing', async () => {
    req.body = { customerName: 'Lina' };

    await invoiceController.createInvoice(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    expect(invoiceService.createInvoice).not.toHaveBeenCalled();
  });

  it('returns invoices for an authorized business', async () => {
    req.params.businessId = 'business-1';
    const invoices = [{ _id: 'invoice-1' }];
    invoiceService.getInvoices.mockResolvedValue(invoices);

    await invoiceController.getInvoices(req, res);

    expect(invoiceService.getInvoices).toHaveBeenCalledWith('business-1');
    expect(res.json).toHaveBeenCalledWith(invoices);
  });

  it('updates invoice status when the status is valid', async () => {
    req.params.id = 'invoice-1';
    req.body = { status: 'paid' };
    invoiceService.updateInvoiceStatus.mockResolvedValue({ businessId: 'business-1' });

    await invoiceController.updateInvoiceStatus(req, res);

    expect(invoiceService.updateInvoiceStatus).toHaveBeenCalledWith('invoice-1', 'paid');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invoice status updated successfully',
    }));
  });
});
