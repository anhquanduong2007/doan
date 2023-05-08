import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsNumber } from 'class-validator';

export class ProductCreateDto {
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    @IsOptional()
    price_sell: number

    @IsNumber()
    @IsOptional()
    sale: number

    @IsNumber()
    @IsOptional()
    price: number

    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    @IsNotEmpty()
    category_id: number

    @IsNumber()
    @IsOptional()
    brand_id: number

    @IsNumber()
    @IsOptional()
    asset_id: number

    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number;

    @IsNumber()
    @IsOptional()
    quantity: number;
}