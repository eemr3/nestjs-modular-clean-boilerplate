import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './shared/filter/app-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const env = configService.get<string>('app.env');
  const name = configService.get<string>('app.name');
  const trustProxy = configService.get<boolean>('app.trustProxy');

  const allowedOrigins = (configService.get<string>('app.allowedOrigins') ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const httpAdapter = app.getHttpAdapter();
  const httpServer = httpAdapter.getInstance();
  if (typeof httpServer?.set === 'function') {
    httpServer.set('trust proxy', !!trustProxy);
  }

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  app.setGlobalPrefix('api');

  if (env === 'development') {
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
    setupSwagger(app);
  } else {
    app.use(helmet());
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(port ?? 3100, () => {
    console.info(`${name} is running on port ${port} in ${env} mode`);
  });
}
bootstrap();
