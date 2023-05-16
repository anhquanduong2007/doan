import { IsNumber, IsOptional } from "class-validator"

export class AddProductVariantToCardDto {
    @IsNumber()
    @IsOptional()
    quantity: number
}

