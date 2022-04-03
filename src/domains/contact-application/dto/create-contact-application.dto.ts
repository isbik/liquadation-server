import {
  IsDefined,
  IsEmail,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateContactApplicationDto {
  @IsEmail()
  email: string;

  @IsDefined()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Введите корректный номер',
  })
  phone: string;

  @IsString()
  @MinLength(8)
  fio: string;

  @IsString()
  comment: string;
}
