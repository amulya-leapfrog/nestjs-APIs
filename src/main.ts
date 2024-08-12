import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverConfig from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = serverConfig.port
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
