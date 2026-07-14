import { z } from 'zod';

const objectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/,'Invalid ID format');

export const createPlanSchema = z.object({
  businessId: objectIdSchema,
  name: z.string().trim().min(1, 'Plan name is required'),
  price: z.number().positive('Price must be greater than zero'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  features: z.array(z.string().trim().min(1)).optional(),
});

export const updatePlanSchema = z.object({
  name: z.string().trim().min(1, 'Plan name is required').optional(),
  price: z.number().positive('Price must be greater than zero').optional(),
  duration: z.number().int().positive('Duration must be a positive integer').optional(),
  features: z.array(z.string().trim().min(1)).optional(),
});

export const planParamsSchema = z.object({
  businessId: objectIdSchema.optional(),
  id: objectIdSchema.optional(),
});
