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

  /**
   * GET endpoint in the AppUserController that allows to retrieve all the users from the database
   * requires the user making the request to have the ADMIN role
   * and to also have valid token credentials
   * @param {any} req the request object 
   * @param {Response} res the response object 
   * @param {boolean | string} showRoles query used to specify if the response should include the user roles
   * @param {string} page query used to specify the page of users 
   * @returns returns an array of users
   */
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

  /**
   * GET endpoint in the AppUserController that allows to retrieve a single user from the database
   * using the user id or username passed from the query
   * requires the user making the request to have the USER role
   * and to also have valid token credentials
   * @param {any} req the request object 
   * @param {string} id query of the user id in case of wanting to get the user with the id 
   * @param {string} username query of the user username in case of wanting to get the user with the username 
   * @param {Response} res the response object 
   * @param {string} showRoles query used to specify if the response should include the user roles
   * @returns a user object
   */
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

  /**
   * POST endpoint in the AppUserController that allows to create a user from the database
   * @param {Resonse} res the response object 
   * @param {Prisma.UserCreateInput} user the user properties that will be used to create a user in the database 
   * @returns the created user
   */
  @Post()
  async createUser(@Res() res: Response, @Body() user: Prisma.UserCreateInput) {
    try {
      const response = await this.appUserService.createUser(user);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  }

  /**
   * PUT endpoint in the AppUserController that allows to updated a user entity 
   * @param req the request object
   * @param res the response object 
   * @param user the user object containing the properties that will be updated
   * @returns the user with the updated properties
   */
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


  /**
   * DELETE endpoint in the AppUserController that allows to delete a user
   * it is required for the user to be the same user passed in the auth tokens
   * @param req the request object
   * @param res the response object 
   * @param id the id of the user that will be deleted pasesed through the link params
   * @returns the deleted user
   */
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
