import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { HasRoles } from "./roles.decorator";
import { AUTH_CONTROLLER_ROUTE, Roles } from "./auth.utils";
import { RolesGuard } from "./roles.guard";

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
}