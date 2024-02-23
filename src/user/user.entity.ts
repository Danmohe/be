// src/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name : 'users'})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column( {unique: true} )
  email: string;

  @Column( { nullable: true } )
  password: string;

  @Column( { nullable: true } )
  isActivated: boolean;
  
  @Column( { nullable: true } )
  accessToken: string;


}