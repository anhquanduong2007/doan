import { BrandCreateDto } from "./brandCreate.dto";
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BrandEditDto extends BrandCreateDto {
    @IsString()
    @IsOptional()
    brand_name: string;

    @IsString()
    @IsOptional()
    brand_code: string;
}