import { Type } from "class-transformer"
import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from "class-validator"
import { OptionName } from "@prisma/client"

export class OptionBulkCreateDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Option)
    options: Array<Option>
}

export class Option {
    @IsEnum(OptionName)
    @IsNotEmpty()
    name: OptionName

    @IsArray()
    value: Array<string>
}