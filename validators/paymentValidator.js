import { z } from 'zod';

export const webhookSchema = z.object({
  event: z.string().trim().min(1),
  status: z.string().trim().min(1),
  reference: z.string().trim().min(1),
});

export const invoiceIdParamSchema = z.object({
  invoiceId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/,'Invalid invoice ID format'),
});
