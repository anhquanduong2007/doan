import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'types';
import { ProductVariant } from '@prisma/client';
import { CreateProductVariantDto } from '../dto/product-variant';

@Injectable()
export class ProductVariantService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async create(input: CreateProductVariantDto): Promise<IResponse<ProductVariant>> {
        const { enabled, name, product_id, sku, price, stock_on_hand, option_ids } = input;
        const existingSku = await this.prisma.productVariant.findUnique({
            where: { sku },
        });
        if (existingSku) {
            return {
                code: 400,
                success: false,
                message: 'Duplicated sku!',
                fieldError: 'sku',
            };
        }
        const newProductVariant = await this.prisma.productVariant.create({
            data: {
                name,
                price,
                sku,
                enabled,
                stockOnHand: stock_on_hand,
                product_id,
                product_variant_on_product_option: {
                    create: option_ids.map((option_id) => {
                        return {
                            product_option_id: option_id
                        }
                    })
                }
            }
        })
        return {
            code: 200,
            success: true,
            message: 'Success!',
            data: newProductVariant
        }
    }

}
