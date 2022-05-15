import { EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PasswordChangeDto } from '../authentication/dto/password-change.dto';
import { EmailService } from '../email/email.service';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User, UserEmailStatus } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}

  async find(filters: GetUsersDto) {
    const { offset = 0, limit = 10 } = filters;

    const options: FindOptions<User, never> = {};
    const where: FilterQuery<User> = {};

    if (filters.sortBy) {
      options.orderBy = { [filters.sortBy]: filters.sortOrder };
    }

    const [items, total] = await this.usersRepository.findAndCount(where, {
      offset,
      limit,
      ...options,
    });

    return { items, total };
  }

  async findByPhoneOrEmail(phoneOrEmail: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({ email: phoneOrEmail });
      if (user) return user;
    } catch (error) {
      console.log('error: ', error);
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
      const user = await this.usersRepository.findOne(
        { id },
        { populate: ['avatar'] },
      );

      if (user) return user;
    } catch (error) {
      throw new HttpException(
        'Пользователь не был найден',
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
        'Введенный пароль не совпадает с текущим',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(id: number, passwordData: PasswordChangeDto) {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new HttpException(
        'Пользователь не был найден',
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

  async updateDirectorInfo(userId: number, data: UpdateDirectorDto) {
    await this.usersRepository.nativeUpdate({ id: userId }, { ...data });

    return 'Ok';
  }

  async updateNotificationSettings(
    userId: number,
    data: UpdateNotificationDto,
  ) {
    const user = await this.usersRepository.findOne({ id: userId });

    user.settings = data;

    await this.usersRepository.persistAndFlush(user);

    return 'Ok';
  }
}
