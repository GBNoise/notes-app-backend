import { Injectable } from '@nestjs/common';
import { AppUserService } from 'src/appuser/appuser.service';
import { compareHash } from 'src/utils';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly appUserService: AppUserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = (await this.appUserService.getUser(undefined, username)) as User;

    const isPasswordCorrect = await compareHash(pass, user.password);
    if (!user || !isPasswordCorrect) return null;
    const { password, ...result } = user;
    return result;
  }
}
