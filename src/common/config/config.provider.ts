import { Provider } from '@nestjs/common';
import { ConfigService } from './config';
import { iConfigOptions } from './config.interface';

export const createConfigProvider = (option: iConfigOptions): Provider<ConfigService> => {
    return {
        provide: ConfigService,
        useFactory: () => {
            return new ConfigService(option);
        },
    };
};
