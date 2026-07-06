import generateToken from '../../utils/jwt.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
  },
}));

describe('jwt utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'secret';
  });

  it('signs a token with the user id and expiry', () => {
    jwt.sign.mockReturnValue('signed-token');

    const result = generateToken('user-1');

    expect(jwt.sign).toHaveBeenCalledWith({ id: 'user-1' }, 'secret', { expiresIn: '7d' });
    expect(result).toBe('signed-token');
  });
});
