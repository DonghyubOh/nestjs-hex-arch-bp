import { createLogger, Logger, LoggerOptions } from 'winston';
import { WinstonLoggerService } from './winston.service';
import { iWinstonModuleAsyncOptions, iWinstonModuleOptions, iWinstonModuleOptionsFactory } from './winston.interface';
import { Provider, Type } from '@nestjs/common';
import { WINSTON_MODLUE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_OPTIONS } from './winston.constant';

export const createWinstonLogger = (loggerOptions: iWinstonModuleOptions): WinstonLoggerService => {
    if (loggerOptions.instance) {
        return new WinstonLoggerService(loggerOptions.instance);
    }

    return new WinstonLoggerService(createLogger(loggerOptions));
};

export const createWinstonProvider = (loggerOptions: iWinstonModuleOptions): Provider[] => {
    return [
        {
            provide: WINSTON_MODLUE_PROVIDER,
            useFactory: () => createLogger(loggerOptions),
        },
        {
            provide: WINSTON_MODULE_NEST_PROVIDER,
            useFactory: (logger: Logger) => new WinstonLoggerService(logger),
            inject: [WINSTON_MODLUE_PROVIDER],
        },
    ];
};

export const createWinstonProviderAsync = (options: iWinstonModuleAsyncOptions): Provider[] => {
    const providers: Provider[] = [
        {
            provide: WINSTON_MODLUE_PROVIDER,
            useFactory: (loggerOptions: LoggerOptions) => createLogger(loggerOptions),
            inject: [WINSTON_MODULE_OPTIONS],
        },
        {
            provide: WINSTON_MODULE_NEST_PROVIDER,
            useFactory: (logger: Logger) => new WinstonLoggerService(logger),
            inject: [WINSTON_MODLUE_PROVIDER],
        },
    ];

    if (options.useClass) {
        const useClass = options.useClass as Type<iWinstonModuleOptionsFactory>;

        providers.push(
            ...[
                {
                    provide: WINSTON_MODULE_OPTIONS,
                    useFactory: async (optionsFactory: iWinstonModuleOptionsFactory) =>
                        await optionsFactory.createWinstonModuleOptions(),
                    inject: [useClass],
                },
                {
                    provide: useClass,
                    useClass,
                },
            ],
        );
    }

    if (options.useFactory) {
        providers.push({
            provide: WINSTON_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        });
    }

    return providers;
};
