// user/dto/Update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'The first name of the user', required: false, minLength: 1, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ description: "User's Last name", required: false, minLength: 1, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({ description: "User's email", required: false, minLength: 3, maxLength: 100 })
  @IsOptional()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: "User's password", required: false, minLength: 3, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  password?: string;

  @ApiProperty({ description: "User's access token", required: false })
  @IsOptional()
  @IsString()
  accessToken?: string;
}