import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles.enum';

@Entity('roles')
export class RoleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
