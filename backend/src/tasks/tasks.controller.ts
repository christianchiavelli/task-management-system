import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import type { AuthRequest } from '../auth/auth.interfaces';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: AuthRequest) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.tasksService.findAll(req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Get task statistics' })
  @ApiResponse({
    status: 200,
    description: 'Task stats retrieved successfully',
  })
  @Get('stats')
  getStats(@Request() req: AuthRequest) {
    return this.tasksService.getTaskStats(req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.tasksService.findOne(id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthRequest,
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
      req.user.id,
      req.user.role,
    );
  }

  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.tasksService.remove(id, req.user.id, req.user.role);
  }
}
