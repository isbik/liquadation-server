import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PasswordChangeDto } from '../authentication/dto/password-change.dto';
import { EmailService } from '../email/email.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByPhoneOrEmail(phoneOrEmail: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    });
    if (user) {
      return user;
    }

    return null;
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.userModel.create(userData);
    return newUser;
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
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

  async changePassword(id: string, passwordData: PasswordChangeDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.verifyPassword(passwordData.oldPassword, user.password);
      user.password = await bcrypt.hash(passwordData.newPassword, 10);
      await user.save();
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

    const user = await this.userModel.findOne({
      email: payload.email,
    });

    if (!user) {
      throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.save();

    return 'OK';
  }
}
