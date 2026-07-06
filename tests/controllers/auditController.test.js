import auditController from '../../controllers/auditController.js';
import AuditLog from '../../models/AuditLog.js';

jest.mock('../../models/AuditLog.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

describe('auditController', () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      json: jest.fn().mockReturnThis(),
    };
  });

  it('returns the latest audit logs', async () => {
    const logs = [{ message: 'login' }];
    const sortMock = jest.fn().mockReturnThis();
    const limitMock = jest.fn().mockResolvedValue(logs);

    AuditLog.find.mockReturnValue({ sort: sortMock, limit: limitMock });

    await auditController.getAuditLogs({}, res);

    expect(AuditLog.find).toHaveBeenCalled();
    expect(sortMock).toHaveBeenCalledWith({ timestamp: -1 });
    expect(limitMock).toHaveBeenCalledWith(50);
    expect(res.json).toHaveBeenCalledWith(logs);
  });

  it('clears all audit logs', async () => {
    AuditLog.deleteMany.mockResolvedValue({ deletedCount: 2 });

    await auditController.clearAuditLogs({}, res);

    expect(AuditLog.deleteMany).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith({ message: 'All logs cleared' });
  });
});
