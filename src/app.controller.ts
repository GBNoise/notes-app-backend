import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Render,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Roles } from './auth/auth.utils';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { HasRoles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) { }

  @Get()
  @Render('index')
  root() {
    return { message: 'Hello World!' };
  }

  @Get('/views/css/*')
  @Header('Content-Type', 'text/css')
  css() {
    return path.join(__dirname, '/views/css/index.css')
  }

}
