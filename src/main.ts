import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './shared/filter/app-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/wagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
