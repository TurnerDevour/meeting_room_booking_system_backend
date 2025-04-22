import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: 'turneratc@163.com',
        pass: 'NTRFAgFLTj5vrBuJ',
      },
    });
  }

  async sendEmail({ to, subject, text }: IEmailOptions) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: 'turneratc@163.com',
      },
      to,
      subject,
      text,
    });
  }
}
