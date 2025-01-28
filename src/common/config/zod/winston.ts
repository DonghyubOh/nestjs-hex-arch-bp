import * as z from 'zod';

export const winstonConfig = z.object({
    levels: z.record(z.string(), z.number()).optional(),
    silent: z.boolean().optional(),
    level: z.string().optional(),
    defaultMeta: z.any().optional(),
    handleExceptions: z.boolean().optional(),
    handleRejections: z.boolean().optional(),
});
