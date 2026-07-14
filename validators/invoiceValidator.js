import { z } from 'zod';

const objectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/,'Invalid ID format');

export const createInvoiceSchema = z.object({
  businessId: objectIdSchema.optional(),
  customerName: z.string().trim().min(1, 'Customer name is required'),
  customerEmail: z.string().trim().email('Invalid email address'),
  amount: z.number().positive('Amount must be greater than zero'),
  dueDate: z.string().or(z.date()).refine((value) => {
    const date = value instanceof Date ? value : new Date(value);
    return !Number.isNaN(date.getTime());
  }, 'Invalid due date'),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['paid', 'overdue'], { required_error: 'Status is required' }),
});

export const invoiceParamsSchema = z.object({
  businessId: objectIdSchema.optional(),
  id: objectIdSchema.optional(),
});
