import { CreateRoleDto } from './createRoleDto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto extends CreateRoleDto {
    @IsString()
    @IsOptional()
    code: string;
}
