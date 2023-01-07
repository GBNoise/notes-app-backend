export const jwtConstants = {
  SECRET: process.env.JWT_ACCESS_SECRET,
};

export const AUTH_CONTROLLER_ROUTE = "/auth"
export const REFRESH_TOKEN_DURATION = "1s";
export const ACCESS_TOKEN_DURATION = '2d';

export enum Roles {
  ROLE_ADMIN = "ADMIN",
  ROLE_USER = "USER",
}

export declare type RefreshToken = {
  id: string;
  iat?: string | number;
  exp?: string | number;
}

export declare type AccessToken = {
  username: string;
  email: string;
  sub: string;
  creationDate: string | Date;
  updateDate: string | Date;
  UserRoles: any[]
  iat?: string | number;
  exp?: string | number;
}


export declare type RawTokens = {
  access_token?: string;
  refresh_token?: string;
}