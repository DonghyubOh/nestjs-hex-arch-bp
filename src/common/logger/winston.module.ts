import { DynamicModule, Global, LoggerService, Module } from '@nestjs/common';
import { iWinstonModuleAsyncOptions, iWinstonModuleOptions } from './winston.interface';
import { createWinstonLogger, createWinstonProvider, createWinstonProviderAsync } from './winston.provider';

@Global()
@Module({})
export class WinstonModule {
    public static forRoot = (options: iWinstonModuleOptions): DynamicModule => {
        const providers = createWinstonProvider(options);

        return {
            module: WinstonModule,
            providers: providers,
            exports: providers,
        };
    };

    public static forRootAsync = (options: iWinstonModuleAsyncOptions): DynamicModule => {
        const providers = createWinstonProviderAsync(options);

        return {
            module: WinstonModule,
            imports: options.imports,
            providers: providers,
            exports: providers,
        };
    };

    public static createLogger = (options: iWinstonModuleOptions): LoggerService => {
        return createWinstonLogger(options);
    };
}
