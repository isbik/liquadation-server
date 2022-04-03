import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class UsersModule {}
