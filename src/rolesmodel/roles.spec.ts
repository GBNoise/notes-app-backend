import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesTests', () => {
  let rolesController: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile()

    rolesController = app.get<RolesController>(RolesController);
    service = app.get<RolesService>(RolesService);
  })

  const userRoleMock = {
    id: expect.any(String),
    userId: expect.any(String),
    roleId: expect.any(String),
  }

  describe("Roles on User Test", () => {
    it("should be able to add role to user", async () => {
      const roleAddedToUser = await service.addRoleToUser('ADMIN', "tlmm");
      expect(roleAddedToUser).toMatchObject(userRoleMock)
    })

    it("should be able to remove role from user", async () => {
      const roleRemovedFromUser = await service.removeRoleFromUser("ADMIN", "tlmm")
      expect(roleRemovedFromUser).toMatchObject(userRoleMock);
    })
  })
});
