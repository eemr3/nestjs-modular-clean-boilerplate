import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmOptions, MysqlConfig } from '../config/typeorm.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pg = configService.getOrThrow<MysqlConfig>('database.mysql');
        return buildTypeOrmOptions(pg);
      },
    }),
  ],
})
export class DatabaseModule {}
