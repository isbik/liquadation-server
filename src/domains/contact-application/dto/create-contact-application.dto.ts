import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateContactApplicationDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Введите корректный номер',
  })
  phone: string;

  @IsString()
  @MinLength(2)
  fio: string;

  @IsString()
  @MinLength(10)
  comment: string;
}
