import * as bcrypt from 'bcrypt';

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

export type LoginUser = {
  username: string;
  password: string;
};
