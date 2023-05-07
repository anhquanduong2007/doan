import { Injectable } from '@nestjs/common';
import { campaign } from '@prisma/client';
import { IResponse } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignCreateDto, CampaignUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class CampaignService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(input: CampaignCreateDto): Promise<IResponse<campaign>> {
        try {
            const { active, campaign_name, content, end_day, start_day } = input
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: await this.prisma.campaign.create({
                    data: {
                        campaign_name,
                        active,
                        content,
                        end_day,
                        start_day,
                    }
                })
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    async delete(id: number): Promise<IResponse<campaign>> {
        try {
            const campaign = await this.prisma.campaign.findUnique({
                where: { id }
            })
            if (campaign) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.campaign.delete({
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Campaign does not exist in the system!',
                success: false,
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    async campaign(id: number): Promise<IResponse<campaign>> {
        try {
            const campaign = await this.prisma.campaign.findUnique({
                where: { id }
            })
            if (campaign) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: campaign
                }
            }
            return {
                code: 404,
                message: 'Campaign does not exist in the system!',
                success: false,
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    async campaigns(input: PaginationDto): Promise<IResponse<{ campaigns: campaign[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, campaigns] = await this.prisma.$transaction([
                this.prisma.campaign.count(),
                this.prisma.campaign.findMany({
                    take: take || 10,
                    skip: skip || 0,
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    campaigns,
                    totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                    total: totalRecord,
                    skip: skip || 0,
                    take: take || 10
                }
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    async update(input: CampaignUpdateDto, id: number): Promise<IResponse<campaign>> {
        try {
            const { active, campaign_name, content, end_day, start_day } = input
            const campaign = await this.prisma.campaign.findUnique({
                where: { id }
            })
            if (campaign) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.campaign.update({
                        data: {
                            ...campaign_name && { campaign_name },
                            ...end_day && { end_day },
                            ...content && { content },
                            ...start_day && { start_day },
                            ...active && { active }
                        },
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Campaign does not exist in the system!',
                success: false,
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

}
