export const API_PATH = '/api/v1';

export interface AppResponse {
  message: string;
  technicalMessage?: string;
  statusCode?: number;
}
