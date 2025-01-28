import { InfraLayerError } from '../../../infra/error';

export class FileNotExistsError extends InfraLayerError {
    constructor(message: string) {
        super(message);
    }
}
