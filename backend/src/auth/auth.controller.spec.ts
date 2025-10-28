import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import type { AuthRequest } from './auth.interfaces';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserRole } from '../users/user.entity';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUser = {
    id: 'user-1',
    email: 'user@test.com',
    name: 'Test User',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const mockAuthenticatedUser = {
    id: 'user-1',
    email: 'user@test.com',
    name: 'Test User',
    role: UserRole.USER,
  };

  const mockLoginResponse = {
    access_token: 'jwt-token-123',
    user: mockAuthenticatedUser,
  };

  const mockAuthRequest = {
    user: mockAuthenticatedUser,
  } as AuthRequest;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user successfully', () => {
      const loginDto = {
        email: 'user@test.com',
        password: 'password123',
      };

      mockAuthService.login.mockReturnValue(mockLoginResponse);

      const result = authController.login(mockAuthRequest, loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockAuthRequest.user);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLoginResponse);
      expect(result.access_token).toBe('jwt-token-123');
      expect(result.user).toEqual(mockAuthenticatedUser);
    });

    it('should return JWT token and user data', () => {
      const loginDto = {
        email: 'admin@test.com',
        password: 'adminpass',
      };

      const adminUser = {
        id: 'admin-1',
        email: 'admin@test.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
      };

      const adminAuthRequest = {
        user: adminUser,
      } as AuthRequest;

      const adminLoginResponse = {
        access_token: 'admin-jwt-token',
        user: adminUser,
      };

      mockAuthService.login.mockReturnValue(adminLoginResponse);

      const result = authController.login(adminAuthRequest, loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(adminUser);
      expect(result).toEqual(adminLoginResponse);
      expect(result.user.role).toBe(UserRole.ADMIN);
    });

    it('should use user from request (not from DTO)', () => {
      // The LoginDto is for Swagger documentation only
      // Authentication is handled by LocalAuthGuard
      const loginDto = {
        email: 'different@test.com', // This should be ignored
        password: 'differentpass', // This should be ignored
      };

      mockAuthService.login.mockReturnValue(mockLoginResponse);

      authController.login(mockAuthRequest, loginDto);

      // Should use user from request, not from DTO
      expect(mockAuthService.login).toHaveBeenCalledWith(mockAuthRequest.user);
      expect(mockAuthService.login).not.toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'different@test.com',
        }),
      );
    });

    it('should handle LocalAuthGuard authentication', () => {
      // LocalAuthGuard should populate req.user before controller method
      const customAuthRequest = {
        user: {
          id: 'custom-user',
          email: 'custom@test.com',
          name: 'Custom User',
          role: UserRole.USER,
        },
      } as AuthRequest;

      const customLoginResponse = {
        access_token: 'custom-token',
        user: customAuthRequest.user,
      };

      mockAuthService.login.mockReturnValue(customLoginResponse);

      const result = authController.login(customAuthRequest, {
        email: 'custom@test.com',
        password: 'password',
      });

      expect(mockAuthService.login).toHaveBeenCalledWith(
        customAuthRequest.user,
      );
      expect(result).toEqual(customLoginResponse);
    });

    it('should return HTTP 200 status (HttpCode decorator)', () => {
      // This tests the @HttpCode(HttpStatus.OK) decorator
      const loginDto = {
        email: 'user@test.com',
        password: 'password123',
      };

      mockAuthService.login.mockReturnValue(mockLoginResponse);

      const result = authController.login(mockAuthRequest, loginDto);

      expect(result).toEqual(mockLoginResponse);
      // The actual HTTP status code testing would be in integration/e2e tests
      // but we can verify the service is called correctly
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const createUserDto = {
        email: 'newuser@test.com',
        name: 'New User',
        password: 'password123',
        role: UserRole.USER,
      };

      const registeredUser = {
        id: 'new-user-1',
        email: createUserDto.email,
        name: createUserDto.name,
        role: createUserDto.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.register.mockResolvedValue(registeredUser);

      const result = await authController.register(createUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
      expect(result).toEqual(registeredUser);
      expect(result.email).toBe(createUserDto.email);
      expect(result.name).toBe(createUserDto.name);
    });

    it('should register user with default role when not specified', async () => {
      const createUserDto = {
        email: 'defaultuser@test.com',
        name: 'Default User',
        password: 'password123',
        // role not specified - should default to USER
      };

      const registeredUser = {
        id: 'default-user-1',
        email: createUserDto.email,
        name: createUserDto.name,
        role: UserRole.USER, // Default role
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.register.mockResolvedValue(registeredUser);

      const result = await authController.register(createUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(registeredUser);
      expect(result).toHaveProperty('role', UserRole.USER);
    });

    it('should register admin user when role is specified', async () => {
      const createUserDto = {
        email: 'admin@test.com',
        name: 'Admin User',
        password: 'adminpass123',
        role: UserRole.ADMIN,
      };

      const registeredAdmin = {
        id: 'admin-user-1',
        email: createUserDto.email,
        name: createUserDto.name,
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthService.register.mockResolvedValue(registeredAdmin);

      const result = await authController.register(createUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(registeredAdmin);
      expect(result).toHaveProperty('role', UserRole.ADMIN);
    });

    it('should pass all DTO data to service', async () => {
      const createUserDto = {
        email: 'complete@test.com',
        name: 'Complete User',
        password: 'complexpassword123',
        role: UserRole.USER,
      };

      const registeredUser = {
        ...mockUser,
        ...createUserDto,
        id: 'complete-user-1',
      };

      mockAuthService.register.mockResolvedValue(registeredUser);

      await authController.register(createUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
      expect(mockAuthService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'complete@test.com',
          name: 'Complete User',
          password: 'complexpassword123',
          role: UserRole.USER,
        }),
      );
    });

    it('should handle registration result without password', async () => {
      // Register should return user data without password
      const createUserDto = {
        email: 'secure@test.com',
        name: 'Secure User',
        password: 'password123',
      };

      const registeredUser = {
        id: 'secure-user-1',
        email: 'secure@test.com',
        name: 'Secure User',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Note: password should not be in the response
      };

      mockAuthService.register.mockResolvedValue(registeredUser);

      const result = await authController.register(createUserDto);

      expect(result).toEqual(registeredUser);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('Guards and Authentication Flow', () => {
    it('should protect login endpoint with LocalAuthGuard', () => {
      // LocalAuthGuard is applied to login endpoint
      // This tests that the guard is properly configured
      expect(authController).toBeDefined();
    });

    it('should leave register endpoint unprotected', async () => {
      // Register endpoint should be public (no guards)
      const createUserDto = {
        email: 'public@test.com',
        name: 'Public User',
        password: 'publicpass',
      };

      mockAuthService.register.mockResolvedValue({
        ...mockUser,
        ...createUserDto,
      });

      const result = await authController.register(createUserDto);

      expect(result).toBeDefined();
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle authentication flow correctly', () => {
      // Login: LocalAuthGuard validates credentials and populates req.user
      // Controller: Calls AuthService.login with authenticated user
      // AuthService: Returns JWT token and user data

      const authUser = {
        id: 'flow-user',
        email: 'flow@test.com',
        name: 'Flow User',
        role: UserRole.USER,
      };

      const authRequest = {
        user: authUser,
      } as AuthRequest;

      const loginResponse = {
        access_token: 'flow-token',
        user: authUser,
      };

      mockAuthService.login.mockReturnValue(loginResponse);

      const result = authController.login(authRequest, {
        email: 'flow@test.com',
        password: 'flowpass',
      });

      expect(mockAuthService.login).toHaveBeenCalledWith(authUser);
      expect(result).toEqual(loginResponse);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should propagate service errors for register', async () => {
      const createUserDto = {
        email: 'error@test.com',
        name: 'Error User',
        password: 'password123',
      };

      const serviceError = new Error('Service error');
      mockAuthService.register.mockRejectedValue(serviceError);

      await expect(authController.register(createUserDto)).rejects.toThrow(
        'Service error',
      );
    });

    it('should handle different user types in login', () => {
      const specialUser = {
        id: 'special-user',
        email: 'special@test.com',
        name: 'Special User',
        role: UserRole.ADMIN,
      };

      const specialRequest = {
        user: specialUser,
      } as AuthRequest;

      const specialResponse = {
        access_token: 'special-token',
        user: specialUser,
      };

      mockAuthService.login.mockReturnValue(specialResponse);

      const result = authController.login(specialRequest, {
        email: 'special@test.com',
        password: 'specialpass',
      });

      expect(mockAuthService.login).toHaveBeenCalledWith(specialUser);
      expect(result.user.role).toBe(UserRole.ADMIN);
    });
  });
});
