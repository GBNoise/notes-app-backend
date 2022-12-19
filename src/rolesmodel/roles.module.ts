import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [],
  exports: [],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
