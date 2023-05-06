import { BrandCreateDto } from "./brandCreate.dto";
import { IsString, IsOptional } from 'class-validator';

export class BrandUpdateDto extends BrandCreateDto {
    @IsString()
    @IsOptional()
    brand_name: string;

    @IsString()
    @IsOptional()
    brand_code: string;
}