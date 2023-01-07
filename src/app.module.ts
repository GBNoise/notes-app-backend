import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './appuser/appuser.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { RolesModule } from './rolesmodel/roles.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [AppUserModule, AuthModule, RolesModule, NotesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
