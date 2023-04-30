import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'types';
import { ProductOptionGroup, ProductOption } from '@prisma/client';
import { CreateProductOptionGroupDto } from '../dto';
import { ProductOptionService } from './product-option.service';

@Injectable()
export class ProductOptionGroupService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productOptionService: ProductOptionService
    ) { }

    public async create(input: CreateProductOptionGroupDto): Promise<IResponse<ProductOptionGroup & { options: ProductOption[] }>> {
        const { code, name, options } = input;
        const newProductOptionGroup = await this.prisma.productOptionGroup.create({
            data: {
                code,
                name,
            }
        })
        const [newProductOptions] = await Promise.all([
            await Promise.all(options.map((option) => {
                return this.productOptionService.create({
                    code: option.code,
                    name: option.name,
                    product_option_group_id: newProductOptionGroup.id
                })
            }))
        ])
        return {
            code: 200,
            success: true,
            message: 'Success!',
            data: {
                ...newProductOptionGroup,
                options: newProductOptions
            }
        }
    }
}
