import { Injectable } from '@nestjs/common';
import { AppUserServiceInterface } from './appuser.utils';
import { prisma } from 'prisma/prisma.utils';
import { AppError } from 'src/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppUserService implements AppUserServiceInterface {
  async createUser(user: Prisma.UserCreateInput) {
    try {
      const createdUser = await prisma.user.create({ data: user });
      return createdUser;
    } catch (e) {
      const error: AppError = {
        message: 'An error ocurred while trying to create a user',
        technicalMessage: e,
      };
      return error;
    }
  }

  async getUser(user: Prisma.UserFindFirstArgs) {
    try {
      const userFound = prisma.user.findFirst(user);
      return userFound;
    } catch (e) {
      const error: AppError = {
        message: 'An error ocurred while trying to find a unique user',
        technicalMessage: e,
      };
      return error;
    }
  }

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (e) {
      const error: AppError = {
        message: e,
      };
      return error;
    }
  }

  updateUser: (user: Prisma.UserUpdateInput) => void;
  async deleteUser(user: {}) {}
}
