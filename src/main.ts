const path = require('path');
const pkg = require('../package.json');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    '/public',
    serveStatic(path.join(__dirname, '../uploads'), {
      maxAge: '1d',
      extensions: ['jpg', 'jpeg', 'png', 'gif'],
    }),
  );
  await app.listen(process.env.PORT);
  console.log(
    `[${pkg.name}] Nest-server is running on: ${await app.getUrl()}`,
    new Date(),
  );
}

bootstrap();
