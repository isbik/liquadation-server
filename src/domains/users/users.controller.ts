import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import JwtAuthenticationGuard from '../../shared/guards/jwt-authentication.guard';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  index(@Query() getUserDto: GetUsersDto) {
    return this.usersService.find(getUserDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/change-status')
  changeUserStatus(@Body() changeUserStatusData: ChangeUserStatusDto) {
    return this.usersService.changeEmailStatus(changeUserStatusData);
  }
}
