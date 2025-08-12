import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const algorithm = 'aes-256-cbc';

const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex');
const masterIv = Buffer.from(process.env.MASTER_IV, 'hex');

export function encrypt(text) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    key: key.toString('hex'),
    iv: iv.toString('hex'),
    content: encrypted
  };
}

export function decrypt(encrypted, keyHex, ivHex) {
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function secureEncryptKey(text) {
  const cipher = crypto.createCipheriv(algorithm, masterKey, masterIv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function secureDecryptKey(encryptedHex) {
  const decipher = crypto.createDecipheriv(algorithm, masterKey, masterIv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
