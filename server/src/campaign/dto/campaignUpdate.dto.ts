import { IsString, IsOptional, IsDateString } from 'class-validator';
import { CampaignCreateDto } from './campaignCreate.dto';

export class CampaignUpdateDto extends CampaignCreateDto {
    @IsString()
    @IsOptional()
    campaign_name: string;

    @IsDateString()
    @IsOptional()
    start_day: string;

    @IsDateString()
    @IsOptional()
    end_day: string;
}