import {
  IsString,
  IsEmail,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContactDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];

  @IsArray()
  @IsString({ each: true })
  phones: string[];
}

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  birthDate: string;

  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsArray()
  @IsEnum(['user', 'admin', 'moderator'], { each: true })
  roles: ('user' | 'admin' | 'moderator')[];

  @IsEnum(['active', 'suspended', 'deleted'])
  status: 'active' | 'suspended' | 'deleted';
}
