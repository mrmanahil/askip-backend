import * as crypto from 'crypto';

export const hashPassword = (payload: string, salt: string): string =>
  crypto.createHmac('sha256', salt).update(payload).digest('hex');