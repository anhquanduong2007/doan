import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsNumber, IsArray } from 'class-validator';

export class ProductCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string

    @IsString()
    @IsNotEmpty()
    slug: string

    @IsNumber()
    @IsOptional()
    category_id: number

    @IsNumber()
    @IsOptional()
    featured_asset_id: number
    
    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number;
}