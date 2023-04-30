import { Injectable } from '@nestjs/common';
import { AddOptionGroupToProductDto, CreateProductDto, UpdateProductDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'types';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async create(input: CreateProductDto): Promise<IResponse<Product>> {
        const { description, enabled, name, slug } = input;
        const isSlugExist = await this.prisma.product.findUnique({ where: { slug } });
        if (isSlugExist) {
            return {
                code: 400,
                success: false,
                message: 'Slug already exist!',
                fieldError: 'slug',
            };
        }
        const newProduct = await this.prisma.product.create({
            data: {
                name,
                slug,
                enabled,
                description
            }
        })
        return {
            code: 200,
            success: true,
            message: 'Success!',
            data: newProduct
        }
    }

    public async update(id: number, input: UpdateProductDto): Promise<IResponse<Product>> {
        const { description, enabled, name, slug } = input;
        const product = await this.prisma.product.findUnique({ where: { id } })
        if (product) {
            const isSlugExist = await this.prisma.product.findFirst({ where: { AND: [{ slug }, { NOT: [{ id }] }] } })
            if (isSlugExist) {
                return {
                    code: 400,
                    success: false,
                    message: 'Slug already exist!',
                    fieldError: 'slug',
                }
            }
            const productUpdate = await this.prisma.product.update({
                where: { id },
                data: {
                    name,
                    slug,
                    enabled,
                    description
                },
            })
            return {
                code: 200,
                success: true,
                message: 'Success!',
                data: productUpdate
            }
        }
        return {
            code: 400,
            message: 'Product does not exist in the system!',
            success: false,
        }
    }

    public async addOptionGroupToProduct(input: AddOptionGroupToProductDto) {
        const { option_group_id, product_id } = input
        return await this.prisma.productOptionGroup.update({
            where: {
                id: option_group_id
            },
            data: {
                product_id,
            },
            include: {
                product: true,
                product_option: true
            }
        })
    }
}
