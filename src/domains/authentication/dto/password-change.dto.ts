import { IsDefined } from 'class-validator';

export class PasswordChangeDto {
  @IsDefined()
  oldPassword: string;
  @IsDefined()
  newPassword: string;
}
