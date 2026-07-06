jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(),
  },
}));

describe('emailService', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('sends an email via the configured transporter', async () => {
    const nodemailer = (await import('nodemailer')).default;
    const sendMail = jest.fn().mockResolvedValue({ accepted: ['ada@example.com'] });
    nodemailer.createTransport.mockReturnValue({ sendMail });

    const emailService = (await import('../../utils/emailService.js')).default;
    const result = await emailService.sendMail({
      from: 'system@example.com',
      to: 'ada@example.com',
      subject: 'Test',
      text: 'Hello',
    });

    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(sendMail).toHaveBeenCalledWith({
      from: 'system@example.com',
      to: 'ada@example.com',
      subject: 'Test',
      text: 'Hello',
      html: undefined,
    });
    expect(result).toEqual({ accepted: ['ada@example.com'] });
  });
});
