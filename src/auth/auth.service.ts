import { ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AppUserService } from '../appuser/appuser.service';
import { AppResponse, compareHash } from '../utils';
import { JwtService } from '@nestjs/jwt';
import { UserWithRolesAndPassword } from 'src/appuser/appuser.utils';
import { AccessToken, ACCESS_TOKEN_DURATION, RefreshToken, REFRESH_TOKEN_DURATION } from './auth.utils';
import { prisma } from 'prisma/prisma.utils';
import { AuthToken } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = (await this.appUserService.getUser(undefined, username, { showRoles: true, includeHashedPassword: true })) as UserWithRolesAndPassword;

    const isPasswordCorrect = await compareHash(pass, user.password);
    if (!user || !isPasswordCorrect) return null;
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
      creationDate: user.creationDate,
      updateDate: user.updateDate,
      UserRoles: user.UserRoles,
    };

    const refreshPayload = {
      id: 'random id that needs to be changed to a significant id in the database',
    };

    const access_token = await this.generateAccessToken(payload)
    const refresh_token = await this.generateRefreshToken(refreshPayload)

    return {
      access_token: access_token['access_token'],
      refresh_token: refresh_token["refresh_token"],
    };
  }


  async generateAccessToken(payload: AccessToken): Promise<{ access_token: string }> {
    try {
      const access_token = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_DURATION })
      await this.saveAuthToken(access_token);
      return Promise.resolve({ access_token })
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async generateRefreshToken(payload: RefreshToken): Promise<{ refresh_token: string }> {
    try {
      const refresh_token = this.jwtService.sign(payload, { expiresIn: REFRESH_TOKEN_DURATION })
      await this.saveAuthToken(refresh_token);
      return Promise.resolve({ refresh_token })
    }
    catch (e) {
      throw new InternalServerErrorException()
    }
  }


  async saveAuthToken(token: string): Promise<AuthToken> {
    try {
      const savedToken = await prisma.authToken.create({
        data: { id: token }
      })
      return savedToken;
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async validateDBAuthToken(token: string): Promise<AuthToken> {
    try {
      const savedToken = await prisma.authToken.findFirst({
        where: { id: token }
      })
      if (!savedToken) throw new ForbiddenException()

      return savedToken;
    } catch (e) {
      throw new ForbiddenException()
    }
  }

  async validateRefreshToken(token: string, bearerToken: string) {
    try {
      // validate token expiration
      this.jwtService.verify(token)

      // decode the token
      const decodedToken = this.jwtService.decode(token);

      // validate existing token on the database
      token = (await this.validateDBAuthToken(token)).id;

      bearerToken = bearerToken.substring("Bearer ".length);
      // access to the bearer token
      const decodedBearerToken = this.jwtService.decode(bearerToken) as AccessToken;


      // generate new access and refresh token
      const access_token = this.generateAccessToken(decodedBearerToken);
      const refresh_token = this.generateRefreshToken({} as RefreshToken);

      const tokens = { ...access_token, ...refresh_token };

      // return the tokens
      return Promise.resolve(tokens);
    } catch (e) {
      const error: AppResponse = {
        message: "An error ocurred while trying to generate new tokens",
        technicalMessage: e.message,
        status: HttpStatus.FORBIDDEN
      }
      return Promise.reject(error)
    }
  }

}
