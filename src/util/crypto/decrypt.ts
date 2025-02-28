import * as crypto from 'crypto';
import { ENCRYPTION_POLICY } from './encryption.policy';

const isEncrypted = (arg: string) => {
    return Buffer.from(arg, 'base64').subarray(0, 8).toString() === 'Salted__';
};

const decipher = (target: string) => {
    const [iv, data, authTag] = target.split(':');
    const salted = Buffer.from(iv, 'base64').toString('base64');
    const slicedIv = iv.slice(salted.length);

    const ivBuf = Buffer.from(slicedIv, 'hex');
    const authTagBuf = Buffer.from(authTag, 'hex');
    const encryptedText = Buffer.from(data, 'hex');

    const decipher = crypto.createDecipheriv(ENCRYPTION_POLICY.ALGORITHM, ENCRYPTION_POLICY.SECRET_KEY, ivBuf);

    decipher.setAuthTag(authTagBuf);

    const decrypted = decipher.update(encryptedText);
    const final = decipher.final();
    const result = Buffer.concat([decrypted, final]).toString();

    return result;
};

export { decipher, isEncrypted };
