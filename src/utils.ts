import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
export const API_PATH = '/api/v1';

export interface AppResponse {
  message: string;
  technicalMessage?: string;
  statusCode?: number;
}

export const generateHash = async (password: string) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return Promise.resolve(hash);
  } catch (e) {
    return Promise.reject(e.message);
  }
};

export const compareHash = async (password: string, hash: string) => {
  try {
    const isCorrect = await bcrypt.compare(password, hash);
    return Promise.resolve(isCorrect);
  } catch (e) {
    return Promise.reject(e.message);
  }
};

export const encryptPassword = async (password: string) => {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_ENCRYPTION_SECRET,
    );
    return Promise.resolve(encryptedPassword);
  } catch (e) {
    return Promise.reject(e.message);
  }
};

export const decryptPassword = async (encryptedPassword: string) => {
  try {
    const decryptedPassword = CryptoJS.AES.decrypt(
      encryptedPassword,
      process.env.PASSWORD_ENCRYPTION_SECRET,
    ).toString(CryptoJS.enc.Utf8);

    return Promise.resolve(decryptedPassword);
  } catch (e) {
    Promise.reject(e.message);
  }
};

