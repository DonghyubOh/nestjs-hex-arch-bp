export const ENCRYPTION_POLICY = {
    IV_LENGTH: 16,
    SALT_ROUND: 10,
    SECRET_KEY: 'BOILER_PLATE_SECRET_KEY___32BYTE',
    ALGORITHM: 'aes-256-gcm' as const,
};
