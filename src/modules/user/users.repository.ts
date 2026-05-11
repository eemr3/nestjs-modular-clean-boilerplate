import { RoleOrmEntity } from './entities/role.entity';
import { UserOrmEntity } from './entities/user.entity';
import { Role } from './roles.enum';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export type CreateUserData = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: RoleOrmEntity;
  isActive: boolean;
};

export type CreateRoleData = {
  id: string;
  name: Role;
};

export interface UserRepository {
  create(data: CreateUserData): Promise<UserOrmEntity>;
  findByEmail(email: string): Promise<UserOrmEntity | null>;
  findById(id: string): Promise<UserOrmEntity | null>;
  findRoleByName(name: Role): Promise<RoleOrmEntity | null>;
  createRole(data: CreateRoleData): Promise<RoleOrmEntity>;
}
