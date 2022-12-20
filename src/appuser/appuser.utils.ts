import { Prisma, User, Role } from '@prisma/client';
import { AppResponse, API_PATH } from '../utils';

export const APP_USER_CONTROLLER_ROUTE: string = API_PATH + '/users';

export interface AppUserServiceInterface {
  createUser: (user: Prisma.UserCreateInput) => Promise<User | AppResponse>;
  deleteUser: (id: string) => Promise<User | AppResponse>;
  deleteAllUsers: () => Promise<boolean | AppResponse>;
  updateUser: (user: Prisma.UserUpdateInput) => Promise<User | AppResponse>;
  getUser: (id?: string, username?: string, options? : GetUserOptions) => Promise<UserWithoutPassword | UserWithRoles | AppResponse>;
  getAllUsers: (options?: GetUserOptions) => Promise<Array<UserWithRoles | UserWithoutPassword> | AppResponse>;
}


export const filterGetUserOptions = (options: GetUserOptions) => {
  const { showRoles, page, includeHashedPassword } = options;
  if (!showRoles && !page && !includeHashedPassword) return;

  let select = {
    id: true,
    username: true,
    email: true,
    creationDate: true,
    updateDate: true,
  } as any


  if (showRoles === "true" || showRoles === true) select = {
    ...select,
    UserRoles: {
      select: {
        role: {
          select: { id: true, name: true }
        }
      }
    }
  }

  if (includeHashedPassword === "true" || includeHashedPassword === true) select = {
    ...select, password: true
  }


  return select;
}

export interface GetUserOptions {
  showRoles?: boolean | string;
  page?: number;
  includeHashedPassword?: boolean | string
}

export interface UserWithRoles {
  id?: string,
  username?: string;
  email?: string;
  creationDate?: Date,
  updateDate?: Date,
  UserRoles?: {
    role: { id: string, name: string }
  }
  _count?: Prisma.UserCountOutputType
}

export interface UserWithRolesAndPassword extends UserWithRoles {
  password: string
}

export interface UserWithoutPassword {
  id: string,
  username: string,
  email: string,
  creationDate: Date;
  updateDate: Date;
}