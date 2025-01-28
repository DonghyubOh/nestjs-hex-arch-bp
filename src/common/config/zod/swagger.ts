import * as z from 'zod';

export const swaggerConfig = z.object({
    title: z.string(),
    description: z.string(),
    version: z.string(),
    path: z.string().optional(),
});
