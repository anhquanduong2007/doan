
import { IsInt, IsNotEmpty } from 'class-validator';

export class SetCategoryParentDto {
    @IsInt()
    @IsNotEmpty()
    parent_id: number;
}