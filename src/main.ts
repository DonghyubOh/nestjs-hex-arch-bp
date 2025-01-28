import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@common/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLoggerService } from '@common/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

async function bootstrap() {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    const app = await NestFactory.create(AppModule);

    const config: ConfigService = app.get(ConfigService);
    const appName = config.get('appName');
    const port = config.get('port');
    const swaggerConfig = config.get('swagger');

    const winstonLogger: WinstonLoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(winstonLogger);

    const swaggerDocumentBuilder = new DocumentBuilder()
        .setTitle(swaggerConfig.title)
        .setDescription(swaggerConfig.description)
        .setVersion(swaggerConfig.version)
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, swaggerDocumentBuilder);
    SwaggerModule.setup(swaggerConfig.path ?? 'api', app, documentFactory);

    await app.listen(port, () => {
        console.log(`Server name: ${appName} listening on port: ${port}`);
    });
}
bootstrap();
