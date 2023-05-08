import { SpecialityCreateDto } from "./specialityCreate.dto";
import { IsString, IsOptional, IsInt } from 'class-validator';

export class SpecialityUpdateDto extends SpecialityCreateDto {
  @IsString()
  @IsOptional()
  type_name: string;

  @IsInt()
  @IsOptional()
  type_number: number;

  @IsString()
  @IsOptional()
  type_code: string;

  @IsString()
  @IsOptional()
  type: string;
}