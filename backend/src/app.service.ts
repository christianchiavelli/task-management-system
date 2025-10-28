import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Task Management API',
      version: '1.0.0',
      status: 'running',
      documentation: '/api',
      timestamp: new Date().toISOString(),
    };
  }
}
