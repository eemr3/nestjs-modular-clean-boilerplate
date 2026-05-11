import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

/** Campos obrigatórios mínimos para o app subir. Amplie conforme o projeto. */
class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  MYSQL_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_PORT: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_USER: string;

  /** Se ausente, o `env.config` aplica o próprio fallback. */
  @IsOptional()
  @IsEnum(['development', 'production', 'test'])
  NODE_ENV?: string;
}

/**
 * Valida o objeto de variáveis de ambiente antes do ConfigModule mesclar com `load`.
 * Devolve o mesmo `config` para não remover chaves (JWT, Swagger, Redis p/ Compose, etc.).
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => Object.values(err.constraints || {}).join(', '))
      .join('\n - ');

    throw new Error(`Erro na validação do .env:\n - ${errorMessages}`);
  }

  return config;
}
