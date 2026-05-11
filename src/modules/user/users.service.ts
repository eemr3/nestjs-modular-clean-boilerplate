import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { ConflictError } from '../../shared/exceptions/conflict.error';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { RoleOrmEntity } from './entities/role.entity';
import { UserOrmEntity } from './entities/user.entity';
import { Role } from './roles.enum';
import { USER_REPOSITORY, UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly passwordSaltRounds = 10;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async create(data: CreateUserRequestDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      this.passwordSaltRounds,
    );
    const role = await this.findOrCreateRole(data.role);
    const user = await this.usersRepository.create({
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    return this.toResponse(user);
  }

  findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  private async findOrCreateRole(roleName: Role): Promise<RoleOrmEntity> {
    const role = await this.usersRepository.findRoleByName(roleName);

    if (role) {
      return role;
    }

    return this.usersRepository.createRole({
      id: randomUUID(),
      name: roleName,
    });
  }

  private toResponse(user: UserOrmEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
    };
  }
}
