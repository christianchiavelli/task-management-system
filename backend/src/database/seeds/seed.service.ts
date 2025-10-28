import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../users/user.entity';
import { Task } from '../../tasks/task.entity';
import { seedUsers } from './data/users.seed';
import { seedTasks } from './data/tasks.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async run(): Promise<void> {
    console.log('🌱 Starting database seed...');

    await this.clearDatabase();
    await this.seedUsers();
    await this.seedTasks();

    console.log('✅ Database seed completed successfully!');
  }

  private async clearDatabase(): Promise<void> {
    console.log('🧹 Clearing existing data...');

    try {
      await this.taskRepository.query('DELETE FROM tasks');
      console.log('   - Cleared tasks');
    } catch {
      console.log('   - No tasks table found, skipping...');
    }

    try {
      await this.userRepository.query('DELETE FROM users');
      console.log('   - Cleared users');
    } catch {
      console.log('   - No users table found, skipping...');
    }
  }

  private async seedUsers(): Promise<void> {
    console.log('👥 Seeding users...');

    for (const userData of seedUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = this.userRepository.create({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      await this.userRepository.save(user);
      console.log(`   - Created user: ${userData.email} (${userData.role})`);
    }
  }

  private async seedTasks(): Promise<void> {
    console.log('📋 Seeding tasks...');

    for (const taskData of seedTasks) {
      const user = await this.userRepository.findOne({
        where: { id: taskData.userId },
      });

      if (!user) {
        console.log(
          `   - Warning: User ${taskData.userId} not found for task ${taskData.title}`,
        );
        continue;
      }

      const task = this.taskRepository.create({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        user: user,
      });

      await this.taskRepository.save(task);
      console.log(
        `   - Created task: "${taskData.title}" (${taskData.status}) for ${user.email}`,
      );
    }
  }
}
