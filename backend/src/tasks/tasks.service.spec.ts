import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Task, TaskPriority, TaskStatus } from './task.entity';
import { Test, TestingModule } from '@nestjs/testing';

import { TasksService } from './tasks.service';
import { UserRole } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TasksService', () => {
  let tasksService: TasksService;

  const mockUser = {
    id: 'user-1',
    email: 'user@test.com',
    name: 'Test User',
    role: UserRole.USER,
  };

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
    user: mockUser,
  };

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'New Description',
        priority: TaskPriority.HIGH,
        dueDate: '2025-12-31T10:00:00Z',
      };

      mockTaskRepository.create.mockReturnValue({
        ...createTaskDto,
        userId: 'user-1',
        dueDate: new Date(createTaskDto.dueDate),
      });
      mockTaskRepository.save.mockResolvedValue({
        ...mockTask,
        ...createTaskDto,
        dueDate: new Date(createTaskDto.dueDate),
      });

      const result = await tasksService.create(createTaskDto, 'user-1');

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        userId: 'user-1',
        dueDate: new Date(createTaskDto.dueDate),
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(result.title).toBe(createTaskDto.title);
      expect(result.userId).toBe('user-1');
    });

    it('should create a task without due date', async () => {
      const createTaskDto = {
        title: 'Task without due date',
        description: 'Description',
      };

      mockTaskRepository.create.mockReturnValue({
        ...createTaskDto,
        userId: 'user-1',
        dueDate: undefined,
      });
      mockTaskRepository.save.mockResolvedValue({
        ...mockTask,
        ...createTaskDto,
        dueDate: undefined,
      });

      const result = await tasksService.create(createTaskDto, 'user-1');

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        userId: 'user-1',
        dueDate: undefined,
      });
      expect(result.dueDate).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all tasks for admin', async () => {
      const allTasks = [
        { ...mockTask, userId: 'user-1' },
        { ...mockTask, id: 'task-2', userId: 'user-2' },
      ];

      mockTaskRepository.find.mockResolvedValue(allTasks);

      const result = await tasksService.findAll('admin-1', UserRole.ADMIN);

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(allTasks);
      expect(result).toHaveLength(2);
    });

    it('should return only user tasks for regular user', async () => {
      const userTasks = [
        { ...mockTask, userId: 'user-1' },
        { ...mockTask, id: 'task-3', userId: 'user-1' },
      ];

      mockTaskRepository.find.mockResolvedValue(userTasks);

      const result = await tasksService.findAll('user-1', UserRole.USER);

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(userTasks);
      expect(result.every((task) => task.userId === 'user-1')).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return task when user owns it', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.findOne(
        'task-1',
        'user-1',
        UserRole.USER,
      );

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-1' },
        relations: ['user'],
      });
      expect(result).toEqual(mockTask);
    });

    it('should return task when user is admin', async () => {
      const otherUserTask = { ...mockTask, userId: 'user-2' };
      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);

      const result = await tasksService.findOne(
        'task-1',
        'admin-1',
        UserRole.ADMIN,
      );

      expect(result).toEqual(otherUserTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        tasksService.findOne('nonexistent', 'user-1', UserRole.USER),
      ).rejects.toThrow(NotFoundException);
      await expect(
        tasksService.findOne('nonexistent', 'user-1', UserRole.USER),
      ).rejects.toThrow('Task not found');
    });

    it('should throw ForbiddenException when user tries to access other user task', async () => {
      const otherUserTask = { ...mockTask, userId: 'user-2' };
      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);

      await expect(
        tasksService.findOne('task-1', 'user-1', UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        tasksService.findOne('task-1', 'user-1', UserRole.USER),
      ).rejects.toThrow('You can only access your own tasks');
    });
  });

  describe('update', () => {
    it('should update task when user owns it', async () => {
      const updateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
        dueDate: '2025-11-30T15:00:00Z',
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue({ affected: 1 });
      mockTaskRepository.findOne
        .mockResolvedValueOnce(mockTask) // First call for permission check
        .mockResolvedValueOnce({
          // Second call for returning updated task
          ...mockTask,
          ...updateTaskDto,
          dueDate: new Date(updateTaskDto.dueDate),
        });

      const result = await tasksService.update(
        'task-1',
        updateTaskDto,
        'user-1',
        UserRole.USER,
      );

      expect(mockTaskRepository.update).toHaveBeenCalledWith('task-1', {
        ...updateTaskDto,
        dueDate: new Date(updateTaskDto.dueDate),
      });
      expect(result.title).toBe(updateTaskDto.title);
      expect(result.status).toBe(updateTaskDto.status);
    });

    it('should update task when user is admin', async () => {
      const otherUserTask = { ...mockTask, userId: 'user-2' };
      const updateTaskDto = { title: 'Admin Updated Task' };

      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);
      mockTaskRepository.update.mockResolvedValue({ affected: 1 });
      mockTaskRepository.findOne
        .mockResolvedValueOnce(otherUserTask) // First call for permission check
        .mockResolvedValueOnce({
          // Second call for returning updated task
          ...otherUserTask,
          ...updateTaskDto,
        });

      const result = await tasksService.update(
        'task-1',
        updateTaskDto,
        'admin-1',
        UserRole.ADMIN,
      );

      expect(result.title).toBe(updateTaskDto.title);
    });

    it('should handle update without due date', async () => {
      const updateTaskDto = {
        title: 'Updated without due date',
        status: TaskStatus.COMPLETED,
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue({ affected: 1 });
      mockTaskRepository.findOne
        .mockResolvedValueOnce(mockTask)
        .mockResolvedValueOnce({
          ...mockTask,
          ...updateTaskDto,
        });

      await tasksService.update(
        'task-1',
        updateTaskDto,
        'user-1',
        UserRole.USER,
      );

      expect(mockTaskRepository.update).toHaveBeenCalledWith('task-1', {
        ...updateTaskDto,
        dueDate: undefined,
      });
    });

    it('should throw ForbiddenException when user tries to update other user task', async () => {
      const otherUserTask = { ...mockTask, userId: 'user-2' };
      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);

      await expect(
        tasksService.update(
          'task-1',
          { title: 'Updated' },
          'user-1',
          UserRole.USER,
        ),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        tasksService.update(
          'task-1',
          { title: 'Updated' },
          'user-1',
          UserRole.USER,
        ),
      ).rejects.toThrow('You can only access your own tasks');
    });
  });

  describe('remove', () => {
    it('should remove task when user owns it', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.remove.mockResolvedValue(mockTask);

      await tasksService.remove('task-1', 'user-1', UserRole.USER);

      expect(mockTaskRepository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should remove task when user is admin', async () => {
      const otherUserTask = { ...mockTask, userId: 'user-2' };
      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);
      mockTaskRepository.remove.mockResolvedValue(otherUserTask);

      await tasksService.remove('task-1', 'admin-1', UserRole.ADMIN);

      expect(mockTaskRepository.remove).toHaveBeenCalledWith(otherUserTask);
    });

    it('should throw ForbiddenException when user tries to delete other user task', async () => {
      const otherUserTask = { ...mockTask, userId: 'user-2' };
      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);

      await expect(
        tasksService.remove('task-1', 'user-1', UserRole.USER),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        tasksService.remove('task-1', 'user-1', UserRole.USER),
      ).rejects.toThrow('You can only access your own tasks');
    });
  });

  describe('getTaskStats', () => {
    it('should return stats for admin (all tasks)', async () => {
      mockTaskRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4) // pending
        .mockResolvedValueOnce(3) // in_progress
        .mockResolvedValueOnce(3); // completed

      const result = await tasksService.getTaskStats('admin-1', UserRole.ADMIN);

      expect(mockTaskRepository.count).toHaveBeenCalledTimes(4);
      expect(mockTaskRepository.count).toHaveBeenCalledWith({ where: {} });
      expect(mockTaskRepository.count).toHaveBeenCalledWith({
        where: { status: TaskStatus.PENDING },
      });
      expect(mockTaskRepository.count).toHaveBeenCalledWith({
        where: { status: TaskStatus.IN_PROGRESS },
      });
      expect(mockTaskRepository.count).toHaveBeenCalledWith({
        where: { status: TaskStatus.COMPLETED },
      });

      expect(result).toEqual({
        total: 10,
        pending: 4,
        inProgress: 3,
        completed: 3,
      });
    });

    it('should return stats for regular user (only their tasks)', async () => {
      mockTaskRepository.count
        .mockResolvedValueOnce(5) // total
        .mockResolvedValueOnce(2) // pending
        .mockResolvedValueOnce(1) // in_progress
        .mockResolvedValueOnce(2); // completed

      const result = await tasksService.getTaskStats('user-1', UserRole.USER);

      expect(mockTaskRepository.count).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(mockTaskRepository.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: TaskStatus.PENDING },
      });
      expect(mockTaskRepository.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: TaskStatus.IN_PROGRESS },
      });
      expect(mockTaskRepository.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: TaskStatus.COMPLETED },
      });

      expect(result).toEqual({
        total: 5,
        pending: 2,
        inProgress: 1,
        completed: 2,
      });
    });
  });
});
