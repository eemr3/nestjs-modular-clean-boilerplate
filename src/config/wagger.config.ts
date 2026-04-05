import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import envConfig from './env.config';

export interface SwaggerOptions {
  title?: string;
  description?: string;
  version?: string;
  path?: string;
}

const defaults: Required<SwaggerOptions> = (() => {
  const { swagger } = envConfig();
  return {
    title: swagger.title,
    description: swagger.description,
    version: swagger.version,
    path: swagger.path,
  };
})();

export function setupSwagger(
  app: INestApplication,
  options: SwaggerOptions = {},
): void {
  const opts = { ...defaults, ...options };

  const config = new DocumentBuilder()
    .setTitle(opts.title)
    .setDescription(opts.description)
    .setVersion(opts.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(opts.path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
