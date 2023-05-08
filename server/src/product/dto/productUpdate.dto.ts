import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ProductCreateDto } from './productCreate.dto';

export class ProductUpdateDto extends ProductCreateDto {
    @IsString()
    @IsOptional()
    product_name: string;

    @IsString()
    @IsOptional()
    sku: string;


    @IsNumber()
    @IsOptional()
    category_id: number
}