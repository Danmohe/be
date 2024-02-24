// src/user.service.ts
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/Create-user.dto';
import { UpdateUserDto } from './dto/Update-user.dto';
import { InviteUserDto } from './dto/Invite-user.dto';
import { EmailService } from 'src/email/email.service';
import { ActivateUserDto } from './dto/Activate-user.dto';
import { SecurityService } from 'src/security/security.service';
import { Console } from 'console';


@Injectable()

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
    private securityService: SecurityService,
  ) {}


  async addUser(inviteUserDto: InviteUserDto): Promise<User> {
    try{
      const existingUser= await this.findByEmail(inviteUserDto.email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const { firstName, lastName, email } = inviteUserDto;
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        isActivated: false,
      });
      await this.userRepository.save(user);
      return user;
    }
    catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while creating the user');
    }
    
    
  }

  
  
  async findAll(): Promise< Partial<User>[]> {
    try{
      const users = await this.userRepository.find();
      if (users.length !== 0) {
          const partialUsers = users.map(user => {
              const { password, accessToken, ...partialUser} = user;
              return partialUser;
          });
          return partialUsers;
      }
      return users;
    }
    catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while fetching the users');
    }
    
  }

  async findOne(id: string): Promise<Partial<User>> {
    try{
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, accessToken, ...partialUser } = user;
      return partialUser;
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while fetching the user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try{
      const user= await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while fetching the user');
    }
  }

  async createDirectly(createUserDto: CreateUserDto) {
    console.log('createDirectly service');
    console.log('DB-url in service', process.env.DATABASE_URL);
    console.log(createUserDto.email);
    console.log(createUserDto.firstName);
    console.log(createUserDto.lastName);
    console.log(createUserDto.password);
    console.log(createUserDto.accessToken);
    try{
      console.log("trying to create the user");
      const user = await this.userRepository.create(createUserDto);
      console.log(user);
      console.log(user.id);
      console.log(user.firstName);
      console.log(user.lastName);
      console.log(user.email);
      console.log(user.password);
      console.log(user.accessToken);
      console.log("trying to save user");
      return await this.userRepository.save(user);
      
      
    }
    catch (error) {
      if (error instanceof ConflictException) {
        console.log("ConflictException");
        throw error;

      }
      console.log("Error message", error.message, "just error", error);
      console.log("Other error 'An unexpected error occurred while creating the user'")
      throw new InternalServerErrorException('An unexpected error occurred while creating the user');
    }
  }

  async removeById(id: string): Promise<Partial<User>> {
    try {
      const userToRemove = await this.userRepository.findOne({ where: { id } });
      if (!userToRemove) {
        throw new NotFoundException('User not found');
      }
      const { password, accessToken, ...partialUser } = userToRemove;
      await this.userRepository.remove(userToRemove);
      return partialUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while deleting the user');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    }
    catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while creating the user');
    }
  }

  async createInvite(inviteUserDto: InviteUserDto): Promise<Partial<User>> {
    try{
      const existingUser = await this.findByEmail(inviteUserDto.email,);
      if (existingUser) {
        throw new Error('User already invited')
      }
      await this.addUser(inviteUserDto);
      const invitedUser= await this.findByEmail(inviteUserDto.email);
      const invitedUserId= invitedUser.id;
      
      await this.emailService.sendInvitationEmail(inviteUserDto.email,inviteUserDto.firstName, invitedUserId);
      const { password, accessToken, ...partialUser } = invitedUser;
      
      return partialUser;
    }
    catch (error) {
      if (error.message === 'User already invited') {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while creating the invitation');}
    } 
  }

  async activateUser(userId: string, activateUserDto: ActivateUserDto): Promise<User> {
    try {
      const userToUpdate = await this.userRepository.findOne({ where: { id: userId } });
      if (!userToUpdate) {
        throw new NotFoundException('User not found');
      }
      if (userToUpdate.isActivated) {
        throw new Error('User already activated');
      }    
      userToUpdate.firstName = activateUserDto.firstName ?? userToUpdate.firstName;
      userToUpdate.lastName = activateUserDto.lastName ?? userToUpdate.lastName;
      userToUpdate.email = activateUserDto.email ?? userToUpdate.email;
      userToUpdate.isActivated = true;

      const hashedPassword= await this.securityService.hashPassword(activateUserDto.password);
      userToUpdate.password = hashedPassword;
      const updatedUser = await this.userRepository.save(userToUpdate);
  
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while activating the user');}
    }
  }

  async update(userId: string, userToUpdate: UpdateUserDto): Promise<User> {
    try{
      const existingUser = await this.userRepository.findOne({ where: { id: userId } });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = { ...existingUser, ...userToUpdate };
      return await this.userRepository.save(updatedUser);
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while updating the user');
    }
  }

  


  




  
}