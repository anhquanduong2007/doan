import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsNumber, } from 'class-validator';

export class PromotionCreateDto {
    @IsString()
    @IsNotEmpty()
    starts_at: string;

    @IsString()
    @IsNotEmpty()
    ends_at: string;

    @IsString()
    @IsNotEmpty()
    coupon_code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsOptional()
    limit: number;

    @IsNumber()
    @IsOptional()
    discount: number;

    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number
}