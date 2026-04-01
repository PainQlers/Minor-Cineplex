import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*', // 👈 อนุญาตทุก origin (dev)
  });
  
  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
}
bootstrap();
