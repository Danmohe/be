// user/dto/Invite-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDto {
  @ApiProperty({ description: 'The first name of the user', minLength: 1, maxLength: 50,})
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: "User's Last name", minLength: 1, maxLength: 50,})
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ description: "User's email", minLength: 3, maxLength: 100,})
  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  email: string;
}
