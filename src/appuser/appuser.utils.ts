import { Prisma, User, Role } from '@prisma/client';
import { AppResponse, API_PATH } from '../utils';

export const APP_USER_CONTROLLER_ROUTE: string = API_PATH + '/users';

/**
 * Interface that contains the methods that the AppUserService should have
 */
export interface AppUserServiceInterface {
  createUser: (user: Prisma.UserCreateInput) => Promise<User | AppResponse>;
  deleteUser: (id: string) => Promise<User | AppResponse>;
  deleteAllUsers: () => Promise<boolean | AppResponse>;
  updateUser: (user: Prisma.UserUpdateInput) => Promise<User | AppResponse>;
  getUser: (id?: string, username?: string, options?: GetUserOptions) => Promise<UserWithoutPassword | UserWithRoles | AppResponse>;
  getAllUsers: (options?: GetUserOptions) => Promise<Array<UserWithRoles | UserWithoutPassword> | AppResponse>;
}

/**
 * Function that allows to filter the GetUserOptions
 * @param options the options that the user wants to be included in the response through the url query
 * @example // example of the url
 * '${SERVER_URL}/api/${API_VERSION}/users?showRoles=true&take=10&page=1'
 * @returns the filtered select object that can be used with prisma to get users from the database
 */
export const filterGetUserOptions = (options: GetUserOptions): { select: any, take: number, skip: number } => {
  let { showRoles, page, includeHashedPassword, take } = options;
  if (!showRoles && !includeHashedPassword) return;

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

  page = page ? page <= 0 ? 1 : page : 1;
  take = take || 10;
  let skip = page ? (page * take) - take : 0;

  return { select, take: Number(take), skip };
}

/**
 * Utility function that validates if the user is ADMIN
 * @param reqUser this should be the user from the request object a.k.a the logged user
 * @returns 
 */
export const validateAdmin = (reqUser: any) => {
  return reqUser.UserRoles.some(({ role }) => role.name === "ADMIN");
}

/**
 * Utility function that validates if the reqUser has either the same id or the same username passed to the function
 * @param reqUser this should be the user from the request object a.k.a the logged user
 * @param id the id passed to compare if it is the same as the reqUser.id in case of wanting to compare the id
 * @param username the username passed to compare if it is the same as the reqUser.username in case of wanting to compare the username
 * @returns true if it is the same user or false if it is not
 */
export const validateSameUser = (reqUser: any, id: string, username: string) => {
  const { id: loggedUserId, username: loggedUserUsername } = reqUser;


  if ((id && loggedUserId !== id) || (username && loggedUserUsername !== username))
    return false

  return true
}

/**
 * The valid options to filter the getUser methods
 */
export interface GetUserOptions {
  showRoles?: boolean | string;
  page?: number;
  take?: number;
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