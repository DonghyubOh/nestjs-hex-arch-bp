import * as z from 'zod';

const databaseType = [
    'mysql',
    'postgres',
    'cockroachdb',
    'sap',
    'mariadb',
    'sqlite',
    'cordova',
    'react-native',
    'nativescript',
    'oracle',
    'mssql',
    'mongodb',
    'aurora-mysql',
    'aurora-postgres',
    'expo',
    'better-sqlite3',
    'capacitor',
    'spanner',
] as const;

export const typeormConfig = z.object({
    type: z.enum(databaseType),
    host: z.string(),
    port: z.number(),
    username: z.string(),
    password: z.string(),
    database: z.string(),
    synchronize: z.boolean(),
});
