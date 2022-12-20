import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { AppUserService } from './appuser.service';
import { APP_USER_CONTROLLER_ROUTE } from './appuser.utils';

@Controller(APP_USER_CONTROLLER_ROUTE)
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) { }

  @Get()
  async getAllUsers(@Res() res: Response, @Query('showRoles') showRoles: boolean, @Query('page') page: number) {
    try {
      const response = await this.appUserService.getAllUsers({ showRoles, page });
      return res.status(200).send(response);
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  @Get('/user')
  async getSingleUser(@Query('id') id: string, @Query('username') username: string, @Res() res: Response) {
    try {
      console.log({ id, username });
      const response = await this.appUserService.getUser(id, username);
      return res.status(HttpStatus.OK).send(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
    }
  }

  @Post()
  async createUser(@Res() res: Response, @Body() user: Prisma.UserCreateInput) {
    try {
      const response = await this.appUserService.createUser(user);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  @Put()
  async updateUser(@Res() res: Response, @Body() user: Prisma.UserUpdateInput) {
    try {
      const response = await this.appUserService.updateUser(user);
      return res.status(HttpStatus.OK).send(response);
    } catch (e) {
      return res.status(500).send(e);
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() res: Response, @Param('id') id: string) {
    try {
      const response = await this.appUserService.deleteUser(id);
      return res.status(HttpStatus.OK).send(response);
    } catch (e) {
      return res.status(500).send(e);
    }
  }
}
