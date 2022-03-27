import { IsDefined, Matches } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  organizationName: string;

  @IsDefined()
  @Matches(/^\d{10}|\d{12}$/, {
    message: 'Введите корректный ИНН',
  })
  INN: number;

  @IsDefined()
  @Matches(/\d{4}[\dA-Z][\dA-Z]\d{3}/, {
    message: 'Введите корректный КПП',
  })
  KPP: number;

  @IsDefined()
  ORGN: string;

  @IsDefined()
  city: string;

  @IsDefined()
  factAddress: string;

  @IsDefined()
  legalAddress: string;

  @IsDefined()
  postalCode: string;

  @IsDefined()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Введите корректный номер',
  })
  phone: string;

  @IsDefined()
  email: string;

  @IsDefined()
  fio: string;

  @IsDefined()
  position: string;

  @IsDefined()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Введите корректный номер',
  })
  directorPhone: string;

  @IsDefined()
  directorEmail: string;

  @IsDefined()
  password: string;
}
