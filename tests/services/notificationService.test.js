import notificationService from '../../services/notificationService.js';
import emailService from '../../utils/emailService.js';
import Notification from '../../models/Notification.js';
import Invoice from '../../models/Invoice.js';
import Subscription from '../../models/Subscription.js';
import logAction from '../../utils/auditLogger.js';

jest.mock('../../utils/emailService.js', () => ({
  __esModule: true,
  default: {
    sendMail: jest.fn(),
  },
}));

jest.mock('../../models/Notification.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

jest.mock('../../models/Invoice.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

jest.mock('../../models/Subscription.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

jest.mock('../../utils/auditLogger.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends an overdue reminder email and records a notification', async () => {
    const invoice = {
      _id: 'invoice-1',
      businessId: 'business-1',
      subscriptionId: 'subscription-1',
      customerEmail: 'ada@example.com',
      customerName: 'Ada',
      invoiceNumber: 'INV-1',
      amount: 100,
      dueDate: new Date('2026-01-01'),
    };
    emailService.sendMail.mockResolvedValue(true);
    Notification.create.mockResolvedValue({});

    await notificationService.sendOverdueReminder(invoice);

    expect(emailService.sendMail).toHaveBeenCalled();
    expect(Notification.create).toHaveBeenCalledWith(expect.objectContaining({
      type: 'late_notice',
      status: 'sent',
      businessId: 'business-1',
    }));
  });

  it('sends upcoming reminders and logs them when due soon', async () => {
    const today = new Date();
    const invoice = {
      _id: 'invoice-2',
      businessId: 'business-1',
      subscriptionId: 'subscription-1',
      customerEmail: 'ada@example.com',
      customerName: 'Ada',
      invoiceNumber: 'INV-2',
      amount: 80,
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    };
    Invoice.find.mockResolvedValue([invoice]);
    Notification.findOne.mockResolvedValue(null);
    Subscription.findById.mockResolvedValue({ _id: 'subscription-1' });
    emailService.sendMail.mockResolvedValue(true);
    Notification.create.mockResolvedValue({});
    logAction.mockResolvedValue(undefined);

    await notificationService.sendUpcomingReminders();

    expect(emailService.sendMail).toHaveBeenCalled();
    expect(Notification.create).toHaveBeenCalledWith(expect.objectContaining({
      type: 'reminder',
      status: 'sent',
    }));
    expect(logAction).toHaveBeenCalled();
  });

  it('deletes a notification for a given business', async () => {
    Notification.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await notificationService.deleteNotifications('note-1', 'business-1');

    expect(Notification.deleteOne).toHaveBeenCalledWith({ _id: 'note-1', businessId: 'business-1' });
    expect(result).toEqual({ deletedCount: 1 });
  });
});
