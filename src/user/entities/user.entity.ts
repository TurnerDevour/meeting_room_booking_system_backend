import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
  comment: '用户表',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50, comment: '用户名' })
  username: string;
  @Column({ length: 50, comment: '密码' })
  password: string;
  @Column({ name: 'nick_name', length: 50, comment: '昵称' })
  nickName: string;
  @Column({ length: 50, comment: '邮箱' })
  email: string;
  @Column({ name: 'head_pic', nullable: true, length: 100, comment: '头像' })
  headPic: string;
  @Column({
    name: 'phone_number',
    nullable: true,
    length: 20,
    comment: '手机号码',
  })
  phoneNumber: string;
  @Column({ name: 'is_frozen', comment: '是否被冻结', default: false })
  isFrozen: boolean;
  @Column({ name: 'is_admin', comment: '是否删除', default: false })
  isAdmin: boolean;
  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;
  @UpdateDateColumn({ name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
