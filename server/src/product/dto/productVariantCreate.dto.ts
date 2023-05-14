import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class ProductVariantCreateDto {
    @IsNumber()
    @IsOptional()
    stock: number

    @IsString()
    @IsNotEmpty()
    sku: string

    @IsNumber()
    @IsOptional()
    price: number

    @IsNumber()
    @IsNotEmpty()
    product_id: number

    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    option_ids: number[]
    
}