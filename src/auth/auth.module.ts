import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppUserModule } from 'src/appuser/appuser.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './auth.utils';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    AppUserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.SECRET,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
