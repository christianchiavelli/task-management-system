import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Task } from '../../tasks/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'admin123',
      database: process.env.DATABASE_NAME || 'task_management',
      entities: [User, Task],
      synchronize: true, // Auto-sync for seed to create tables
    }),
    TypeOrmModule.forFeature([User, Task]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
