import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Response, response } from 'express';
import { AppUserService } from './appuser.service';
import { APP_USER_CONTROLLER_ROUTE } from './appuser.utils';

@Controller(APP_USER_CONTROLLER_ROUTE)
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Get()
  async getAllUsers(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .send(await this.appUserService.getAllUsers());
  }
}
