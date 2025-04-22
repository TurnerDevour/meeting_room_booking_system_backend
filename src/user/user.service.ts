import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { RedisService } from '../redis/redis.service';
import { md5 } from '../utils';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject()
  private readonly redisService: RedisService;

  async register(registerUser: RegisterUserDto) {
    // 先通过redis查询验证码是否存在
    const captcha = await this.redisService.get(
      `captcha_${registerUser.email}`,
    );
    if (!captcha) {
      this.logger.error('验证码已失效');
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    // 验证码不正确
    if (captcha !== registerUser.captcha) {
      this.logger.error('验证码不正确');
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    // 然后开始查找用户是否存在
    const user = await this.userRepository.findOneBy({
      username: registerUser.username,
    });
    // 如果存在就抛出异常
    if (user) {
      this.logger.error('用户已存在');
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    // 如果不存在就创建用户
    const newUser = new User();
    newUser.username = registerUser.username;
    newUser.password = md5(registerUser.password);
    newUser.email = registerUser.email;
    newUser.nickName = registerUser.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
}
