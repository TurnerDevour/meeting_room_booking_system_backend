import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  @Get('captcha')
  async getCaptcha(@Query('email') email: string) {
    const code = Math.random().toString().slice(2, 8);

    // 先存储到redis
    await this.redisService.set(`captcha_${email}`, code, 60 * 5);

    await this.emailService.sendEmail({
      to: email,
      subject: '会议室预定系统验证码：',
      text: `<p>你的注册验证码是 ${code}</p>`,
    });

    return '验证码已发送';
  }
}
