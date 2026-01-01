import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API Prefix - All routes will start with /api
  app.setGlobalPrefix('api');

  // API Versioning (optional - uncomment if needed)
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });
  // Routes become: /api/v1/documents, /api/v2/documents, etc.

  // Global Validation Pipe - Automatically validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties from DTOs
      forbidNonWhitelisted: true, // Throw error if unknown properties are sent
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert types (string to number, etc.)
      },
    }),
  );

  // Enable CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // Allow requests from frontend
    credentials: true, // Allow cookies/credentials
  });

  const port = process.env.PORT ?? 8080;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 API endpoints available at: http://localhost:${port}/api/documents`);
}
bootstrap();
