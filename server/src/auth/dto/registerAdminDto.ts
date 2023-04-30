import { IsString, IsEmail, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  phone: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  gender: boolean;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  active: boolean;
}
