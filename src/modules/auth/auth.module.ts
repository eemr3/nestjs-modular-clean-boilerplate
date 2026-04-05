import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';
import { UserModule } from '../user/users.module';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { AuthController } from './infrastructure/http/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtGuard } from './infrastructure/guards/jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn', '1d') as NonNullable<
            SignOptions['expiresIn']
          >,
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy, JwtGuard],
  exports: [JwtGuard, JwtStrategy],
})
export class AuthModule {}
