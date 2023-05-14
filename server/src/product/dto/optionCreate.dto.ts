import { OptionName } from "@prisma/client"
import { IsArray, IsEnum, IsNotEmpty } from "class-validator"

export class OptionCreateDto {
    @IsEnum(OptionName)
    @IsNotEmpty()
    name: OptionName

    @IsArray()
    value: string
}