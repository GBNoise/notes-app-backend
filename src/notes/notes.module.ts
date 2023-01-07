import { Module } from "@nestjs/common";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";

@Module({
    imports: [],
    exports: [],
    providers: [NotesService],
    controllers: [NotesController]
})
export class NotesModule {

}