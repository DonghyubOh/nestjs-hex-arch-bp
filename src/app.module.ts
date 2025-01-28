import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@common/config';
import { WinstonModule, defaultFormat } from '@common/logger';
import ApiModule from './apis/api.module';
import { ClsModule, ClsService } from 'nestjs-cls';
import { generateUUID } from 'src/util/uuid/uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '@infra/typeorm/entities';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ProviderModule } from '@infra/providers/provider.module';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: {
                mount: true,
                generateId: true,
                idGenerator: (req) => req.headers['X-Request-Id'] ?? generateUUID(),
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            configPath: './config.json',
        }),
        WinstonModule.forRootAsync({
            imports: [ConfigModule, ClsModule],
            inject: [ConfigService, ClsService],
            useFactory: (config: ConfigService, cls: ClsService) => ({
                transports: [defaultFormat(cls)],
                ...config.get('winston'),
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    ...config.get('typeorm'),
                    entities: [...entities],
                };
            },
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('Invalid options passed');
                }

                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        ApiModule,
        ProviderModule,
    ],
    providers: [],
})
export class AppModule {}
