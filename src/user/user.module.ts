// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EmailService } from 'src/email/email.service';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SecurityModule],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
