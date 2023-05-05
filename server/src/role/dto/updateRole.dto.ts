import { CreateRoleDto } from './createRole.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto extends CreateRoleDto {
    @IsString()
    @IsOptional()
    role_name: string;

    @IsString()
    @IsOptional()
    role_code: string;
}