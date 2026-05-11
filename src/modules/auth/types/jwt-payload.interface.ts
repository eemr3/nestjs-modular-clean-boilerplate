import { Role } from '../../user/roles.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
