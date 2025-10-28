import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'API Health Check' })
  @ApiResponse({ status: 200, description: 'API status and information' })
  @Get()
  getApiInfo(): object {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Health Check for Docker' })
  @ApiResponse({ status: 200, description: 'Health status' })
  @Get('health')
  healthCheck(): object {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
