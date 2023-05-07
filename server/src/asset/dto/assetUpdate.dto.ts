import { IsString, IsOptional } from 'class-validator';

export class AssetUpdateDto {
    @IsString()
    @IsOptional()
    name: string;
}