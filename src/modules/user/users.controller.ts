import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserRequestDto) {
    return this.usersService.create(body);
  }
}
