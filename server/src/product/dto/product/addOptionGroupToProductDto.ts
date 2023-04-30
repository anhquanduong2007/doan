import { IsNumber } from 'class-validator';

export class AddOptionGroupToProductDto {
    @IsNumber()
    option_group_id: number;

    @IsNumber()
    product_id: number;

}
