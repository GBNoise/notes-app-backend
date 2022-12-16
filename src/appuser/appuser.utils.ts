import { Prisma, User } from '@prisma/client';
import { AppError, API_PATH } from 'src/utils';

export const APP_USER_CONTROLLER_ROUTE: string = API_PATH + '/users';

export interface AppUserServiceInterface {
  createUser: (user: Prisma.UserCreateInput) => Promise<User | AppError>;
  deleteUser: (user: Prisma.UserDeleteArgs) => void;
  updateUser: (user: Prisma.UserUpdateInput) => void;
  getUser: (user: Prisma.UserFindFirstArgs) => Promise<User | AppError>;
  getAllUsers: () => Promise<Array<User> | AppError>;
}
