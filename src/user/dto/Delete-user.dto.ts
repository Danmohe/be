// user/dto/delete-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({description: "User's id"})
  @IsNotEmpty()
  id: string;
}