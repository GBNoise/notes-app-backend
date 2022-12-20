import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './appuser/appuser.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './rolesmodel/roles.module';

@Module({
  imports: [AppUserModule, AuthModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
