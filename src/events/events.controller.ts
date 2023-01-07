import { Body, Controller, Delete, ForbiddenException, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { prisma, Prisma } from '@prisma/client';
import { Response } from 'express';
import { validateSameUser } from 'src/appuser/appuser.utils';
import { Roles } from 'src/auth/auth.utils';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HasRoles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { EventsService } from './events.service';
import { EVENTS_CONTROLLER_ROUTE } from './events.utils';

@Controller(EVENTS_CONTROLLER_ROUTE)
export class EventsController {
    // controller needs testing
    constructor(private readonly eventsService: EventsService) { }

    @HasRoles(Roles.ROLE_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAllEvents(@Res() res: Response, @Query("take") take: number, @Query("page") page: number) {
        try {
            const response = this.eventsService.getAllEvents({ take, page });
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/:userID')
    async getUserEvents(@Res() res: Response, @Req() req: any, @Param("userID") userID: string,
        @Query("take") take: number, @Query("page") page: number) {
        try {
            const isSameUser = validateSameUser(req.user, userID, undefined);
            if (!isSameUser) throw new ForbiddenException();

            const response = await this.eventsService.getUserEvents(userID, { take, page })
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createEvent(@Res() res: Response, @Req() req: any, @Body() event: Prisma.EventCreateInput) {
        try {
            const { id } = req.user;
            const response = await this.eventsService.createEvent(id, event);
            return res.status(HttpStatus.CREATED).send(response);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete("/:id")
    async deleteEvent(@Res() res: Response, @Param("id") noteID: string) {
        try {
            const response = await this.eventsService.deleteEvent(noteID);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

    @HasRoles(Roles.ROLE_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete()
    async deleteAllEvents(@Res() res: Response) {
        try {
            const response = await this.eventsService.deleteAllEvents();
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete("/user/:id")
    async deleteUserEvents(@Res() res: Response, @Req() req: any, @Param("id") userID: string) {
        try {
            const isSameUser = validateSameUser(req.user, userID, undefined);
            if (!isSameUser) throw new ForbiddenException();

            const response = await this.eventsService.deleteAllUserEvents(userID);
            return res.status(HttpStatus.OK).send(response);

        } catch (e) {
            return res.status(e.status).send(e)
        }
    }

    @HasRoles(Roles.ROLE_USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put()
    async updateEvent(@Res() res: Response, @Body() event: Prisma.EventUpdateInput) {
        try {
            const response = await this.eventsService.updateEvent(event);
            return res.status(HttpStatus.OK).send(response);
        } catch (e) {
            return res.status(e.status).send(e)
        }
    }

}
