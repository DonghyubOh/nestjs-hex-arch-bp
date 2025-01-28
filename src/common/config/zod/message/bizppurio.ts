import * as z from 'zod';

export const bizppurioConfig = z.object({
    url: z.string(),
    username: z.string(),
    password: z.string(),
});
