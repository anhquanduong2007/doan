import { Permissions } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    permissions: Permissions[]
}
