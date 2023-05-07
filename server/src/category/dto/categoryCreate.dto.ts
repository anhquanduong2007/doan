
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';

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

    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number;
}