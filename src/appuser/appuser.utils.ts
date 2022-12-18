import { Prisma, User } from '@prisma/client';
import { AppResponse, API_PATH } from '../utils';

export const APP_USER_CONTROLLER_ROUTE: string = API_PATH + '/users';

export interface AppUserServiceInterface {
  createUser: (user: Prisma.UserCreateInput) => Promise<User | AppResponse>;
  deleteUser: (id: string) => Promise<User | AppResponse>;
  deleteAllUsers: () => Promise<boolean | AppResponse>;
  updateUser: (user: Prisma.UserUpdateInput) => Promise<User | AppResponse>;
  getUser: (id?: string, username?: string) => Promise<User | AppResponse>;
  getAllUsers: () => Promise<Array<User> | AppResponse>;
}
