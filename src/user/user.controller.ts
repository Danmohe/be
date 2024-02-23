// src/user.controller.ts
import { Body, ConflictException, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/Create-user.dto';
import { UpdateUserDto } from './dto/Update-user.dto';
import { InviteUserDto } from './dto/Invite-user.dto';
import { ActivateUserDto } from './dto/Activate-user.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';


@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('invite')
  @ApiOperation({ summary: 'Sends an invitation to the user' })
  @ApiResponse({status: 700, description: 'Sends an invitation to the user',})
  @ApiResponse({status: 711, description: 'User already invited',})
  @ApiResponse({status: 999, description: 'Internal server error',})
  @ApiBody({ type: InviteUserDto })
  async createInvite(@Body() inviteUserDto: InviteUserDto, @Res() response: Response) {
    try {
      const newUserInvite = await this.userService.createInvite(inviteUserDto);
      if (newUserInvite) {
        return response.json({
          success: true,
          responseData: newUserInvite,
          messageCode: '700',
        });
      }
    } catch (error) {
      if (error.message === 'User already invited') {
        return response.json({
          success: false,
          responseData: null,
          messageCode: '711',
        });
      } else {
        return response.json({
          success: false,
          responseData: false,
          messageCode: '999',
        });
      }
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Creates a user' }) 
  @ApiResponse({status: 700, description: 'Creates a user successfully',})
  @ApiResponse({status: 704, description: 'User already exists in the database',})
  @ApiResponse({status: 999, description: 'Internal server error',})
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    try{
      const user = await this.userService.create(createUserDto);
      return response.json({
        success: true,
        responseData: user,
        messageCode: '700',
      });
    }
    catch (error) {
      if (error instanceof ConflictException) {
        return response.json({
          success: false,
          responseData: null,
          messageCode: '704',
        });
      }
      return response.json({
        success: false,
        responseData: false,
        messageCode: '999',
      });
    }
  }

  
  @Get()
  @ApiOperation({ summary: 'Finds all users' })
  @ApiResponse({ status: 700, description: 'Return all users', })
  @ApiResponse({ status: 709, description: 'No users found', })
  @ApiResponse({ status: 999, description: 'Internal server error', })
  async findAll(@Res() response: Response) {
    try {
      const users = await this.userService.findAll();
      if (users.length === 0) {
        return response.json({
          success: false,
          responseData: [],
          messageCode: '709',
        });
      }
      return response.json({
        success: true,
        responseData: users,
        messageCode: '700',
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        responseData: false,
        messageCode: '999',
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Finds  a user' })
  @ApiResponse({ status: 700, description: 'Return a user',})
  @ApiResponse({ status: 703, description: 'No user found', })
  @ApiResponse({ status: 999, description: 'Internal server error', })
  async findOne(@Param('id') id: string, @Res() response: Response) {
    try {
      const user = await this.userService.findOne(id);
      return response.json({
        success: true,
        responseData: user,
        messageCode: '700',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.json({
          success: false,
          responseData: null,
          messageCode: '703',
        });
      }
      return response.json({
        success: false,
        responseData: false,
        messageCode: '999',
      });
    }
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Finds  a user' })
  @ApiResponse({ status: 700, description: 'Return a user',})
  @ApiResponse({ status: 703, description: "User doesn't exist", })
  @ApiResponse({ status: 999, description: 'Internal server error', })
  async findByEmail(@Param('email') email: string, @Res() response: Response){
    try{
      const user = await this.userService.findByEmail(email);
      return response.json({
        success: true,
        responseData: user,
        messageCode: '700',
      });
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        return response.json({
          success: false,
          responseData: null,
          messageCode: '703',
        });
      }
      return response.json({
        success: false,
        responseData: false,
        messageCode: '999',
      });
    }
    
  }

  @Patch(':id/activation')
  @ApiOperation({ summary: 'Activates a user' })
  @ApiResponse({ status: 700, description: 'User activated successfully' })
  @ApiResponse({ status: 701, description: 'User has already been activated' })
  @ApiResponse({ status: 702, description: 'User not found when activating account', })
  @ApiResponse({ status: 999, description: 'Internal error' })
  async activateUser(
    @Param('id') id: string,
    @Body() activateUserDto: ActivateUserDto,
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.userService.activateUser(
        id,
        activateUserDto,
      );
      return response.status(HttpStatus.OK).json({
        success: true,
        messageCode: '700',
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          success: false,
          messageCode: '702',
        });
      } else if (error.message === 'User already activated') {
        return response.json({
          success: false,
          messageCode: '701',
        });
      } else {
        return response.json({
          success: false,
          messageCode: '999',
        });
      }
    }
  }


  @Put(':id')
  @ApiOperation({ summary: 'Updates a user' })
  @ApiResponse({ status: 700, description: 'User updated successfully', })
  @ApiResponse({ status: 703, description: 'User not found', })
  @ApiResponse({ status: 999, description: 'Internal server error', })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response: Response ) {
    try{
      const updatedUser = await this.userService.update(id, updateUserDto);
      return response.json({
        success: true,
        responseData: updatedUser,
        messageCode: '700',
      });
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        return response.json({
          success: false,
          responseData: null,
          messageCode: '703',
        });
      }
      return response.json({
        success: false,
        responseData: false,
        messageCode: '999',
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a user' })
  @ApiResponse({ status: 700, description: 'User deleted successfully', })
  @ApiResponse({ status: 703, description: 'User not found', })
  @ApiResponse({ status: 999, description: 'Internal server error', })
  async removeByid(@Param('id') id: string, @Res() response: Response) {
    try{
      const user = await this.userService.removeById(id);
      return response.json({
        success: true,
        responseData: user,
        messageCode: '700',
      });
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        return response.json({
          success: false,
          responseData: null,
          messageCode: '703',
        });
      }
      return response.json({
        success: false,
        responseData: false,
        messageCode: '999',
      });
    }
  }
}
