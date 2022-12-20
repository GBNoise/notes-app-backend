import { Body, Controller, Delete, Get, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { RolesService } from './roles.service';
import { ROLES_CONTROLLER_ROUTE } from './roles.utils';
import { HasRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/auth/auth.utils';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller(ROLES_CONTROLLER_ROUTE)
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get()
  async getAllRoles(@Res() res: Response) {
    try {
      const roles = await this.rolesService.getAllRoles();
      return res.status(200).send(roles);
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  @HasRoles(Roles.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createRole(@Res() res: Response, @Body() role: Prisma.RoleCreateInput) {
    try {
      const createdRole = await this.rolesService.createRole(role);
      return res.status(200).send(createdRole);
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  @HasRoles(Roles.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  async updateRole(@Res() res: Response, @Body() role: Prisma.RoleUpdateInput) {
    try {
      const updatedRole = await this.rolesService.updateRole(role);
      return res.status(200).send(updatedRole);
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  @HasRoles(Roles.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  async deleteRole(@Res() res: Response, @Query('id') id: string, @Query('name') name: string) {
    try {
      const deletedRole = await this.rolesService.deleteRole(id, name);
      return res.status(200).send(deletedRole);
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  @HasRoles(Roles.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add')
  async addRoleToUser(@Res() res: Response, @Body('roleName') roleName: string, @Body("username") username: string) {
    try {
      const addedRoleToUser = await this.rolesService.addRoleToUser(roleName, username);
      return res.status(200).send(addedRoleToUser)
    } catch (e) {
      return res.status(500).send(e)
    }
  }

  @HasRoles(Roles.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('remove')
  async removeRoleFromUse(@Res() res: Response, @Body('roleName') roleName: string, @Body("username") username: string) {
    try {
      const removedRoleFromUser = await this.rolesService.removeRoleFromUser(roleName, username);
      return res.status(200).send(removedRoleFromUser);
    } catch (e) {
      return res.status(500).send(e)
    }
  }
}
