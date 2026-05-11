import { Role } from '../roles.enum';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}
