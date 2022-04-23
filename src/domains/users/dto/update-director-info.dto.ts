import { IsDefined, IsEmail, Matches } from 'class-validator';

export class UpdateDirectorInfoDto {
  @IsDefined()
  position: string;

  @IsDefined()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Введите корректный номер',
  })
  directorPhone: string;

  @IsDefined()
  @IsEmail()
  directorEmail: string;

  @IsDefined()
  fio: string;
}
