import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProductVariantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    @IsOptional()
    price?: number

    @IsNumber()
    @IsOptional()
    stock_on_hand?: number

    @IsNumber()
    product_id: number

    @IsArray()
    @IsOptional()
    option_ids?: Array<number>

    @IsOptional()
    enabled: boolean;
}
