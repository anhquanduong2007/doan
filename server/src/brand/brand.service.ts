import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BrandCreateDto } from './dto';
import { IResponse } from 'src/common/types';
import { brand } from '@prisma/client';
import { BrandUpdateDto } from './dto/brandUpdate.dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class BrandService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(input: BrandCreateDto): Promise<IResponse<brand>> {
        try {
            const { brand_code, brand_name, content, icon, active } = input
            const isExistingBrandCode = await this.prisma.brand.findUnique({
                where: { brand_code }
            })
            if (isExistingBrandCode) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "brand_code",
                    message: 'Brand code already exists!',
                }
            }
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: await this.prisma.brand.create({
                    data: {
                        brand_name,
                        brand_code,
                        content,
                        icon,
                        active
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

    async brand(id: number): Promise<IResponse<brand>> {
        try {
            const brand = await this.prisma.brand.findUnique({
                where: { id }
            })
            if (brand) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: brand
                }
            }
            return {
                code: 404,
                message: 'Brand does not exist in the system!',
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

    async delete(id: number): Promise<IResponse<brand>> {
        try {
            const brand = await this.prisma.brand.findUnique({
                where: { id }
            })
            if (brand) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.brand.delete({
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Brand does not exist in the system!',
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

    async update(input: BrandUpdateDto, id: number): Promise<IResponse<brand>> {
        try {
            const { brand_code, brand_name, content, active, icon } = input
            const brand = await this.prisma.brand.findUnique({
                where: { id }
            })
            if (brand) {
                const isExistingBrandCode = await this.prisma.brand.findFirst({
                    where: {
                        AND: [
                            { brand_code },
                            {
                                NOT: [
                                    { id }
                                ]
                            }
                        ]
                    },
                })
                if (isExistingBrandCode) {
                    return {
                        code: 400,
                        success: false,
                        fieldError: "brand_code",
                        message: 'Brand code already exists!',
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.brand.update({
                        data: {
                            ...brand_name && { brand_code },
                            ...brand_code && { brand_code },
                            ...content && { content },
                            ...icon && { icon },
                            ...active && { active }
                        },
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Brand does not exist in the system!',
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

    async brands(input: PaginationDto): Promise<IResponse<{ brands: brand[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, brands] = await this.prisma.$transaction([
                this.prisma.brand.count(),
                this.prisma.brand.findMany({
                    take: take || 10,
                    skip: skip || 0,
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    brands,
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
}
