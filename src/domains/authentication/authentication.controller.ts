import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
  Res,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { PasswordChangeDto } from './dto/password-change.dto';
import { RegisterDto } from './dto/register-authentication.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { LocalAuthenticationGuard } from './local-authentication.guard';
import RequestWithUser from './request-with-user.interface';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly userService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @Post('register')
  create(@Body() registerData: RegisterDto) {
    return this.authenticationService.register(registerData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(
      user._id.toString(),
    );
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('password/change')
  async changePassword(
    @Req() request: RequestWithUser,
    @Body() passwordData: PasswordChangeDto,
  ) {
    const { user } = request;
    return this.userService.changePassword(user._id.toString(), passwordData);
  }

  @Post('password/recover')
  async recoverPassword(@Body() { email }: { email: string }) {
    return this.userService.recoverPassword(email);
  }

  @Post('password/confirm')
  async confirmRecoverPassword(
    @Body() { password }: { password: string },
    @Query('token') token: string,
  ) {
    return this.userService.confirmRecoverPassword(password, token);
  }
}
