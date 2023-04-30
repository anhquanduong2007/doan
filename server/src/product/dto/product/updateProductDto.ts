import { IsString, IsOptional } from 'class-validator';
import { CreateProductDto } from './createProductDto';

export class UpdateProductDto extends CreateProductDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    slug: string;
}
