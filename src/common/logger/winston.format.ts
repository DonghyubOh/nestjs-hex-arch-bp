import { ClsService } from 'nestjs-cls';
import * as winston from 'winston';

const insertRequestId = (cls: ClsService) => {
    return winston.format((info) => {
        const requestId = cls.getId();
        if (requestId) {
            info.requestId = requestId;
        }
        return info;
    })();
};

export const defaultFormat = (cls: ClsService) => {
    return new winston.transports.Console({
        format: winston.format.combine(
            insertRequestId(cls),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize({ level: true }),
            winston.format.json(),
            winston.format.printf(({ level, message, context, requestId, timestamp, stack }) => {
                const defaultMsg = `${timestamp} [${requestId}] [${context}] ${level}: ${message}`;
                return !stack ? defaultMsg : defaultMsg + '\n' + stack;
            }),
        ),
    });
};
