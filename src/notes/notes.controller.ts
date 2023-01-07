import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Response } from "express";
import { validateAdmin, validateSameUser } from "src/appuser/appuser.utils";
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

    @HasRoles(Roles.ROLE_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAllNotes(@Res() res: Response, @Query('take') take: number,
        @Query("page") page: number) {
        try {
            const response = await this.notesService.getAllNotes({ take, page })
            return res.status(200).send(response);
        } catch (e) {
            return res.status(e.status).send(e)
        }
    }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:userID')
    async getUserNotes(@Res() res: Response, @Req() req: any, @Param("userID") userID: string) {
        try {
            const isSameUser = validateSameUser(req.user, userID, undefined);
            // const isAdmin = validateAdmin(req.user);
            if (!isSameUser) throw new ForbiddenException()

            const response = await this.notesService.getUserNotes(userID);
            return res.status(200).send(response);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/:userID')
    async deleteUserNotes(@Res() res: Response, @Req() req: any, @Param("userID") userID: string) {
        try {
            const isSameUser = validateSameUser(req.user, userID, undefined);
            if (!isSameUser) throw new ForbiddenException()
            const response = await this.notesService.deleteUserNotes(userID);
            return res.status(200).send(response);
        } catch (e) {
            return res.status(e.status).send(e)
        }
    }

    @HasRoles(Roles.ROLE_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete()
    async deleteAllNotes(@Res() res: Response) {
        try {
            const response = await this.notesService.deleteAllNotes();
            return res.status(200).send(response);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }
} 