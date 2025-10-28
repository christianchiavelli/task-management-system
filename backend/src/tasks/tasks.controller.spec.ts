import { TaskPriority, TaskStatus } from './task.entity';
import { Test, TestingModule } from '@nestjs/testing';

import type { AuthRequest } from '../auth/auth.interfaces';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UserRole } from '../users/user.entity';

describe('TasksController', () => {
  let tasksController: TasksController;

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

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2025-12-31'),
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getTaskStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    tasksController = module.get<TasksController>(TasksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'New Description',
        priority: TaskPriority.HIGH,
        dueDate: '2025-12-31T10:00:00Z',
      };

      mockTasksService.create.mockResolvedValue({
        ...mockTask,
        ...createTaskDto,
      });

      const result = await tasksController.create(
        createTaskDto,
        mockAuthRequest,
      );

      expect(mockTasksService.create).toHaveBeenCalledWith(
        createTaskDto,
        mockAuthRequest.user.id,
      );
      expect(result.title).toBe(createTaskDto.title);
      expect(result.priority).toBe(createTaskDto.priority);
    });

    it('should create task with user ID from request', async () => {
      const createTaskDto = {
        title: 'User Task',
        description: 'Task for specific user',
      };

      mockTasksService.create.mockResolvedValue({
        ...mockTask,
        ...createTaskDto,
        userId: mockAuthRequest.user.id,
      });

      await tasksController.create(createTaskDto, mockAuthRequest);

      expect(mockTasksService.create).toHaveBeenCalledWith(
        createTaskDto,
        mockAuthRequest.user.id,
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks for user', async () => {
      const userTasks = [
        { ...mockTask, userId: 'user-1' },
        { ...mockTask, id: 'task-2', userId: 'user-1' },
      ];

      mockTasksService.findAll.mockResolvedValue(userTasks);

      const result = await tasksController.findAll(mockAuthRequest);

      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        mockAuthRequest.user.id,
        mockAuthRequest.user.role,
      );
      expect(result).toEqual(userTasks);
      expect(result).toHaveLength(2);
    });

    it('should return all tasks for admin', async () => {
      const allTasks = [
        { ...mockTask, userId: 'user-1' },
        { ...mockTask, id: 'task-2', userId: 'user-2' },
        { ...mockTask, id: 'task-3', userId: 'user-3' },
      ];

      mockTasksService.findAll.mockResolvedValue(allTasks);

      const result = await tasksController.findAll(mockAdminRequest);

      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        mockAdminRequest.user.id,
        mockAdminRequest.user.role,
      );
      expect(result).toEqual(allTasks);
      expect(result).toHaveLength(3);
    });
  });

  describe('getStats', () => {
    it('should return task statistics for user', async () => {
      const userStats = {
        total: 5,
        pending: 2,
        inProgress: 1,
        completed: 2,
      };

      mockTasksService.getTaskStats.mockResolvedValue(userStats);

      const result = await tasksController.getStats(mockAuthRequest);

      expect(mockTasksService.getTaskStats).toHaveBeenCalledWith(
        mockAuthRequest.user.id,
        mockAuthRequest.user.role,
      );
      expect(result).toEqual(userStats);
    });

    it('should return task statistics for admin', async () => {
      const adminStats = {
        total: 50,
        pending: 20,
        inProgress: 15,
        completed: 15,
      };

      mockTasksService.getTaskStats.mockResolvedValue(adminStats);

      const result = await tasksController.getStats(mockAdminRequest);

      expect(mockTasksService.getTaskStats).toHaveBeenCalledWith(
        mockAdminRequest.user.id,
        mockAdminRequest.user.role,
      );
      expect(result).toEqual(adminStats);
    });
  });

  describe('findOne', () => {
    it('should return a specific task', async () => {
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await tasksController.findOne('task-1', mockAuthRequest);

      expect(mockTasksService.findOne).toHaveBeenCalledWith(
        'task-1',
        mockAuthRequest.user.id,
        mockAuthRequest.user.role,
      );
      expect(result).toEqual(mockTask);
    });

    it('should call service with correct parameters for admin', async () => {
      const adminTask = { ...mockTask, userId: 'other-user' };
      mockTasksService.findOne.mockResolvedValue(adminTask);

      const result = await tasksController.findOne('task-1', mockAdminRequest);

      expect(mockTasksService.findOne).toHaveBeenCalledWith(
        'task-1',
        mockAdminRequest.user.id,
        mockAdminRequest.user.role,
      );
      expect(result).toEqual(adminTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      };

      const updatedTask = {
        ...mockTask,
        ...updateTaskDto,
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await tasksController.update(
        'task-1',
        updateTaskDto,
        mockAuthRequest,
      );

      expect(mockTasksService.update).toHaveBeenCalledWith(
        'task-1',
        updateTaskDto,
        mockAuthRequest.user.id,
        mockAuthRequest.user.role,
      );
      expect(result).toEqual(updatedTask);
      expect(result.title).toBe(updateTaskDto.title);
      expect(result.status).toBe(updateTaskDto.status);
    });

    it('should update task as admin', async () => {
      const updateTaskDto = {
        status: TaskStatus.COMPLETED,
      };

      const updatedTask = {
        ...mockTask,
        ...updateTaskDto,
        userId: 'other-user', // Admin updating other user's task
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await tasksController.update(
        'task-1',
        updateTaskDto,
        mockAdminRequest,
      );

      expect(mockTasksService.update).toHaveBeenCalledWith(
        'task-1',
        updateTaskDto,
        mockAdminRequest.user.id,
        mockAdminRequest.user.role,
      );
      expect(result).toEqual(updatedTask);
    });

    it('should handle partial updates', async () => {
      const updateTaskDto = {
        description: 'Updated description only',
      };

      const updatedTask = {
        ...mockTask,
        description: updateTaskDto.description,
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await tasksController.update(
        'task-1',
        updateTaskDto,
        mockAuthRequest,
      );

      expect(result.description).toBe(updateTaskDto.description);
      expect(result.title).toBe(mockTask.title); // Should remain unchanged
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      const result = await tasksController.remove('task-1', mockAuthRequest);

      expect(mockTasksService.remove).toHaveBeenCalledWith(
        'task-1',
        mockAuthRequest.user.id,
        mockAuthRequest.user.role,
      );
      expect(result).toBeUndefined();
    });

    it('should remove task as admin', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      const result = await tasksController.remove('task-1', mockAdminRequest);

      expect(mockTasksService.remove).toHaveBeenCalledWith(
        'task-1',
        mockAdminRequest.user.id,
        mockAdminRequest.user.role,
      );
      expect(result).toBeUndefined();
    });

    it('should call service remove method once', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await tasksController.remove('task-to-delete', mockAuthRequest);

      expect(mockTasksService.remove).toHaveBeenCalledTimes(1);
      expect(mockTasksService.remove).toHaveBeenCalledWith(
        'task-to-delete',
        mockAuthRequest.user.id,
        mockAuthRequest.user.role,
      );
    });
  });

  describe('Authentication and Authorization', () => {
    it('should pass user information from request to service methods', async () => {
      const customRequest = {
        user: {
          id: 'custom-user',
          email: 'custom@test.com',
          name: 'Custom User',
          role: UserRole.USER,
        },
      } as any as AuthRequest;

      mockTasksService.findAll.mockResolvedValue([]);

      await tasksController.findAll(customRequest);

      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        'custom-user',
        UserRole.USER,
      );
    });

    it('should handle admin role correctly in all methods', async () => {
      mockTasksService.create.mockResolvedValue(mockTask);
      mockTasksService.findAll.mockResolvedValue([]);
      mockTasksService.getTaskStats.mockResolvedValue({});
      mockTasksService.findOne.mockResolvedValue(mockTask);
      mockTasksService.update.mockResolvedValue(mockTask);
      mockTasksService.remove.mockResolvedValue(undefined);

      // Test all methods with admin request
      await tasksController.create({ title: 'Test' }, mockAdminRequest);
      await tasksController.findAll(mockAdminRequest);
      await tasksController.getStats(mockAdminRequest);
      await tasksController.findOne('task-1', mockAdminRequest);
      await tasksController.update(
        'task-1',
        { title: 'Updated' },
        mockAdminRequest,
      );
      await tasksController.remove('task-1', mockAdminRequest);

      // Verify all calls used admin role
      expect(mockTasksService.create).toHaveBeenCalledWith(
        expect.any(Object),
        mockAdminRequest.user.id,
      );
      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        mockAdminRequest.user.id,
        UserRole.ADMIN,
      );
      expect(mockTasksService.getTaskStats).toHaveBeenCalledWith(
        mockAdminRequest.user.id,
        UserRole.ADMIN,
      );
      expect(mockTasksService.findOne).toHaveBeenCalledWith(
        'task-1',
        mockAdminRequest.user.id,
        UserRole.ADMIN,
      );
      expect(mockTasksService.update).toHaveBeenCalledWith(
        'task-1',
        expect.any(Object),
        mockAdminRequest.user.id,
        UserRole.ADMIN,
      );
      expect(mockTasksService.remove).toHaveBeenCalledWith(
        'task-1',
        mockAdminRequest.user.id,
        UserRole.ADMIN,
      );
    });
  });
});
