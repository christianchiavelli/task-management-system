import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../database/seeds/seed.module';
import { SeedService } from '../database/seeds/seed.service';

async function bootstrap() {
  try {
    console.log('🚀 Initializing seed application...');

    const app = await NestFactory.create(SeedModule, {
      logger: ['error', 'warn'],
    });

    const seedService = app.get(SeedService);

    await seedService.run();

    await app.close();

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

void bootstrap();
