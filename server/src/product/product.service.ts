import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductCreateDto } from './dto';
import { IResponse } from 'src/common/types';
import { product } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { ProductUpdateDto } from './dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async create(input: ProductCreateDto, userId: number): Promise<IResponse<product>> {
        try {
            const { active, asset_id, brand_id, category_id, description, price, price_sell, product_name, quantity, sale, sku } = input
            const [isSkuValid, isCategoryValid, isAssetValid, isBrandValid] = await Promise.all([
                this.prisma.product.findUnique({ where: { sku } }),
                this.prisma.category.findUnique({ where: { id: category_id } }),
                ...asset_id ? [this.prisma.asset.findUnique({ where: { id: asset_id } })] : [],
                ...brand_id ? [this.prisma.brand.findUnique({ where: { id: brand_id } })] : []
            ])
            if (isSkuValid) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "sku",
                    message: 'Sku already exists!',
                }
            }
            if (!isCategoryValid) {
                return {
                    code: 404,
                    success: false,
                    fieldError: "category_id",
                    message: 'Category does not exist in the system!',
                }
            }
            if (asset_id && !isAssetValid) {
                return {
                    code: 404,
                    success: false,
                    fieldError: "asset_id",
                    message: 'Asset does not exist in the system!',
                }
            }
            if (brand_id && !isBrandValid) {
                return {
                    code: 404,
                    success: false,
                    fieldError: "brand_id",
                    message: 'Brand does not exist in the system!',
                }
            }
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: await this.prisma.product.create({
                    data: {
                        active,
                        asset_id,
                        brand_id,
                        category_id,
                        description,
                        price,
                        price_sell,
                        product_name,
                        quantity,
                        sale,
                        sku,
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

    public async delete(id: number): Promise<IResponse<product>> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id }
            })
            if (product) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product.delete({
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product does not exist in the system!',
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

    public async product(id: number): Promise<IResponse<product>> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id }
            })
            if (product) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: product
                }
            }
            return {
                code: 404,
                message: 'Product does not exist in the system!',
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

    public async products(input: PaginationDto): Promise<IResponse<{ products: product[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, products] = await this.prisma.$transaction([
                this.prisma.product.count(),
                this.prisma.product.findMany({
                    take: take || 10,
                    skip: skip || 0,
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    products,
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

    public async update(input: ProductUpdateDto, id: number, userId: number): Promise<IResponse<product>> {
        try {
            const { active, asset_id, brand_id, category_id, description, price, price_sell, product_name, quantity, sale, sku } = input
            const product = await this.prisma.product.findUnique({
                where: { id }
            })
            if (product) {
                const [isSkuValid, isCategoryValid, isAssetValid, isBrandValid] = await Promise.all([
                    ...sku ? [this.prisma.product.findFirst({
                        where: {
                            AND: [
                                { sku },
                                {
                                    NOT: [
                                        { id }
                                    ]
                                }
                            ]
                        }
                    })] : [],
                    ...category_id ? [this.prisma.category.findUnique({ where: { id: category_id } })] : [],
                    ...asset_id ? [this.prisma.asset.findUnique({ where: { id: asset_id } })] : [],
                    ...brand_id ? [this.prisma.brand.findUnique({ where: { id: brand_id } })] : []
                ])
                if (sku && isSkuValid) {
                    return {
                        code: 400,
                        success: false,
                        fieldError: "sku",
                        message: 'Sku already exists!',
                    }
                }
                if (category_id && !isCategoryValid) {
                    return {
                        code: 404,
                        success: false,
                        fieldError: "category_id",
                        message: 'Category does not exist in the system!',
                    }
                }
                if (asset_id && !isAssetValid) {
                    return {
                        code: 404,
                        success: false,
                        fieldError: "asset_id",
                        message: 'Asset does not exist in the system!',
                    }
                }
                if (brand_id && !isBrandValid) {
                    return {
                        code: 404,
                        success: false,
                        fieldError: "brand_id",
                        message: 'Brand does not exist in the system!',
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product.update({
                        data: {
                            ...asset_id && { asset_id },
                            ...brand_id && { brand_id },
                            ...description && { description },
                            ...category_id && { category_id },
                            ...price && { price },
                            ...price_sell && { price_sell },
                            ...product_name && { product_name },
                            ...quantity && { quantity },
                            ...sale && { sale },
                            ...sku && { sku },
                            active,
                            modified_by: userId
                        },
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product does not exist in the system!',
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
