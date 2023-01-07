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

  /**
   * Function that validates a user in the application based on the credentials passed
   * @param username the username of the user trying to log in
   * @param pass the password of the user trying to log in
   * @returns the user or null based on credentials validation
   */
  async validateUser(username: string, pass: string): Promise<any> {
    // the user retrieved from the database
    const user = (await this.appUserService.getUser(undefined, username, { showRoles: true, includeHashedPassword: true })) as UserWithRolesAndPassword;
    // if the user does not exist in the db return invalid
    if (!user) return null;
    // comparing if passwords match
    const isPasswordCorrect = await compareHash(pass, user.password);

    // if the passwords do not match return invalid
    if (!isPasswordCorrect) return null;

    // filtering the password from the user object and leaving the rest in result
    const { password, ...result } = user;

    // return the user properties
    return result;
  }

  /**
   * Function that log a user in the application 
   * @param user the user object
   * @returns an access and refresh token with the user credentials 
   */
  async login(user: any) {
    // payload that will be stored in the access token
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
      creationDate: user.creationDate,
      updateDate: user.updateDate,
      UserRoles: user.UserRoles,
    };

    // !!! this should be changed to make refresh tokens significant
    // payload that will be stored in the refresh token
    const refreshPayload = {
      id: 'random id that needs to be changed to a significant id in the database',
    };

    // generating the tokens with their respective payload
    const access_token = await this.generateAccessToken(payload)
    const refresh_token = await this.generateRefreshToken(refreshPayload)

    // returning the tokens to the user
    return {
      access_token: access_token['access_token'],
      refresh_token: refresh_token["refresh_token"],
    };
  }


  /**
   * Function that generates an access token and saves it in the database
   * @param payload the properties that will be stored in the token
   * @returns an access token containing the payload passed
   */
  async generateAccessToken(payload: AccessToken): Promise<{ access_token: string }> {
    try {
      // signing the token
      const access_token = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_DURATION })
      // saving the token in the db
      await this.saveAuthToken(access_token);
      // returning the token
      return Promise.resolve({ access_token })
    } catch (e) {
      // in case of error
      throw new InternalServerErrorException()
    }
  }

  /**
   * Function that generates an refresh token and saves it in the database
   * @param payload the properties that will be stored in the token
   * @returns a refresh token containing the payload passed
   */
  async generateRefreshToken(payload: RefreshToken): Promise<{ refresh_token: string }> {
    try {
      // signing the token
      const refresh_token = this.jwtService.sign(payload, { expiresIn: REFRESH_TOKEN_DURATION })
      // saving the token in the db
      await this.saveAuthToken(refresh_token);
      // returning the token
      return Promise.resolve({ refresh_token })
    }
    catch (e) {
      // in case of error
      throw new InternalServerErrorException()
    }
  }

  /**
   * Function that stores a token in the database
   * @param token the token that will be stored in the database
   * @returns the saved token
   */
  async saveAuthToken(token: string): Promise<AuthToken> {
    try {
      // saving the token
      const savedToken = await prisma.authToken.create({
        data: { id: token }
      })
      // returning the token
      return savedToken;
    } catch (e) {
      // in case of error
      throw new InternalServerErrorException()
    }
  }

  /**
   * Function that validates if a token is present in the db
   * @param token the token that will be searched in the database
   * @returns the token in case of being valid
   */
  async validateDBAuthToken(token: string): Promise<AuthToken> {
    try {
      // searching the token
      const savedToken = await prisma.authToken.findFirst({
        where: { id: token }
      })
      // if it does not exist
      if (!savedToken) throw new ForbiddenException()

      // returning the saved token
      return savedToken;
    } catch (e) {
      // in case of error
      throw new ForbiddenException()
    }
  }

  /**
   * Function that validates a refresh token and generates new tokens in case of the refresh token being valid
   * @param token the refresh token that will be validated
   * @param bearerToken the access token from the auth header
   * @returns new tokens
   */
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
