import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;
}