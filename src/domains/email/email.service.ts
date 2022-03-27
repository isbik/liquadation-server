import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendRecoverPassword(email, token: string) {
    const url = `${process.env.FRONTEND_URL}/auth/password/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Recover',
      template: 'password-recover',
      context: {
        url,
      },
    });
  }
}
