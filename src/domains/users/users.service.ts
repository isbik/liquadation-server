import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { paginated } from '../../lib/Paginated';
import { PasswordChangeDto } from '../authentication/dto/password-change.dto';
import { EmailService } from '../email/email.service';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { User, UserEmailStatus } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  async find(filters: GetUsersDto) {
    return paginated<User>(this.usersRepository, filters);
  }

  async findByPhoneOrEmail(phoneOrEmail: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        email: phoneOrEmail,
      });
      if (user) {
        return user;
      }
    } catch (error) {
      return null;
    }
  }

  async create(userData: CreateUserDto) {
    const user = this.usersRepository.create({
      ...userData,
      emailStatus: UserEmailStatus.verification,
    });

    await this.usersRepository.persistAndFlush(user);

    return user;
  }

  async getById(id: number) {
    try {
      const user = await this.usersRepository.findOne({ id });
      if (user) {
        return user;
      }
    } catch (error) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  public async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(id: number, passwordData: PasswordChangeDto) {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.verifyPassword(passwordData.oldPassword, user.password);
      user.password = await bcrypt.hash(passwordData.newPassword, 10);
      await this.usersRepository.persistAndFlush(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }

    return 'Ok';
  }

  async recoverPassword(email: string) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    this.emailService.sendRecoverPassword(email, token);
  }

  async confirmRecoverPassword(password: string, token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as {
      email: string;
    };

    if (!payload) {
      throw new HttpException(
        'Token expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepository.findOne({
      email: payload.email,
    });

    if (!user) {
      throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    this.usersRepository.persistAndFlush(user);

    return 'OK';
  }

  async changeEmailStatus(data: ChangeUserStatusDto) {
    data.ids.forEach((id) => {
      this.usersRepository.nativeUpdate({ id }, { emailStatus: data.status });
    });

    this.usersRepository.flush();
  }
}
