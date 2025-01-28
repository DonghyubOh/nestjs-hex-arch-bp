import { LoggerService } from '@nestjs/common';
import { Logger } from 'winston';

export class WinstonLoggerService implements LoggerService {
    private context?: string;

    constructor(private readonly logger: Logger) {}

    log(message: any, context?: string) {
        context = context || this.context;

        if (!!message && typeof message === 'object') {
            const { message: msg, level = 'info', ...meta } = message;

            return this.logger.log(level, msg as string, { context, ...meta });
        }

        return this.logger.info(message, { context });
    }

    verbose(message: any, context?: string) {
        context = context || this.context;

        if (!!message && typeof message === 'object') {
            const { message: msg, ...meta } = message;

            return this.logger.verbose(msg, { context, ...meta });
        }

        return this.logger.verbose(message, { context });
    }

    warn(message: any, context?: string) {
        context = context || this.context;

        if (!!message && typeof message === 'object') {
            const { message: msg, ...meta } = message;

            return this.logger.warn(msg as string, { context, ...meta });
        }

        return this.logger.warn(message, { context });
    }

    error(message: any, trace?: string, context?: string) {
        context = context || this.context;

        if (message instanceof Error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { message: msg, name, stack, ...meta } = message;

            return this.logger.error(msg, { context, stack: [trace || message.stack], error: message, ...meta });
        }

        if (!!message && typeof message === 'object') {
            const { message: msg, ...meta } = message;

            return this.logger.error(msg as string, { context, stack: [trace], ...meta });
        }

        return this.logger.error(message, { context, stack: [trace] });
    }

    fatal(message: any, trace?: string, context?: string) {
        context = context || this.context;

        if (message instanceof Error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { message: msg, name, stack, ...meta } = message;

            return this.logger.log({
                level: 'fatal',
                message: msg,
                context,
                stack: [trace || stack],
                error: message,
                ...meta,
            });
        }

        if (!!message && typeof message === 'object') {
            const { message: msg, ...meta } = message;

            return this.logger.log({ level: 'fatal', message: msg, stack: [trace], ...meta });
        }

        return this.logger.error({ level: 'fatal', message, context, stack: [trace] });
    }

    debug?(message: any, context?: string) {
        context = context || this.context;

        if (!!message && typeof message === 'object') {
            const { message: msg, ...meta } = message;

            return this.logger.debug(msg as string, { context, ...meta });
        }

        return this.logger.debug(message, { context });
    }

    public getWinstonLogger = (): Logger => this.logger;
}
