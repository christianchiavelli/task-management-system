import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
    });

    return this.taskRepository.save(task);
  }

  async findAll(userId: string, userRole: UserRole): Promise<Task[]> {
    if (userRole === UserRole.ADMIN) {
      return this.taskRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    }

    return this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (userRole !== UserRole.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You can only access your own tasks');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Task> {
    const task = await this.findOne(id, userId, userRole);

    if (userRole !== UserRole.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    const updateData = {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : undefined,
    };

    await this.taskRepository.update(id, updateData);
    return this.findOne(id, userId, userRole);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const task = await this.findOne(id, userId, userRole);

    if (userRole !== UserRole.ADMIN && task.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.taskRepository.remove(task);
  }

  async getTaskStats(userId: string, userRole: UserRole) {
    const whereCondition = userRole === UserRole.ADMIN ? {} : { userId };

    const [total, pending, inProgress, completed] = await Promise.all([
      this.taskRepository.count({ where: whereCondition }),
      this.taskRepository.count({
        where: { ...whereCondition, status: TaskStatus.PENDING },
      }),
      this.taskRepository.count({
        where: { ...whereCondition, status: TaskStatus.IN_PROGRESS },
      }),
      this.taskRepository.count({
        where: { ...whereCondition, status: TaskStatus.COMPLETED },
      }),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
    };
  }
}
