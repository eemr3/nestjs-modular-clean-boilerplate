import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmOptions, PostgresConfig } from '../config/typeorm.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pg = configService.getOrThrow<PostgresConfig>('database.postgres');
        return buildTypeOrmOptions(pg);
      },
    }),
  ],
})
export class DatabaseModule {}
