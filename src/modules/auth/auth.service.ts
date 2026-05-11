import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from '../../shared/exceptions/unauthorized.error';
import { UsersService } from '../user/users.service';
import { LoginRequestDto } from './dtos/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginRequestDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.isActive === false) {
      throw new UnauthorizedError('User is not active');
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role.name,
      }),
    };
  }
}
