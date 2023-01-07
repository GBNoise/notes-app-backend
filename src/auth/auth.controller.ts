import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { HasRoles } from "./roles.decorator";
import { AUTH_CONTROLLER_ROUTE, Roles } from "./auth.utils";
import { RolesGuard } from "./roles.guard";
import { Response } from "express";

@Controller(AUTH_CONTROLLER_ROUTE)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.ACCEPTED)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @HasRoles(Roles.ROLE_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('admin')
    onlyAdmin(@Request() req) {
        return 'admin page';
    }

    @Post('refreshToken')
    async regenerateTokens(@Body('refresh_token') refreshToken: string, @Res() res: Response, @Req() req: any) {
        try {
            const bearerToken = req.headers.authorization as string
            const tokens = await this.authService.validateRefreshToken(refreshToken, bearerToken);
            return res.status(HttpStatus.CREATED).send(tokens);
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

}
