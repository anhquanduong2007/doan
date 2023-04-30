import { IsString, IsOptional } from 'class-validator';

export class UpdateAssetDto {
    @IsString()
    @IsOptional()
    name: string;
}
