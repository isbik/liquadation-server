import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../../shared/guards/jwt-authentication.guard';
import RequestWithUser from '../authentication/request-with-user.interface';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UsersService } from './users.service';

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

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/update-director-info')
  updateDirectorInfo(
    @Req() request: RequestWithUser,
    @Body() data: UpdateDirectorDto,
  ) {
    return this.usersService.updateDirectorInfo(request.user.id, data);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/notification')
  updateNotificationSettings(
    @Req() request: RequestWithUser,
    @Body() data: UpdateNotificationDto,
  ) {
    return this.usersService.updateNotificationSettings(request.user.id, data);
  }
}
