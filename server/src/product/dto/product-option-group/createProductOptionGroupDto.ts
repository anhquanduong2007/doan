import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { CreateProductOptionDto } from '../product-option/createProductOptionDto';

export class CreateProductOptionGroupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsArray()
    options: Array<CreateProductOptionDto>
}
