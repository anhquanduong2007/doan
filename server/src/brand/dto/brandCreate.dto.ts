import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
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

    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number;
}