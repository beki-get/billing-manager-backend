import { z } from 'zod';

export const validateRequest = (schema, source = 'body') => (req, res, next) => {
    try {
        const data = source === 'params' ? req.params : req.body;
        const result = schema.parse(data);

        if (source === 'params') {
            req.params = result;
        } else {
            req.body = result;
        }

        next();
    } catch (err) {
        const errors = err instanceof z.ZodError ? err.flatten().fieldErrors : err.errors;
        res.status(400).json({ message: 'Validation error', errors });
    }
};