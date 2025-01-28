import * as z from 'zod';
import * as fs from 'fs';
import * as path from 'path';

import * as zod from './zod';
import { iConfigOptions } from './config.interface';
import { FileNotExistsError } from './error/config.error';
import { decipher, isEncrypted } from 'src/util/crypto/decrypt';

export * from './zod';

const appConfig = zod.appConfig.merge(
    z.object({
        typeorm: zod.typeormConfig,
        winston: zod.winstonConfig.optional(),
        swagger: zod.swaggerConfig,
        message: zod.messageConfig,
    }),
);

export type iAppConfig = z.infer<typeof appConfig>;

// type iDeepRequired<T> = T extends object
//     ? {
//           [K in keyof T]-?: iDeepRequired<T[K]>;
//       }
//     : Required<T>;

// type iNonOptionalAppConfig = iDeepRequired<iAppConfig>;

export class ConfigService {
    // private config: iNonOptionalAppConfig;
    private config: iAppConfig;

    constructor(options: iConfigOptions) {
        const { configPath } = options;

        const configFilePath = path.join(process.cwd(), options.configPath);

        if (!fs.existsSync(configFilePath)) {
            throw new FileNotExistsError(`Config file does not exist on path: ${configPath}`);
        }

        const configBuf = fs.readFileSync(configFilePath);
        const config: Record<string, any> = JSON.parse(configBuf.toString());

        config.nodeEnv ??= 'develop';

        // const parsedConfig = appConfig.parse(config) as iDeepRequired<iAppConfig>;
        const parsedConfig = appConfig.parse(config);
        const decryptedConfig = this.decryptConfig(parsedConfig);

        this.config = {} as iAppConfig;
        Object.assign(this.config, decryptedConfig);
    }

    decryptConfig = (config: iAppConfig) => {
        const decryptedConfigStr = JSON.stringify(config, (k, v) => {
            if (typeof v !== 'string') return v;
            return isEncrypted(v) ? decipher(v) : v;
        });

        const decryptedConfig: iAppConfig = JSON.parse(decryptedConfigStr);

        return decryptedConfig;
    };

    // get = <K extends keyof iNonOptionalAppConfig>(key: K): iNonOptionalAppConfig[K] => this.config[key];
    get = <K extends keyof iAppConfig>(key: K): iAppConfig[K] => this.config[key];
}
