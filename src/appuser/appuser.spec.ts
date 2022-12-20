import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { encryptPassword } from '../utils';
import { AppUserController } from './appuser.controller';
import { AppUserService } from './appuser.service';

describe('AppUserServiceTest', () => {
  let appController: AppUserController;
  let service: AppUserService;

  const userMock = {
    id: expect.any(String),
    username: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    creationDate: expect.any(Date),
    updateDate: expect.any(Date),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppUserController],
      providers: [AppUserService],
    }).compile();

    appController = app.get<AppUserController>(AppUserController);
    service = app.get<AppUserService>(AppUserService);
  });

  describe('Succesfully retrieves all users', () => {
    it('should return an array or User', async () => {
      const users = await service.getAllUsers();
      expect(users).toMatchObject(expect.any(Array<User>));
    });

    it('should return the user tlmm given the username', async () => {
      const user = await service.getUser(undefined, 'tlmm');
      expect(user).toMatchObject(userMock);
    });
  });

  describe('Succesfully creates a user', () => {
    it('should delete all users', async () => {
      const isDeleted = await service.deleteAllUsers();
      expect(isDeleted).toBe(true);
    });

    it('should create a user', async () => {
      const encryptedPassword = (await encryptPassword('Lolito12')).toString();
      const user: Prisma.UserCreateInput = {
        username: 'tlmm',
        email: 'tlmm@noisexy.com',
        password: encryptedPassword,
      };

      const obj = await service.createUser(user);
      expect(obj).toMatchObject(userMock);
    });
  });
});
