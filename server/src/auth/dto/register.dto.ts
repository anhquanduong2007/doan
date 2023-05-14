import { IsString, IsEmail, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsOptional()
    hashed_rt: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsInt()
    @Min(0)
    @Max(2)
    @IsOptional()
    gender: number;

    @IsString()
    @IsOptional()
    date_of_birth: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    phone: string;

    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number;
}