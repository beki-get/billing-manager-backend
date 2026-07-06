import notificationController from '../../controllers/notificationController.js';
import notificationService from '../../services/notificationService.js';

jest.mock('../../services/notificationService.js', () => ({
  __esModule: true,
  default: {
    getNotifications: jest.fn(),
    deleteNotifications: jest.fn(),
  },
}));

describe('notificationController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      user: { businesses: ['business-1'] },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('returns notifications for an authorized business', async () => {
    req.params.businessId = 'business-1';
    const notifications = [{ _id: 'note-1' }];
    notificationService.getNotifications.mockResolvedValue(notifications);

    await notificationController.getNotifications(req, res);

    expect(notificationService.getNotifications).toHaveBeenCalledWith('business-1');
    expect(res.json).toHaveBeenCalledWith(notifications);
  });

  it('blocks access when the business is not authorized', async () => {
    req.params.businessId = 'business-2';

    await notificationController.getNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access' });
  });

  it('deletes a notification and returns a success response', async () => {
    req.params.id = 'note-1';
    notificationService.deleteNotifications.mockResolvedValue({ deletedCount: 1 });

    await notificationController.deleteNotifications(req, res);

    expect(notificationService.deleteNotifications).toHaveBeenCalledWith('note-1', 'business-1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Notification deleted successfully' });
  });
});
