import { jest, describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import { validateRequest } from '../../middlewares/validate.js';

describe('validateRequest middleware', () => {
  it('rejects invalid request bodies with a 400 response', () => {
    const req = { body: { name: '' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const schema = z.object({ name: z.string().min(1) });

    validateRequest(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Validation error' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('passes valid data through and stores the parsed value', () => {
    const req = { body: { name: 'Acme' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const schema = z.object({ name: z.string().min(1) });

    validateRequest(schema)(req, res, next);

    expect(req.body).toEqual({ name: 'Acme' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('validates route params when requested', () => {
    const req = { params: { businessId: '507f1f77bcf86cd799439011' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const schema = z.object({ businessId: z.string().regex(/^[0-9a-fA-F]{24}$/) });

    validateRequest(schema, 'params')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.params.businessId).toBe('507f1f77bcf86cd799439011');
  });
});
