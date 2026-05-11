import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../entities/role.entity';
import { UserOrmEntity } from '../entities/user.entity';
import { Role } from '../roles.enum';
import {
  CreateRoleData,
  CreateUserData,
  UserRepository,
} from '../users.repository';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roles: Repository<RoleOrmEntity>,
  ) {}

  async create(data: CreateUserData): Promise<UserOrmEntity> {
    const user = this.users.create(data);
    return this.users.save(user);
  }

  findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.users.findOne({ where: { email } });
  }

  findById(id: string): Promise<UserOrmEntity | null> {
    return this.users.findOne({ where: { id } });
  }

  findRoleByName(name: Role): Promise<RoleOrmEntity | null> {
    return this.roles.findOne({ where: { name } });
  }

  async createRole(data: CreateRoleData): Promise<RoleOrmEntity> {
    const role = this.roles.create(data);
    return this.roles.save(role);
  }
}
