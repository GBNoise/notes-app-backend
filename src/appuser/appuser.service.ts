import { Injectable } from '@nestjs/common';
import { AppUserServiceInterface } from './appuser.utils';
import { prisma } from 'prisma/prisma.utils';
import { AppResponse, generateHash } from 'src/utils';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AppUserService implements AppUserServiceInterface {
  async createUser(user: Prisma.UserCreateInput): Promise<User | AppResponse> {
    try {
      const hash = await generateHash(user.password);
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

  async getUser(id?: string, username?: string): Promise<User | AppResponse> {
    try {
      if (!username && !id) throw new Error('At least one property id or username has to be specified');

      const where = id ? { id } : { username };
      const userFound = await prisma.user.findFirst({ where });

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

  async getAllUsers(): Promise<Array<User> | AppResponse> {
    try {
      const users = await prisma.user.findMany();
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

      const updatedUser = await prisma.user.update({ where: { id: user.id as string }, data: user });

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

  async deleteUser(id: string): Promise<User | AppResponse> {
    try {
      console.log({ id });
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
