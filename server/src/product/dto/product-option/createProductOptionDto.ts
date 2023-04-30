import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductOptionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsNumber()
    @IsOptional()
    product_option_group_id?: number;
}
