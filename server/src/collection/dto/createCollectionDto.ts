import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCollectionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    isPrivate: boolean
}
