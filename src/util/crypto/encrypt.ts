import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { ENCRYPTION_POLICY } from './encryption.policy';

const getFileBuf = (filePath: string) => fs.readFileSync(filePath);

const buftoJson = <T>(buf: Buffer) => JSON.parse(buf.toString()) as T;

const createRandomIv = (length: number) => crypto.randomBytes(length);

const createCipherIv = (iv: Buffer) =>
    crypto.createCipheriv(ENCRYPTION_POLICY.ALGORITHM, ENCRYPTION_POLICY.SECRET_KEY, iv);

const checkSecretKeyLength = () => {
    const info = crypto.getCipherInfo(ENCRYPTION_POLICY.ALGORITHM);

    if (!info) throw new Error(`Unsupported or invalid Algorithm\nalgorithm: ${ENCRYPTION_POLICY.ALGORITHM}`);

    if (info.keyLength !== ENCRYPTION_POLICY.SECRET_KEY.length)
        throw new Error(
            `Unavailable Key Length.\nalgorithm: ${ENCRYPTION_POLICY.ALGORITHM}\n${ENCRYPTION_POLICY.ALGORITHM} key length: ${info.keyLength}Btye\nconfig key length: ${ENCRYPTION_POLICY.SECRET_KEY.length}Btye`,
        );
};

const encryption = (target: string) => {
    const iv = createRandomIv(ENCRYPTION_POLICY.IV_LENGTH);
    const cipher = createCipherIv(iv);
    const encrypted = cipher.update(target);
    const final = cipher.final('utf8');
    const authTag = cipher.getAuthTag().toString('hex');
    const salted = Buffer.from('Salted__').toString('base64');
    const result =
        salted +
        iv.toString('hex') +
        ':' +
        Buffer.concat([encrypted, Buffer.from(final)]).toString('hex') +
        ':' +
        authTag;

    return result;
};

if (require.main === module) {
    const configFilePath = path.join(process.cwd(), 'config.json');
    const encryptedConfigFilePath = path.join(process.cwd(), 'config_enc.json');

    const buf = getFileBuf(configFilePath);
    const config = buftoJson(buf);

    try {
        checkSecretKeyLength();

        const targetKey = ['username', 'password'];

        const encryptedConfig = JSON.stringify(config, (k, v) => {
            if (!targetKey.includes(k)) return v;
            return encryption(v);
        });

        fs.writeFile(encryptedConfigFilePath, encryptedConfig, (error) => {
            if (error) throw error;
            console.log(`Encrypted config file generated on ${encryptedConfigFilePath}`);
        });
    } catch (error) {
        console.error(error);
    }
}
