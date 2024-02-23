// src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus, InternalServerErrorException, UnauthorizedException, Res, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/SignIn.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Signs in a user' })
  @ApiResponse({status: 700, description: 'Signs in a user',})
  @ApiResponse({status: 705, description: 'Unauthorized',})
  @ApiResponse({status: 999, description: 'Internal server error',})
  async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
    try {
      const signInResult = await this.authService.signIn(signInDto);
      return response.status(HttpStatus.OK).json({
        success: true,
        responseData: signInResult,
        messageCode: "700",
      });
    } catch (error) {
      console.error('Error during sign-in:', error.message);
      if (error instanceof UnauthorizedException) {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          responseData: false,
          messageCode: "error.message",
        });
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        responseData: false,
        messageCode: 'An unexpected error occurred during sign-in',
      });
    }
  }

  
  
}
