import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap(): Promise<void> {
  dotenv.config();
  console.log('Starting server with PORT:', process.env.PORT);
  console.log('MONGO_URI:', process.env.MONGO_URI);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8000);
  console.log(`Server running on port ${process.env.PORT ?? 8000}`);
}

void bootstrap();
