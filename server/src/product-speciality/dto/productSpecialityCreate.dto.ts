import { IsOptional, IsInt } from 'class-validator';
export class ProductSpecialityCreateDto {
  @IsInt()
  @IsOptional()
  speciality_id: number;

  @IsInt()
  @IsOptional()
  product_id: number;
}