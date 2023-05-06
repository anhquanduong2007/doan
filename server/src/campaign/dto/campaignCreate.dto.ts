
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CampaignCreateDto {
    @IsString()
    @IsNotEmpty()
    campaign_name: string;

    @IsString()
    @IsOptional()
    content: string;

    @IsDateString()
    @IsNotEmpty()
    start_day: string;

    @IsDateString()
    @IsNotEmpty()
    end_day: string;

    @IsInt()
    @Min(0)
    @Max(1)
    @IsOptional()
    active: number;
}