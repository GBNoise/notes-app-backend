import { Injectable } from '@nestjs/common';
import { Role, Prisma, UserRoles } from '@prisma/client';
import { prisma } from '../../prisma/prisma.utils';
import { AppResponse } from 'src/utils';
import { RolesServiceInterface } from './roles.utils';

@Injectable()
export class RolesService implements RolesServiceInterface {
  async getAllRoles(): Promise<Role[] | AppResponse> {
    try {
      const roles = await prisma.role.findMany();
      return Promise.resolve(roles);
    } catch (e) {
      const error: AppResponse = {
        message: 'an error ocurred while trying to find all roles',
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }
  async deleteRole(id?: string, name?: string): Promise<Role | AppResponse> {
    try {
      if (!id && !name) throw new Error('must give an id or a name to find the role');
      const where = id ? { id } : { name };
      const deletedRole = await prisma.role.delete({ where });
      return Promise.resolve(deletedRole);
    } catch (e) {
      const error: AppResponse = {
        message: `an error ocurred while trying to delete a role with id: ${id} or name: ${name}`,
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }
  async createRole(role: Prisma.RoleCreateInput): Promise<Role | AppResponse> {
    try {
      const createdRole = await prisma.role.create({ data: role });
      return Promise.resolve(createdRole);
    } catch (e) {
      const error: AppResponse = {
        message: `an error ocurred while trying to create the role`,
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }
  async updateRole(role: Prisma.RoleUpdateInput): Promise<Role | AppResponse> {
    try {
      const updatedRole = await prisma.role.update({
        where: { id: role.id as string },
        data: role,
      });
      return Promise.resolve(updatedRole);
    } catch (e) {
      const error: AppResponse = {
        message: `an error ocurred while trying to update a role`,
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }
  async addRoleToUser(roleName: string, username: string): Promise<AppResponse | UserRoles> {
    try {
      const addedRoleToUser = await prisma.userRoles.create({
        data: {
          user: { connect: { username } },
          role: { connect: { name: roleName } },
        },
      });
      return Promise.resolve(addedRoleToUser);
    } catch (e) {
      const error: AppResponse = {
        message: `an error ocurred while trying to add the role: ${roleName} to user: ${username}`,
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }

  async removeRoleFromUser(roleName: string, username: string): Promise<AppResponse | UserRoles> {
    try {
      const { id } = await prisma.userRoles.findFirst({
        where: {
          user: { username },
          role: { name: roleName },
        },
      });

      const removedRecord = await prisma.userRoles.delete({ where: { id } });
      return Promise.resolve(removedRecord);
    } catch (e) {
      const error: AppResponse = {
        message: `an error ocurred while trying to remove the role: ${roleName} to user: ${username}`,
        technicalMessage: e.message,
      };
      return Promise.reject(error);
    }
  }
}
