import { ModuleMetadata, Type } from '@nestjs/common';
import { Logger, LoggerOptions } from 'winston';

export type iWinstonModuleOptions = LoggerOptions & { instance?: Logger };

export interface iWinstonModuleOptionsFactory {
    createWinstonModuleOptions(): Promise<iWinstonModuleOptions> | iWinstonModuleOptions;
}

export interface iWinstonModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => Promise<iWinstonModuleOptions> | iWinstonModuleOptions;
    inject?: any[];
    useClass?: Type<iWinstonModuleOptionsFactory>;
}
