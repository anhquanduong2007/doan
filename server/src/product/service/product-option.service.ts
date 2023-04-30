import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'types';
import { ProductOption } from '@prisma/client';
import { CreateProductOptionDto } from '../dto';

@Injectable()
export class ProductOptionService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async create(input: CreateProductOptionDto): Promise<ProductOption> {
        const { code, name, product_option_group_id } = input;
        return await this.prisma.productOption.create({
            data: {
                code,
                name,
                product_option_group_id
            }
        })
    }

}
