import { UserRole } from '@/domains/users/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    if (user.role !== UserRole.admin) {
      throw new HttpException('Action not allowed', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
