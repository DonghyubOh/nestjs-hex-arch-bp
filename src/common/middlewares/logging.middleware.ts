import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { generateUUID } from 'src/util/uuid/uuid';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly cls: ClsService) {}

    use(req: Request, res: Response, next: (error?: Error | any) => void) {
        const key = 'X-Request-Id';

        const requestId = req.headers[key] ?? generateUUID();

        req.headers[key] ??= requestId;

        this.cls.set(key, requestId);

        return next();
    }
}
