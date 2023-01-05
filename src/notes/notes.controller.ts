import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";
import { Roles } from "src/auth/auth.utils";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { HasRoles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { NotesService } from "./notes.service";
import { NOTES_CONTROLLER_ROUTE } from "./notes.utils";

@Controller(NOTES_CONTROLLER_ROUTE)
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createNote(@Req() req: any, @Res() res: Response, @Body() note: Prisma.NoteCreateInput) {
        try {
            const { id } = req.user;
            const response = await this.notesService.createNote(note, id as string);
            return res.status(201).send(response);
        } catch (e) {
            return res.status(e.status).send(e)
        }
    }
}