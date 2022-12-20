import { SetMetadata } from '@nestjs/common';
import { Roles } from './auth.utils';

export const HasRoles = (...roles: Roles[]) => SetMetadata('roles', roles);
