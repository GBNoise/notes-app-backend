import { Injectable } from '@nestjs/common';
import { AppUserServiceInterface, GetUserOptions, UserWithRoles, UserWithRolesAndPassword, UserWithoutPassword, filterGetUserOptions } from './appuser.utils';
import { prisma } from '../../prisma/prisma.utils';
import { AppResponse, decryptPassword, generateHash } from '../utils';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AppUserService implements AppUserServiceInterface {

  /**
   * Creates a user in the database,
   * decrypts the user password sent from the frontent
   * & hashes the user decrypted password
   * @param {Prisma.UserCreateInput} user The object containing the user properties
   * @returns {Promise<User | AppResponse>} This function returns a Promise of the created 
   * user or an AppResponse in case of error
  */
  async createUser(user: Prisma.UserCreateInput): Promise<User | AppResponse> {
    try {
      // decrypt the passsord from the user object
      const decryptedPassword = await decryptPassword(user.password);
      // hash the decrypted password
      const hash = await generateHash(decryptedPassword);
      // set the user object password to the hash
      user.password = hash;
      // create a user in the database
      const createdUser = await prisma.user.create({ data: user });
      // return the created user
      return Promise.resolve(createdUser);
    } catch (e) {
      // in case of error
      const error: AppResponse = {
        message: 'An error ocurred while trying to create a user',
        technicalMessage: e.message,
        status: 500
      };
      return Promise.reject(error);
    }
  }

  /**
   * Function to retrieve a single user from the database
   * @param {string} id provide an id in case of wanting to get a user with the id property
   * @param {string} username provide a username in case of wanting to get a user with the username property
   * @param {GetUserOptions} options object to filter the object retrieved from the database 
   */
  async getUser(id?: string, username?: string, options?: GetUserOptions):
    Promise<UserWithoutPassword | UserWithRoles | UserWithRolesAndPassword | AppResponse> {
    try {
      // in case of not having an id nor a username throw an error
      if (!username && !id)
        throw new Error('At least one property id or username has to be specified');

      // this variable contains the filtering options that will be passed to prisma
      let select = {}
      // in case of having options we use the filterGetUserOptions to fill the select object
      if (options) select = filterGetUserOptions(options);

      // where will be either the id or username depending on what was passed to the function
      const where = id ? { id } : { username };
      // retreive the user from the database using findFirst passing where and select  
      const userFound = await prisma.user.findFirst({ where, select }) as UserWithoutPassword | UserWithRoles;

      // if no user was found throw an error
      if (!userFound) throw new Error(`User with id: ${id} or username:${username} was not found`);

      // return the user found
      return Promise.resolve(userFound);
    } catch (e) {
      // in case of error
      const error: AppResponse = {
        message: 'An error ocurred while trying to find a unique user',
        technicalMessage: e.message,
        status: 500
      };
      return Promise.reject(error);
    }
  }

  /**
   * Function to get all the users from the database
   * @param {GetUserOptions} options object to filter the object retrieved from the database
   * @returns a promise of UserWithRoles[] or UserWithoutPassword[]
   */
  async getAllUsers(options?: GetUserOptions): Promise<Array<UserWithRoles | UserWithoutPassword> | AppResponse> {
    try {
      // this variable contains the filtering options that will be passed to prisma
      let select = {};
      // in case of having options we use the filterGetUserOptions to fill the select object
      if (options) select = filterGetUserOptions(options);

      // retrieving the users from the database using findMany and passing select
      const users = await prisma.user.findMany({
        select
      }) as UserWithRoles[] | UserWithoutPassword[]

      // returning the users
      return Promise.resolve(users);
    } catch (e) {
      // in case of error
      const error: AppResponse = {
        message: e.message,
        status: 500
      };
      return Promise.reject(error);
    }
  }

  /**
   * Function to update a user
   * @param {Prisma.UserUpdateInput} user the user properties to be updated
   * @returns the updated user object
   */
  async updateUser(user: Prisma.UserUpdateInput): Promise<User | AppResponse> {
    try {
      // in case of not having an id throw an error
      if (!user.id) throw new Error('The user id is required to update the entity');

      // updating the user 
      const updatedUser = await prisma.user.update({
        where: { id: user.id as string },
        data: user,
      });

      // if the updated user is empty throw an error
      if (!updatedUser) throw new Error('The user could not be updated because it might not exist');

      // returning the updated user
      return Promise.resolve(updatedUser);
    } catch (e) {
      // in case of error
      const error: AppResponse = {
        message: 'An error ocurred while trying to update the user',
        technicalMessage: e.message,
        status: 500
      };
      return Promise.reject(error);
    }
  }

  /**
   * Function to delete all the users from the database
   * @returns true in case of succesfully deleting all the users
   */
  async deleteAllUsers(): Promise<boolean | AppResponse> {
    try {
      // deleting all the users
      const deletedUsers = await prisma.user.deleteMany();

      if (deletedUsers) return Promise.resolve(true);
      return Promise.resolve(false)
    } catch (e) {
      // in case of error
      const error: AppResponse = {
        message: 'An error ocurred while trying to delete all users',
        technicalMessage: e.message,
        status: 500
      };
      return Promise.reject(error);
    }
  }

  /**
   * Function to delete a single user
   * @param {string} id the id of the user that will be deleted 
   * @returns  the deleted user object
   */
  async deleteUser(id: string): Promise<User | AppResponse> {
    try {
      // deleting the user with the user id
      const deletedUser = await prisma.user.delete({ where: { id } });
      // return the deleted user
      return Promise.resolve(deletedUser);
    } catch (e) {
      // in case of error
      const error: AppResponse = {
        message: `An error ocurred while trying to delete the user with id: ${id}`,
        technicalMessage: e.message,
        status: 500
      };
      return Promise.reject(error);
    }
  }
}
