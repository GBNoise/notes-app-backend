import { Injectable } from '@nestjs/common';
import { AppUserServiceInterface, GetUserOptions, UserWithRoles, UserWithRolesAndPassword, UserWithoutPassword, filterGetUserOptions } from './appuser.utils';
import { prisma } from '../../prisma/prisma.utils';
import { AppResponse, decryptPassword, generateHash } from '../utils';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AppUserService implements AppUserServiceInterface {
  async createUser(user: Prisma.UserCreateInput): Promise<User | AppResponse> {
    try {
      const decryptedPassword = await decryptPassword(user.password);
      const hash = await generateHash(decryptedPassword);
      user.password = hash;

      const createdUser = await prisma.user.create({ data: user });
      return Promise.resolve(createdUser);
    } catch (e) {
      const error: AppResponse = {
        message: 'An error ocurred while trying to create a user',
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }

  async getUser(id?: string, username?: string, options?: GetUserOptions):
    Promise<UserWithoutPassword | UserWithRoles | UserWithRolesAndPassword | AppResponse> {
    try {
      if (!username && !id)
        throw new Error('At least one property id or username has to be specified');

      let select = {}
      if (options) select = filterGetUserOptions(options);

      const where = id ? { id } : { username };
      const userFound = await prisma.user.findFirst({ where, select }) as UserWithoutPassword | UserWithRoles;

      if (!userFound) throw new Error(`User with id: ${id} or username:${username} was not found`);

      return Promise.resolve(userFound);
    } catch (e) {
      const error: AppResponse = {
        message: 'An error ocurred while trying to find a unique user',
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }

  async getAllUsers(options?: GetUserOptions): Promise<Array<UserWithRoles | UserWithoutPassword> | AppResponse> {
    try {
      let select = {};
      if (options) select = filterGetUserOptions(options);

      const users = await prisma.user.findMany({
        select
      }) as UserWithRoles[] | UserWithoutPassword[]

      return Promise.resolve(users);
    } catch (e) {
      const error: AppResponse = {
        message: e.message,
      };
      return Promise.reject(error);
    }
  }

  async updateUser(user: Prisma.UserUpdateInput): Promise<User | AppResponse> {
    try {
      if (!user.id) throw new Error('The user id is required to update the entity');

      const updatedUser = await prisma.user.update({
        where: { id: user.id as string },
        data: user,
      });

      if (!updatedUser) throw new Error('The user could not be updated because it might not exist');

      return Promise.resolve(updatedUser);
    } catch (e) {
      const error: AppResponse = {
        message: 'An error ocurred while trying to update the user',
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }

  async deleteAllUsers(): Promise<boolean | AppResponse> {
    try {
      const deletedUsers = await prisma.user.deleteMany();
      if (deletedUsers) return Promise.resolve(true);
    } catch (e) {
      const error: AppResponse = {
        message: 'An error ocurred while trying to delete all users',
        technicalMessage: e.message,
      };
      return Promise.resolve(error);
    }
  }

  async deleteUser(id: string): Promise<User | AppResponse> {
    try {
      const deletedUser = await prisma.user.delete({ where: { id } });
      return Promise.resolve(deletedUser);
    } catch (e) {
      const error: AppResponse = {
        message: `An error ocurred while trying to delete the user with id: ${id}`,
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }
}
