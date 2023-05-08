import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
export class SpecialityCreateDto {
  @IsString()
  @IsNotEmpty()
  type_name: string;

  @IsInt()
  @IsNotEmpty()
  type_number: number;

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsNotEmpty()
  type_code: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsInt()
  @IsOptional()
  position: number;

  @IsInt()
  @Min(0)
  @Max(1)
  active: number = 1;
}