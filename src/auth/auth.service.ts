// src.auth.auth.service.ts
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { SignInDto } from './dto/SignIn.dto';
import { SecurityService } from '../security/security.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private securityService: SecurityService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ user: Partial<User> }> {
    try{
      const inputEmail  = signInDto.email;
      const inputPassword = signInDto.password;
      
      const user = await this.userService.findByEmail(inputEmail);
      
      const passwordMatches = await this.securityService.comparePasswords(inputPassword, user.password);
  
      if (!user || !passwordMatches) {
        throw new UnauthorizedException('Invalid email or password');
      }
      // Check if the user already has an access token
      if (!user.accessToken) {
        // Generate a new access token
        const payload = { sub: user.id, username: user.email };
        const accessToken = await this.jwtService.signAsync(payload);
  
        // Update the user object with the new access token
        user.accessToken = accessToken;
        await this.userService.update(user.id,user);
      }
  
      // Exclude the password from the user object
      const { password, ...userWithoutPassword } = user;
  
      return {
        user: userWithoutPassword,
      };
    }
    catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred during sign-in');
    }
    
  }
}
