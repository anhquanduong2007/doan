
import { IsString, IsNotEmpty, IsOptional,IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class BrandCreateDto {
    @IsString()
    @IsNotEmpty()
    brand_name: string;

    @IsString()
    @IsNotEmpty()
    brand_code: string;

    @IsString()
    @IsOptional()
    content: string

    @IsString()
    @IsOptional()
    icon: string

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => +value)
    status?: number;
}