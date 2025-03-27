import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  dotenv.config();
  console.log('Starting server with PORT:', process.env.PORT);
  console.log('MONGO_URI:', process.env.MONGO_URI);
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend requests
  app.use(bodyParser.json()); // Ensure JSON parsing
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payload to DTO
      whitelist: false, // Don’t strip unknown properties
      forbidNonWhitelisted: false, // Don’t throw errors for unknown properties
    }),
  );
  await app.listen(process.env.PORT ?? 8000);
  console.log(`Server running on port ${process.env.PORT ?? 8000}`);
}

void bootstrap();
