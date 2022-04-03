import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserEmailStatus } from '../entities/user.entity';

export class GetUsersDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(UserEmailStatus)
  @IsOptional()
  emailStatus: UserEmailStatus;
}
