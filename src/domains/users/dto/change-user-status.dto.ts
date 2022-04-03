import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { UserEmailStatus } from '../entities/user.entity';

export class ChangeUserStatusDto {
  @IsDefined()
  @ArrayMinSize(1)
  @IsPositive({ each: true })
  @IsArray()
  ids: number[];

  @IsEnum(UserEmailStatus)
  @IsOptional()
  status: UserEmailStatus;
}
