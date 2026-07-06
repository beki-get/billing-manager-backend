import authController from '../../controllers/authController.js';
import User from '../../models/User.js';
import generateToken from '../../utils/jwt.js';

jest.mock('../../models/User.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../utils/jwt.js', () => ({
  __esModule: true,
  default: jest.fn(() => 'mock-token'),
}));

describe('authController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: { _id: 'user-id', businesses: [] },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('registerUser', () => {
    it('registers a new user and returns 201 with token', async () => {
      req.body = { name: 'Ada', email: 'ada@example.com', password: 'secret' };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'new-user-id',
        name: 'Ada',
        email: 'ada@example.com',
        role: 'user',
      });

      await authController.registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'ada@example.com' });
      expect(User.create).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.com', password: 'secret' });
      expect(generateToken).toHaveBeenCalledWith('new-user-id');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User registered successfully',
        token: 'mock-token',
      }));
    });

    it('returns 400 when the email already exists', async () => {
      req.body = { name: 'Ada', email: 'ada@example.com', password: 'secret' };
      User.findOne.mockResolvedValue({ email: 'ada@example.com' });

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('loginUser', () => {
    it('logs in a valid user and returns token', async () => {
      req.body = { email: 'ada@example.com', password: 'secret' };
      const user = {
        _id: 'user-id',
        name: 'Ada',
        email: 'ada@example.com',
        role: 'user',
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(user);

      await authController.loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'ada@example.com' });
      expect(user.matchPassword).toHaveBeenCalledWith('secret');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User loged in Successfully',
        token: 'mock-token',
      }));
    });

    it('returns 401 for invalid credentials', async () => {
      req.body = { email: 'ada@example.com', password: 'wrong' };
      const user = {
        matchPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(user);

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
  });
});
