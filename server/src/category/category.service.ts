import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryCreateDto, CategoryUpdateDto, SetCategoryParentDto } from './dto';
import { IResponse } from 'src/common/types';
import { category } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class CategoryService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async create(input: CategoryCreateDto, userId: number): Promise<IResponse<category>> {
        try {
            const { active, category_code, category_name, description } = input
            const isExistingCategoryCode = await this.prisma.category.findUnique({
                where: { category_code }
            })
            if (isExistingCategoryCode) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "category_code",
                    message: 'Category code already exists!',
                }
            }
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: await this.prisma.category.create({
                    data: {
                        category_name,
                        active,
                        description,
                        category_code,
                        created_by: userId,
                        modified_by: userId
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

    public async delete(id: number): Promise<IResponse<category>> {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id }
            })
            if (category) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.category.delete({
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Category does not exist in the system!',
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

    public async category(id: number): Promise<IResponse<category>> {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id }
            })
            if (category) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: category
                }
            }
            return {
                code: 404,
                message: 'Category does not exist in the system!',
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

    public async categories(input: PaginationDto): Promise<IResponse<{ categories: category[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, categories] = await this.prisma.$transaction([
                this.prisma.category.count(),
                this.prisma.category.findMany({
                    take: take || 10,
                    skip: skip || 0,
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    categories,
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

    public async update(input: CategoryUpdateDto, id: number, userId: number): Promise<IResponse<category>> {
        try {
            const { active, category_code, category_name, description } = input
            const category = await this.prisma.category.findUnique({
                where: { id }
            })
            if (category) {
                const isExistingCategoryCode = await this.prisma.category.findFirst({
                    where: {
                        AND: [
                            { category_code },
                            {
                                NOT: [
                                    { id }
                                ]
                            }
                        ]
                    },
                })
                if (isExistingCategoryCode) {
                    return {
                        code: 400,
                        success: false,
                        fieldError: "category_code",
                        message: 'Category code already exists!',
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.category.update({
                        data: {
                            ...category_code && { category_code },
                            ...category_name && { category_name },
                            ...description && { description },
                            active,
                            modified_by: userId
                        },
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Category does not exist in the system!',
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

    public async setCategoryParent(input: SetCategoryParentDto, id: number, userId: number): Promise<IResponse<category>> {
        try {
            const { parent_id } = input
            const category = await this.prisma.category.findUnique({
                where: { id }
            })
            if (category) {
                const isExistingCategoryParent = await this.prisma.category.findUnique({
                    where: { id: parent_id }
                })
                if (!isExistingCategoryParent) {
                    return {
                        code: 404,
                        message: 'Category parent does not exist in the system!',
                        success: false,
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.category.update({
                        data: {
                            parent_id,
                            modified_by: userId
                        },
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Category does not exist in the system!',
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

    public async removeCategoryParent(id: number, userId: number): Promise<IResponse<category>> {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id }
            })
            if (category) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.category.update({
                        data: {
                            parent_id: null,
                            modified_by: userId
                        },
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Category does not exist in the system!',
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