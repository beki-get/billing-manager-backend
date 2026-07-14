import { z } from 'zod';

const objectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/,'Invalid ID format');

export const createSubscriptionSchema = z.object({
  businessId: objectIdSchema,
  planId: objectIdSchema,
  customerName: z.string().trim().min(1, 'Customer name is required'),
  customerEmail: z.string().trim().email('Invalid email address'),
});

export const updateSubscriptionStatusSchema = z.object({
  status: z.enum(['active', 'paused', 'canceled'], { required_error: 'Status is required' }),
});

export const subscriptionParamsSchema = z.object({
  businessId: objectIdSchema.optional(),
  id: objectIdSchema.optional(),
});
