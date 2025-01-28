import { DynamicModule, Global, Module } from '@nestjs/common';
import { iConfigOptions } from './config.interface';
import { createConfigProvider } from './config.provider';

@Global()
@Module({})
export class ConfigModule {
    static forRoot(options: iConfigOptions): DynamicModule {
        const configProvider = createConfigProvider(options);

        return {
            module: ConfigModule,
            providers: [configProvider],
            global: options.isGlobal,
            exports: [configProvider],
        };
    }
}
