import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'phoneOrEmail',
    });
  }
  async validate(phoneOrEmail: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(
      phoneOrEmail,
      password,
    );
  }
}
