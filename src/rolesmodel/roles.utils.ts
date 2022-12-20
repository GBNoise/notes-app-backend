import { Prisma, Role, UserRoles } from '@prisma/client';
import { API_PATH, AppResponse } from '../utils';

export const ROLES_CONTROLLER_ROUTE: string = API_PATH + '/roles';

export interface RolesServiceInterface {
  getAllRoles: () => Promise<Array<Role> | AppResponse>;
  deleteRole: (id?: string, name?: string) => Promise<Role | AppResponse>;
  createRole: (role: Prisma.RoleCreateInput) => Promise<Role | AppResponse>;
  updateRole: (role: Prisma.RoleUpdateInput) => Promise<Role | AppResponse>;
  addRoleToUser: (roleName: string, username: string) => Promise<UserRoles | AppResponse>;
  removeRoleFromUser: (roleName: string, username: string) => Promise<UserRoles | AppResponse>;
}
