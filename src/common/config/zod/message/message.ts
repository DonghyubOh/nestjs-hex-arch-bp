import * as z from 'zod';
import { bizppurioConfig } from './bizppurio';

export const messageConfig = z.object({
    bizppurio: bizppurioConfig.optional(),
});
