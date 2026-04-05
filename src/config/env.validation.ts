import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, validateSync } from 'class-validator';

// Definimos uma classe com as regras de validação
class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsString()
  @IsNotEmpty()
  DB_PORT: string;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  // Exemplo: Validar o ambiente
  @IsEnum(['development', 'production', 'test'])
  NODE_ENV: string;
}

export function validateEnv(config: Record<string, unknown>) {
  // Converte o objeto de configuração plano para uma instância da classe
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  // Executa a validação de forma síncrona
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    // Formata os erros para ficarem legíveis no console
    const errorMessages = errors
      .map((err) => Object.values(err.constraints || {}).join(', '))
      .join('\n - ');

    throw new Error(`Erro na validação do .env:\n - ${errorMessages}`);
  }

  return validatedConfig;
}
