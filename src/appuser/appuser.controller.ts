import { Body, Controller, Delete, ForbiddenException, Get, HttpStatus, Param, Post, Put, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { AppUserService } from './appuser.service';
import { APP_USER_CONTROLLER_ROUTE, validateAdmin, validateSameUser } from './appuser.utils';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/auth/auth.utils';

@Controller(APP_USER_CONTROLLER_ROUTE)
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) { }

  @HasRoles(Roles.ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAllUsers(@Request() req: any, @Res() res: Response, @Query('showRoles') showRoles: boolean, @Query('page') page: number) {
    try {
      if (!validateAdmin(req.user)) throw new ForbiddenException();

      const response = await this.appUserService.getAllUsers({ showRoles, page });
      return res.status(200).send(response);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  }

  @HasRoles(Roles.ROLE_USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/user')
  async getSingleUser(@Request() req: any, @Query('id') id: string, @Query('username') username: string, @Res() res: Response, @Query('showRoles') showRoles: string) {
    try {
      if (!validateSameUser(req.user, id, username)) throw new ForbiddenException()

      const response = await this.appUserService.getUser(id, username, { showRoles });
      return res.status(HttpStatus.OK).send(response);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  }

  @Post()
  async createUser(@Res() res: Response, @Body() user: Prisma.UserCreateInput) {
    try {
      const response = await this.appUserService.createUser(user);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  }

  @HasRoles(Roles.ROLE_USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  async updateUser(@Request() req: any, @Res() res: Response, @Body() user: Prisma.UserUpdateInput) {
    try {
      // once this is done we need to update the access_token because if this endpoint updates the user username
      // we will no longer be able to update using the username nor doing anything related with the req.user.username
      // as it will no longer be the same
      if (!validateSameUser(req.user, user.id as string, user.username as string))
        throw new ForbiddenException()
      const response = await this.appUserService.updateUser(user);
      return res.status(HttpStatus.OK).send(response);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  }


  @HasRoles(Roles.ROLE_USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  async deleteUser(@Request() req: any, @Res() res: Response, @Param('id') id: string) {
    try {
      if (!validateSameUser(req.user, id, undefined) && !validateAdmin(req.user))
        throw new ForbiddenException()

      const response = await this.appUserService.deleteUser(id);
      return res.status(HttpStatus.OK).send(response);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  }
}
