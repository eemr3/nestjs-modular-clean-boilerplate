import { RoleEntity } from './role.entity';

export class UserEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: RoleEntity,
    public isActive: boolean = true,
  ) {}

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }
}
