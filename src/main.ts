import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  await app.listen(configService.get('NEST_SERVICE_PORT') ?? 3000);
}

bootstrap()
  .then(() => console.log(`Server started......`))
  .catch((error) => {
    console.error('Error starting server:', error);
  });
