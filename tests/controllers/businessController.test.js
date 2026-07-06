import businessController from '../../controllers/businessController.js';
import Business from '../../models/Business.js';

jest.mock('../../models/Business.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(),
  },
}));

describe('businessController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: { _id: 'user-id', businesses: [] , save: jest.fn().mockResolvedValue(true) },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createBusiness', () => {
    it('creates a business and associates it with the current user', async () => {
      req.body = { name: 'Acme', currency: 'USD' };
      Business.create.mockResolvedValue({ _id: 'business-id' });

      await businessController.createBusiness(req, res);

      expect(Business.create).toHaveBeenCalledWith({
        name: 'Acme',
        currency: 'USD',
        owner: 'user-id',
      });
      expect(req.user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: 'business-id' });
    });

    it('defaults currency to ETB when not provided', async () => {
      req.body = { name: 'Acme' };
      Business.create.mockResolvedValue({ _id: 'business-id' });

      await businessController.createBusiness(req, res);

      expect(Business.create).toHaveBeenCalledWith({
        name: 'Acme',
        currency: 'ETB',
        owner: 'user-id',
      });
    });
  });

  describe('getUserBusinesses', () => {
    it('returns businesses owned by the logged-in user', async () => {
      const businesses = [{ _id: 'business-1' }];
      Business.find.mockResolvedValue(businesses);

      await businessController.getUserBusinesses(req, res);

      expect(Business.find).toHaveBeenCalledWith({ owner: 'user-id' });
      expect(res.json).toHaveBeenCalledWith(businesses);
    });
  });
});
