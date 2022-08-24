import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/public', express.static(join(__dirname, '../../uploads')));
  app.listen(parseInt(process.env.PORT) || 3000).then(async () => {
    console.log(`server listening on ${await app.getUrl()}`);
  });
}
bootstrap();
