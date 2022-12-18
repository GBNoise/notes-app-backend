import { Module } from '@nestjs/common';
import { AppUserController } from './appuser.controller';
import { AppUserService } from './appuser.service';

@Module({
  imports: [],
  controllers: [AppUserController],
  providers: [AppUserService],
  exports: [AppUserService],
})
export class AppUserModule {}
