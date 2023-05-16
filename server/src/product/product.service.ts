import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OptionCreateDto, ProductCreateDto, ProductVariantCreateDto } from './dto';
import { IResponse } from 'src/common/types';
import { product, product_option, product_variant } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { ProductUpdateDto, OptionBulkCreateDto } from './dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async productCreate(input: ProductCreateDto, userId: number): Promise<IResponse<product>> {
        try {
            const { active, category_id, description, name, slug, featured_asset_id, asset_ids } = input
            const isSlugExist = await this.prisma.product.findUnique({
                where: { slug }
            })
            if (isSlugExist) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "slug",
                    message: 'Slug already exists in the system!',
                }
            }
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: await this.prisma.product.create({
                    data: {
                        active,
                        slug,
                        name,
                        category_id,
                        description,
                        featured_asset_id,
                        created_by: userId,
                        modified_by: userId,
                        asset_ids: {
                            createMany: {
                                data: asset_ids ? asset_ids.map((id) => {
                                    return {
                                        asset_id: id
                                    }
                                }) : []
                            }
                        }
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

    public async product(id: number): Promise<IResponse<product>> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
                include: {
                    featured_asset: true,
                    asset_ids: {
                        include: {
                            asset: true
                        }
                    }
                }
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
    // public async delete(id: number): Promise<IResponse<product>> {
    //     try {
    //         const product = await this.prisma.product.findUnique({
    //             where: { id }
    //         })
    //         if (product) {
    //             return {
    //                 code: 200,
    //                 message: 'Success',
    //                 success: true,
    //                 data: await this.prisma.product.delete({
    //                     where: { id }
    //                 })
    //             }
    //         }
    //         return {
    //             code: 404,
    //             message: 'Product does not exist in the system!',
    //             success: false,
    //         }
    //     } catch (error) {
    //         return {
    //             code: 500,
    //             message: "An error occurred in the system!",
    //             success: false,
    //         }
    //     }
    // }

    public async products(input: PaginationDto): Promise<IResponse<{ products: product[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, products] = await this.prisma.$transaction([
                this.prisma.product.count(),
                this.prisma.product.findMany({
                    take: take || 10,
                    skip: skip || 0,
                    include: {
                        featured_asset: true,
                        asset_ids: {
                            include: {
                                asset: true
                            }
                        }
                    }
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

    // public async update(input: ProductUpdateDto, id: number, userId: number): Promise<IResponse<product>> {
    //     try {
    //         const { active, asset_id, brand_id, category_id, description, price, price_sell, product_name, quantity, sale, sku } = input
    //         const product = await this.prisma.product.findUnique({
    //             where: { id }
    //         })
    //         if (product) {
    //             const [isSkuValid, isCategoryValid, isAssetValid, isBrandValid] = await Promise.all([
    //                 ...sku ? [this.prisma.product.findFirst({
    //                     where: {
    //                         AND: [
    //                             { sku },
    //                             {
    //                                 NOT: [
    //                                     { id }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 })] : [],
    //                 ...category_id ? [this.prisma.category.findUnique({ where: { id: category_id } })] : [],
    //                 ...asset_id ? [this.prisma.asset.findUnique({ where: { id: asset_id } })] : [],
    //                 ...brand_id ? [this.prisma.brand.findUnique({ where: { id: brand_id } })] : []
    //             ])
    //             if (sku && isSkuValid) {
    //                 return {
    //                     code: 400,
    //                     success: false,
    //                     fieldError: "sku",
    //                     message: 'Sku already exists!',
    //                 }
    //             }
    //             if (category_id && !isCategoryValid) {
    //                 return {
    //                     code: 404,
    //                     success: false,
    //                     fieldError: "category_id",
    //                     message: 'Category does not exist in the system!',
    //                 }
    //             }
    //             if (asset_id && !isAssetValid) {
    //                 return {
    //                     code: 404,
    //                     success: false,
    //                     fieldError: "asset_id",
    //                     message: 'Asset does not exist in the system!',
    //                 }
    //             }
    //             if (brand_id && !isBrandValid) {
    //                 return {
    //                     code: 404,
    //                     success: false,
    //                     fieldError: "brand_id",
    //                     message: 'Brand does not exist in the system!',
    //                 }
    //             }
    //             return {
    //                 code: 200,
    //                 message: 'Success',
    //                 success: true,
    //                 data: await this.prisma.product.update({
    //                     data: {
    //                         ...asset_id && { asset_id },
    //                         ...brand_id && { brand_id },
    //                         ...description && { description },
    //                         ...category_id && { category_id },
    //                         ...price && { price },
    //                         ...price_sell && { price_sell },
    //                         ...product_name && { product_name },
    //                         ...quantity && { quantity },
    //                         ...sale && { sale },
    //                         ...sku && { sku },
    //                         active,
    //                         modified_by: userId
    //                     },
    //                     where: { id }
    //                 })
    //             }
    //         }
    //         return {
    //             code: 404,
    //             message: 'Product does not exist in the system!',
    //             success: false,
    //         }
    //     } catch (error) {
    //         return {
    //             code: 500,
    //             message: "An error occurred in the system!",
    //             success: false,
    //         }
    //     }
    // }

    public async productVariant(id: number): Promise<IResponse<product_variant>> {
        try {
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id },
                include: {
                    featured_asset: true,
                    asset_ids: {
                        include: {
                            asset: true
                        }
                    }
                }
            })
            if (productVariant) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: productVariant
                }
            }
            return {
                code: 404,
                message: 'Product variant does not exist in the system!',
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

    public async productVariants(input: PaginationDto, productId: number): Promise<IResponse<{ product_variants: product_variant[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, product_variants] = await this.prisma.$transaction([
                this.prisma.product_variant.count(),
                this.prisma.product_variant.findMany({
                    where: {
                        product_id: productId
                    },
                    take: take || 10,
                    skip: skip || 0,
                    include: {
                        featured_asset: true,
                        asset_ids: {
                            include: {
                                asset: true
                            }
                        }
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    product_variants,
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

    public async optionBulkCreate(input: OptionBulkCreateDto, userId: number): Promise<IResponse<product_option[]>> {
        try {
            const { options } = input
            const opts = options.map((option) => {
                return option.value.map((v) => {
                    return {
                        name: option.name,
                        value: v,
                    }
                })
            }).flat(1)
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.$transaction(
                    opts.map((opt) => this.prisma.product_option.create({
                        data: {
                            name: opt.name,
                            value: opt.value,
                            created_by: userId,
                            modified_by: userId
                        }
                    }))
                )
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async optionCreate(input: OptionCreateDto, userId: number): Promise<IResponse<product_option>> {
        try {
            const { name, value } = input
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.product_option.create({
                    data: {
                        name,
                        value,
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

    public async productVariantCreate(input: ProductVariantCreateDto, userId: number): Promise<IResponse<product_variant>> {
        try {
            const { option_ids, price, product_id, sku, stock } = input
            const isSkuValid = await this.prisma.product_variant.findUnique({
                where: { sku }
            })
            if (isSkuValid) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "sku",
                    message: 'Sku already exists in the system!',
                }
            }
            return {
                code: 200,
                success: true,
                data: await this.prisma.product_variant.create({
                    data: {
                        sku,
                        created_by: userId,
                        modified_by: userId,
                        price,
                        stock,
                        product_id,
                        product_options: {
                            createMany: {
                                data: option_ids.map((id) => {
                                    return {
                                        product_option_id: id
                                    }
                                })
                            }
                        }
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

    public async productVariantBulkCreate(input: { variants: ProductVariantCreateDto[] }, userId: number): Promise<IResponse<product_variant[]>> {
        try {
            const { variants } = input
            const skus = await this.prisma.$transaction(
                variants.map((variant) => this.prisma.product_variant.findUnique({ where: { sku: variant.sku } }))
            )
            const isSkuNotExist = skus.some(el => el === null);
            if (!isSkuNotExist) {
                return {
                    code: 400,
                    success: false,
                    fieldError: "sku",
                    message: 'Looks like a certain sku already exists in the system!',
                }
            }
            return {
                code: 200,
                success: true,
                data: await this.prisma.$transaction(
                    variants.map((variant) => {
                        return this.prisma.product_variant.create({
                            data: {
                                sku: variant.sku,
                                created_by: userId,
                                modified_by: userId,
                                price: variant.price,
                                stock: variant.stock,
                                product_id: variant.product_id,
                                product_options: {
                                    createMany: {
                                        data: variant.option_ids.map((id) => {
                                            return {
                                                product_option_id: id
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    })
                )
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async productVariantDelete(id: number): Promise<IResponse<product_variant>> {
        try {
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id }
            })
            if (productVariant) {
                await this.prisma.product_variant_option.deleteMany({
                    where: { product_variant_id: id }
                })
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product_variant.delete({
                        where: { id }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product variant does not exist in the system!',
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

    // ** Product favorite **
    public async addProductFavorite() {
        try {

        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async listProductFavorite() {
        try {

        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async removeProductFavorite() {
        try {

        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async bulkRemoveProductFavorite() {
        try {

        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    // ** Cart **
    public async addProductToCard() {
        try {

        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async removeProductFromCard() {
        try {

        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async listProductFromCard() {
        try {

        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }
}