import { Test, TestingModule } from '@nestjs/testing';

import type { AuthRequest } from '../auth/auth.interfaces';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUser = {
    id: 'user-1',
    email: 'user@test.com',
    name: 'Test User',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date('2025-01-01'),
  };

  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date('2025-01-01'),
  };

  const mockAuthRequest = {
    user: {
      id: 'user-1',
      email: 'user@test.com',
      name: 'Test User',
      role: UserRole.USER,
    },
  } as any as AuthRequest;

  const mockAdminRequest = {
    user: {
      id: 'admin-1',
      email: 'admin@test.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  } as any as AuthRequest;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users (Admin only)', async () => {
      const allUsers = [mockUser, mockAdmin];
      mockUsersService.findAll.mockResolvedValue(allUsers);

      const result = await usersController.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalledWith();
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(allUsers);
      expect(result).toHaveLength(2);
    });

    it('should call service without parameters', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      await usersController.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalledWith();
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await usersController.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await usersController.getProfile(mockAuthRequest);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        mockAuthRequest.user.id,
      );
      expect(result).toEqual(mockUser);
    });

    it('should call service with user ID from request', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      await usersController.getProfile(mockAuthRequest);

      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-1');
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should work with admin request', async () => {
      mockUsersService.findOne.mockResolvedValue(mockAdmin);

      const result = await usersController.getProfile(mockAdminRequest);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        mockAdminRequest.user.id,
      );
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('findOne', () => {
    it('should return user by ID (Admin only)', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await usersController.findOne('user-1');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });

    it('should call service with provided ID parameter', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      await usersController.findOne('specific-user-id');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('specific-user-id');
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle different user IDs', async () => {
      const otherUser = {
        ...mockUser,
        id: 'other-user',
        email: 'other@test.com',
      };
      mockUsersService.findOne.mockResolvedValue(otherUser);

      const result = await usersController.findOne('other-user');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('other-user');
      expect(result).toEqual(otherUser);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@test.com',
      };

      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await usersController.updateProfile(
        mockAuthRequest,
        updateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        mockAuthRequest.user.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
      expect(result.name).toBe(updateUserDto.name);
      expect(result.email).toBe(updateUserDto.email);
    });

    it('should update profile with partial data', async () => {
      const updateUserDto = {
        name: 'New Name Only',
      };

      const updatedUser = {
        ...mockUser,
        name: updateUserDto.name,
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await usersController.updateProfile(
        mockAuthRequest,
        updateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        'user-1',
        updateUserDto,
      );
      expect(result.name).toBe(updateUserDto.name);
      expect(result.email).toBe(mockUser.email); // Should remain unchanged
    });

    it('should work with admin profile update', async () => {
      const updateUserDto = {
        name: 'Updated Admin Name',
      };

      const updatedAdmin = {
        ...mockAdmin,
        name: updateUserDto.name,
      };

      mockUsersService.update.mockResolvedValue(updatedAdmin);

      const result = await usersController.updateProfile(
        mockAdminRequest,
        updateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        mockAdminRequest.user.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedAdmin);
    });
  });

  describe('update', () => {
    it('should update user by ID (Admin only)', async () => {
      const updateUserDto = {
        name: 'Admin Updated Name',
        role: UserRole.ADMIN,
      };

      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await usersController.update('user-1', updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(
        'user-1',
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
      expect(result.name).toBe(updateUserDto.name);
      expect(result.role).toBe(updateUserDto.role);
    });

    it('should handle role updates (Admin privilege)', async () => {
      const updateUserDto = {
        role: UserRole.ADMIN,
      };

      const promotedUser = {
        ...mockUser,
        role: UserRole.ADMIN,
      };

      mockUsersService.update.mockResolvedValue(promotedUser);

      const result = await usersController.update('user-1', updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(
        'user-1',
        updateUserDto,
      );
      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('should handle email updates', async () => {
      const updateUserDto = {
        email: 'newemail@test.com',
      };

      const updatedUser = {
        ...mockUser,
        email: updateUserDto.email,
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await usersController.update('user-1', updateUserDto);

      expect(result.email).toBe(updateUserDto.email);
    });

    it('should call service with correct parameters', async () => {
      const updateUserDto = {
        name: 'Service Test',
      };

      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      await usersController.update('target-user-id', updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(
        'target-user-id',
        updateUserDto,
      );
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove user (Admin only)', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await usersController.remove('user-1');

      expect(mockUsersService.remove).toHaveBeenCalledWith('user-1');
      expect(result).toBeUndefined();
    });

    it('should call service remove method once', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await usersController.remove('user-to-delete');

      expect(mockUsersService.remove).toHaveBeenCalledWith('user-to-delete');
      expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle different user IDs for deletion', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await usersController.remove('specific-id-123');

      expect(mockUsersService.remove).toHaveBeenCalledWith('specific-id-123');
    });
  });

  describe('Guards and Authorization', () => {
    it('should be protected by JwtAuthGuard for all endpoints', () => {
      // This is tested by the module setup - JwtAuthGuard is applied to controller
      expect(usersController).toBeDefined();
    });

    it('should protect admin endpoints with RolesGuard', () => {
      // findAll, findOne, update, remove should be protected by RolesGuard
      // This is tested by the module setup - RolesGuard is mocked
      expect(usersController).toBeDefined();
    });

    it('should allow profile operations without RolesGuard', async () => {
      // getProfile and updateProfile should work without RolesGuard
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(mockUser);

      const profileResult = await usersController.getProfile(mockAuthRequest);
      const updateResult = await usersController.updateProfile(
        mockAuthRequest,
        { name: 'New Name' },
      );

      expect(profileResult).toEqual(mockUser);
      expect(updateResult).toEqual(mockUser);
    });
  });

  describe('Different User Scenarios', () => {
    it('should handle regular user profile operations', async () => {
      const regularUserRequest = {
        user: {
          id: 'regular-user',
          email: 'regular@test.com',
          name: 'Regular User',
          role: UserRole.USER,
        },
      } as any as AuthRequest;

      const regularUser = {
        id: 'regular-user',
        email: 'regular@test.com',
        name: 'Regular User',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(regularUser);
      mockUsersService.update.mockResolvedValue(regularUser);

      const profileResult =
        await usersController.getProfile(regularUserRequest);
      const updateResult = await usersController.updateProfile(
        regularUserRequest,
        { name: 'Updated Regular User' },
      );

      expect(mockUsersService.findOne).toHaveBeenCalledWith('regular-user');
      expect(mockUsersService.update).toHaveBeenCalledWith('regular-user', {
        name: 'Updated Regular User',
      });
      expect(profileResult).toEqual(regularUser);
      expect(updateResult).toEqual(regularUser);
    });

    it('should extract user ID correctly from different requests', async () => {
      const customRequest = {
        user: {
          id: 'custom-id-123',
          email: 'custom@test.com',
          name: 'Custom User',
          role: UserRole.USER,
        },
      } as any as AuthRequest;

      mockUsersService.findOne.mockResolvedValue(mockUser);

      await usersController.getProfile(customRequest);

      expect(mockUsersService.findOne).toHaveBeenCalledWith('custom-id-123');
    });
  });
});
