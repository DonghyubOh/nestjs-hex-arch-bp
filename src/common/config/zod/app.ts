import * as z from 'zod';

export const appConfig = z.object({
    appName: z.string(),
    nodeEnv: z.string().optional(),
    port: z.number(),
});
