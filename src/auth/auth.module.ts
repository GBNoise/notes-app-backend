import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppUserModule } from 'src/appuser/appuser.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [AppUserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
