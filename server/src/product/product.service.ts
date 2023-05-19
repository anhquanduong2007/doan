import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductVariantToCartDto, OptionCreateDto, OptionUpdateDto, ProductCreateDto, ProductVariantCreateDto, ProductVariantUpdateDto } from './dto';
import { IResponse } from 'src/common/types';
import { cart, product, product_option, product_variant } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { ProductUpdateDto, OptionBulkCreateDto } from './dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async productCreate(input: ProductCreateDto, userId: number): Promise<IResponse<product>> {
        try {
            const { active, category_id, description, name, slug, featured_asset_id } = input
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
                    product_variants: {
                        include: {
                            featured_asset: true,
                            product_options: {
                                select: {
                                    product_option: {
                                        select: {
                                            value: true,
                                            id: true,
                                            name: true
                                        }

                                    }
                                }
                            }
                        }
                    },
                    featured_asset: true,
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

    public async delete(id: number): Promise<IResponse<product>> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
                select: {
                    product_variants: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            if (product) {
                await Promise.all([
                    this.prisma.$transaction(product.product_variants.map((product_variant) => this.prisma.product_variant_option.deleteMany({ where: { product_variant_id: product_variant.id } }))),
                ])
                await Promise.all([
                    this.prisma.product_variant.deleteMany({ where: { product_id: id } }),
                    this.prisma.product_option.deleteMany({ where: { product_id: id } }),
                ])
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

    public async products(input: PaginationDto): Promise<IResponse<{ products: product[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take, search } = input;
            const [totalRecord, products] = await this.prisma.$transaction([
                this.prisma.product.count(),
                this.prisma.product.findMany({
                    ...take && { take },
                    ...skip && { skip },
                    where: {
                        ...search && {
                            name: {
                                contains: search
                            },
                        }
                    },
                    include: {
                        featured_asset: true,
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

    public async productUpdate(input: ProductUpdateDto, id: number, userId: number): Promise<IResponse<product>> {
        try {
            const { active, name, slug, featured_asset_id, description, category_id } = input
            const product = await this.prisma.product.findUnique({
                where: { id }
            })
            if (product) {
                const [isSkuValid, isAssetValid] = await Promise.all([
                    ...slug ? [this.prisma.product.findFirst({
                        where: {
                            AND: [
                                { slug },
                                {
                                    NOT: [
                                        { id }
                                    ]
                                }
                            ]
                        }
                    })] : [],
                    ...featured_asset_id ? [this.prisma.asset.findUnique({ where: { id: featured_asset_id } })] : [],
                ])
                if (slug && isSkuValid) {
                    return {
                        code: 400,
                        success: false,
                        fieldError: "sku",
                        message: 'slug already exists!',
                    }
                }
                if (featured_asset_id && !isAssetValid) {
                    return {
                        code: 404,
                        success: false,
                        fieldError: "featured_asset_id",
                        message: 'Asset does not exist in the system!',
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product.update({
                        data: {
                            featured_asset_id,
                            ...name && { name },
                            ...description && { description },
                            ...slug && { slug },
                            category_id,
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

    public async productVariant(id: number): Promise<IResponse<product_variant>> {
        try {
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id },
                include: {
                    featured_asset: true,
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

    public async productVariantUpdate(input: ProductVariantUpdateDto, id: number): Promise<IResponse<product_variant>> {
        try {
            const { name, price, sku, stock, featured_asset_id } = input
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id },
            })
            if (productVariant) {
                if (sku) {
                    const isSkuExist = await this.prisma.product_variant.findFirst({
                        where: {
                            AND: [
                                { sku },
                                {
                                    NOT: [
                                        { id }
                                    ]
                                }
                            ]
                        },
                    })
                    if (isSkuExist) {
                        return {
                            code: 400,
                            success: false,
                            message: 'Sku code already exist!',
                            fieldError: "sku",
                        }
                    }
                }
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product_variant.update({
                        where: { id },
                        data: {
                            ...name && { name },
                            ...price && { price },
                            ...sku && { sku },
                            ...stock && { stock },
                            ...featured_asset_id && { featured_asset_id }
                        },
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
                        product_id: option.product_id
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
                            product_id: opt.product_id,
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
            const { name, value, product_id } = input
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.product_option.create({
                    data: {
                        name,
                        value,
                        product_id,
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
            const { option_ids, price, product_id, sku, stock, name } = input
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
                        name,
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
            const isSkuNotExist = skus.some(el => el !== null);
            if (isSkuNotExist) {
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
                                name: variant.name,
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
            console.log(error)
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

    public async updateProductOption(input: OptionUpdateDto, id: number): Promise<IResponse<product_option>> {
        try {
            const { value } = input
            const productOption = await this.prisma.product_option.findUnique({
                where: { id }
            })
            if (productOption) {
                return {
                    code: 200,
                    message: 'Success',
                    success: true,
                    data: await this.prisma.product_option.update({
                        where: { id },
                        data: {
                            value
                        }
                    })
                }
            }
            return {
                code: 404,
                message: 'Product option does not exist in the system!',
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
    public async addProductVariantToCart(input: AddProductVariantToCartDto, customerId: number, productVariantId: number): Promise<IResponse<cart>> {
        try {
            const { quantity } = input
            const [productVariant, isVariantExistInCard] = await Promise.all([
                this.prisma.product_variant.findUnique({
                    where: { id: productVariantId },
                }),
                this.prisma.cart.findMany({
                    where: {
                        product_variant_id: productVariantId,
                        users_id: customerId
                    }
                })
            ])
            if (!productVariant) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in the system!',
                    success: false,
                }
            }
            if (isVariantExistInCard && isVariantExistInCard.length) {
                return {
                    code: 400,
                    message: 'This product already exists on the whole card!',
                    success: false,
                }
            }
            return {
                code: 200,
                message: 'Successfully!',
                success: true,
                data: await this.prisma.cart.create({
                    data: {
                        quantity,
                        users_id: customerId,
                        product_variant_id: productVariantId
                    },
                    include: {
                        product_variant: {
                            include: {
                                product: true
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

    public async removeProductVariantFromCart(customerId: number, productVariantId: number): Promise<IResponse<{}>> {
        try {
            const isProductVariantExistInCard = await this.prisma.cart.findFirst({
                where: {
                    product_variant_id: productVariantId,
                    users_id: customerId
                }
            })
            if (!isProductVariantExistInCard) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in card!',
                    success: false,
                }
            }
            await this.prisma.cart.deleteMany({
                where: {
                    users_id: customerId,
                    product_variant_id: productVariantId
                }
            })
            return {
                code: 200,
                success: true,
                message: "Successfully",
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    public async updateProductVariantInCart(input: AddProductVariantToCartDto, customerId: number, productVariantId: number): Promise<IResponse<{}>> {
        try {
            const { quantity } = input
            const productVariant = await this.prisma.product_variant.findUnique({
                where: { id: productVariantId },
                select: {
                    stock: true
                }
            })
            if (!productVariant) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in the system!',
                    success: false,
                }
            }
            const isProductVariantExistInCard = await this.prisma.cart.findFirst({
                where: {
                    product_variant_id: productVariantId,
                    users_id: customerId
                }
            })
            if (!isProductVariantExistInCard) {
                return {
                    code: 404,
                    message: 'Product variant does not exist in card!',
                    success: false,
                }
            }
            if (quantity > productVariant.stock || quantity < productVariant.stock) {
                return {
                    code: 400,
                    message: 'Quantity exceeded limit quantity!',
                    success: false,
                }
            }
            return {
                code: 200,
                success: true,
                message: "Successfully",
                data: this.prisma.cart.updateMany({
                    where: {
                        product_variant_id: productVariantId,
                        users_id: customerId
                    },
                    data: {
                        quantity
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

    public async getListProductVariantFromCart(input: PaginationDto, customerId: number): Promise<IResponse<{ carts: cart[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take } = input;
            const [totalRecord, carts] = await this.prisma.$transaction([
                this.prisma.cart.count({
                    where: {
                        users_id: customerId
                    }
                }),
                this.prisma.cart.findMany({
                    take: take || 10,
                    skip: skip || 0,
                    where: {
                        users_id: customerId
                    },
                    include: {
                        product_variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: {
                    carts,
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

    public async getProductNewArrivals() {
        try {
            const [products] = await this.prisma.$transaction([
                this.prisma.product.findMany({
                    take: 8,
                    skip: 0,
                    where: {
                        active: 1,
                    },
                    orderBy: {
                        created_date: "desc"
                    },
                    include: {
                        featured_asset: true,
                        product_variants: true
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: products
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