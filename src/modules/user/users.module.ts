import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleOrmEntity } from './entities/role.entity';
import { UserOrmEntity } from './entities/user.entity';
import { TypeOrmUserRepository } from './typeorm/users.typeorm-repository';
import { UsersController } from './users.controller';
import { USER_REPOSITORY } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UserModule {}
