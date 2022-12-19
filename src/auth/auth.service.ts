import { Injectable } from '@nestjs/common';
import { AppUserService } from '../appuser/appuser.service';
import { compareHash } from '../utils';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Roles } from './auth.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = (await this.appUserService.getUser(undefined, username)) as User;

    const isPasswordCorrect = await compareHash(pass, user.password);
    if (!user || !isPasswordCorrect) return null;
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
      creationDate: user.creationDate,
      updateDate: user.updateDate,
      roles: [Roles.ROLE_USER],
    };

    const refreshPayload = {
      id: 'random id that needs to be changed to a significant id in the database',
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(refreshPayload),
    };
  }
}
