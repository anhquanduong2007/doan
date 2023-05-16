
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsDateString, IsNumber } from 'class-validator';

export class CategoryCreateDto {
    @IsString()
    @IsNotEmpty()
    category_name: string;

    @IsString()
    @IsNotEmpty()
    category_code: string;

    @IsString()
    @IsOptional()
    description: string;
    
    @IsNumber()
    @IsOptional()
    parent_id: number;

    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number;
}