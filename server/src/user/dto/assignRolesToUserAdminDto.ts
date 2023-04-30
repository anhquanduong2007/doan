import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRolesToUserAdminDto {
    @IsArray()
    @IsNotEmpty()
    @IsNumber({}, { each: true })
    role_ids: number[];
}
