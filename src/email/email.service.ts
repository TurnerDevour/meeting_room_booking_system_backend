import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('NODEMAILER_HOST'),
      port: this.configService.get('NODEMAILER_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('NODEMAILER_USER'),
        pass: this.configService.get('NODEMAILER_PASS'),
      },
    });
  }

  async sendEmail({ to, subject, text }: IEmailOptions) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('NODEMAILER_USER') ?? '',
      },
      to,
      subject,
      text,
    });
  }
}
