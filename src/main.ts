import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(express.static('public'));
  app.setBaseViewsDir('views');
  app.setViewEngine('hbs');
  await app.listen(8080);
}
bootstrap();
