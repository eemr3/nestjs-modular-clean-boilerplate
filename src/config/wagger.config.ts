import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
  title?: string;
  description?: string;
  version?: string;
  path?: string;
}

const defaults: Required<SwaggerOptions> = {
  title: 'API',
  description: 'Documentação da API',
  version: '1.0',
  path: 'docs',
};

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
