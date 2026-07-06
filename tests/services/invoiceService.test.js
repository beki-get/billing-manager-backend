import invoiceService from '../../services/invoiceService.js';
import Invoice from '../../models/Invoice.js';
import { generateInvoiceNumber } from '../../utils/invoiceNumber.js';

jest.mock('../../models/Invoice.js', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock('../../utils/invoiceNumber.js', () => ({
  __esModule: true,
  generateInvoiceNumber: jest.fn(),
}));

describe('invoiceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an invoice and generates a number when none is provided', async () => {
    Invoice.countDocuments.mockResolvedValue(2);
    generateInvoiceNumber.mockReturnValue('INV-3');
    Invoice.create.mockResolvedValue({ _id: 'invoice-1' });

    const invoice = await invoiceService.createInvoice({
      businessId: 'business-1',
      amount: 100,
      dueDate: '2026-08-01',
      customerName: 'Ada',
      customerEmail: 'ada@example.com',
    });

    expect(generateInvoiceNumber).toHaveBeenCalledWith('business-1', 3);
    expect(Invoice.create).toHaveBeenCalledWith(expect.objectContaining({
      businessId: 'business-1',
      amount: 100,
      currency: 'ETB',
      invoiceNumber: 'INV-3',
    }));
    expect(invoice).toEqual({ _id: 'invoice-1' });
  });

  it('returns invoices for a business ordered by due date', async () => {
    const invoices = [{ _id: 'invoice-1' }];
    const sortMock = jest.fn().mockResolvedValue(invoices);
    Invoice.find.mockReturnValue({ sort: sortMock });

    const result = await invoiceService.getInvoices('business-1');

    expect(Invoice.find).toHaveBeenCalledWith({ businessId: 'business-1' });
    expect(sortMock).toHaveBeenCalledWith({ dueDate: -1 });
    expect(result).toEqual(invoices);
  });

  it('updates the invoice status and saves it', async () => {
    const invoice = { status: 'pending', save: jest.fn().mockResolvedValue(true) };
    Invoice.findById.mockResolvedValue(invoice);

    const result = await invoiceService.updateInvoiceStatus('invoice-1', 'paid');

    expect(Invoice.findById).toHaveBeenCalledWith('invoice-1');
    expect(invoice.save).toHaveBeenCalled();
    expect(result.status).toBe('paid');
  });

  it('marks overdue invoices when they are past due', async () => {
    const overdueInvoice = { status: 'pending', save: jest.fn().mockResolvedValue(true) };
    Invoice.find.mockResolvedValue([overdueInvoice]);

    const result = await invoiceService.checkAndMarkOverdue();

    expect(overdueInvoice.status).toBe('overdue');
    expect(overdueInvoice.save).toHaveBeenCalled();
    expect(result).toEqual([overdueInvoice]);
  });
});
