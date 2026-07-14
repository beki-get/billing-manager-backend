import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().trim().min(1, 'Business name is required'),
  currency: z.string().trim().min(1).optional(),
});
