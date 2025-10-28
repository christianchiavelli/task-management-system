import * as bcrypt from 'bcryptjs';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from './user.entity';

import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;

  const mockUser = {
    id: 'user-1',
    email: 'test@test.com',
    name: 'Test User',
    password: 'hashedPassword123',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const mockAdmin = {
    id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin User',
    password: 'hashedPasswordAdmin',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        email: 'newuser@test.com',
        name: 'New User',
        password: 'password123',
        role: UserRole.USER,
      };

      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      mockUserRepository.create.mockReturnValue({
        ...createUserDto,
        password: 'hashedPassword123',
      });
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        email: createUserDto.email,
        name: createUserDto.name,
      });

      const result = await usersService.create(createUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword123',
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result.email).toBe(createUserDto.email);
      expect(result.name).toBe(createUserDto.name);
    });

    it('should create user with default role when role is not provided', async () => {
      const createUserDto = {
        email: 'newuser@test.com',
        name: 'New User',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      mockUserRepository.create.mockReturnValue({
        ...createUserDto,
        password: 'hashedPassword123',
        role: UserRole.USER, // Default role
      });
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        email: createUserDto.email,
        name: createUserDto.name,
        role: UserRole.USER,
      });

      const result = await usersService.create(createUserDto);

      expect(result.role).toBe(UserRole.USER);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        email: 'existing@test.com',
        name: 'New User',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser); // Existing user

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const usersWithoutPasswords = [
        {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          isActive: mockUser.isActive,
          createdAt: mockUser.createdAt,
        },
        {
          id: mockAdmin.id,
          email: mockAdmin.email,
          name: mockAdmin.name,
          role: mockAdmin.role,
          isActive: mockAdmin.isActive,
          createdAt: mockAdmin.createdAt,
        },
      ];

      mockUserRepository.find.mockResolvedValue(usersWithoutPasswords);

      const result = await usersService.findAll();

      expect(mockUserRepository.find).toHaveBeenCalledWith({
        select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
      });
      expect(result).toEqual(usersWithoutPasswords);
      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[1]).not.toHaveProperty('password');
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await usersService.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return user by id without password', async () => {
      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
      };

      mockUserRepository.findOne.mockResolvedValue(userWithoutPassword);

      const result = await usersService.findOne('user-1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
      });
      expect(result).toEqual(userWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(usersService.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user with password when found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.findByEmail('test@test.com');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(result).toEqual(mockUser);
      expect(result?.password).toBe('hashedPassword123'); // Should include password
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await usersService.findByEmail('nonexistent@test.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateUserDto = {
        name: 'Updated Name',
        role: UserRole.ADMIN,
      };

      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
      };

      const updatedUserWithoutPassword = {
        ...userWithoutPassword,
        name: updateUserDto.name,
        role: updateUserDto.role,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(userWithoutPassword) // First call for findOne check
        .mockResolvedValueOnce(updatedUserWithoutPassword); // Second call for return

      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await usersService.update('user-1', updateUserDto);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'user-1',
        updateUserDto,
      );
      expect(result.name).toBe(updateUserDto.name);
      expect(result.role).toBe(updateUserDto.role);
    });

    it('should update user email when new email is different', async () => {
      const updateUserDto = {
        email: 'newemail@test.com',
        name: 'Updated Name',
      };

      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
      };

      const updatedUserWithoutPassword = {
        ...userWithoutPassword,
        email: updateUserDto.email,
        name: updateUserDto.name,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(userWithoutPassword) // First call for findOne check
        .mockResolvedValueOnce(null) // Check for existing email (not found)
        .mockResolvedValueOnce(updatedUserWithoutPassword); // Final return

      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await usersService.update('user-1', updateUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: updateUserDto.email },
      });
      expect(result.email).toBe(updateUserDto.email);
    });

    it('should not check email uniqueness when email is not changed', async () => {
      const updateUserDto = {
        name: 'Updated Name',
      };

      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(userWithoutPassword) // First call for findOne check
        .mockResolvedValueOnce({
          // Final return
          ...userWithoutPassword,
          name: updateUserDto.name,
        });

      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      await usersService.update('user-1', updateUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2); // Only findOne checks, no email uniqueness check
    });

    it('should throw ConflictException when new email already exists', async () => {
      const updateUserDto = {
        email: 'existing@test.com',
      };

      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
      };

      mockUserRepository.findOne
        .mockResolvedValueOnce(userWithoutPassword) // First call for findOne check
        .mockResolvedValueOnce({
          // Email already exists
          id: 'other-user',
          email: updateUserDto.email,
        });

      await expect(
        usersService.update('user-1', updateUserDto),
      ).rejects.toThrow(ConflictException);

      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        usersService.update('nonexistent', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        isActive: mockUser.isActive,
        createdAt: mockUser.createdAt,
      };

      mockUserRepository.findOne.mockResolvedValue(userWithoutPassword);
      mockUserRepository.remove.mockResolvedValue(userWithoutPassword);

      await usersService.remove('user-1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt'],
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(
        userWithoutPassword,
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(usersService.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });
  });
});
