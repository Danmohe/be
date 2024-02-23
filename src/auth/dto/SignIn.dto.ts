// src/auth/dto/SignIn.dts.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ required: true, minLength: 3, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  email: string;

  @ApiProperty({ required: true, minLength: 3, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  password: string;
}