import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME + 's',
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    EmailService,
  ],
})
export class AuthenticationModule {}
