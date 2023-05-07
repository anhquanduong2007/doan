import { Controller, Post, Body, Res, Get, Delete, Param, ParseIntPipe, Query, Put } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Response } from 'express';
import { CampaignCreateDto, CampaignUpdateDto } from './dto';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { PaginationDto } from 'src/common/dto';

@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }


    @Post("create")
    @Permission(Permissions.CreateCampaign)
    async createCampaign(@Body() dto: CampaignCreateDto, @Res() res: Response) {
        const response = await this.campaignService.create(dto)
        res.json({ response })
    }

    @Delete("delete/:id")
    @Permission(Permissions.DeleteCampaign)
    async deleteCampaign(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.campaignService.delete(id)
        res.json({ response })
    }

    @Get(":id")
    @Permission(Permissions.ReadCampaign)
    async getCampaign(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.campaignService.campaign(id)
        res.json({ response })
    }

    @Get()
    @Permission(Permissions.ReadCampaign)
    async getCampaigns(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.campaignService.campaigns(pagination);
        return res.json({ response });
    }

    @Put("update/:id")
    @Permission(Permissions.UpdateCampaign)
    async editBrand(@Body() dto: CampaignUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.campaignService.update(dto, id)
        res.json({ response })
    }
}
