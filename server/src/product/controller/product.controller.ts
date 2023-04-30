import { Controller, Post, Body, Res, ParseIntPipe, Param, Put } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { AddOptionGroupToProductDto, CreateProductDto, CreateProductOptionGroupDto, UpdateProductDto } from '../dto';
import { Response } from 'express';
import { ProductOptionGroupService } from '../service/product-option-group.service';
import { ProductVariantService } from '../service/product-variant.service';
import { ProductOptionService } from '../service/product-option.service';
import { CreateProductVariantDto } from '../dto/product-variant';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly productOptionGroupService: ProductOptionGroupService,
        private readonly productVariantService: ProductVariantService,
        private readonly productOptionService: ProductOptionService
    ) { }

    @Post('/create')
    async create(@Body() dto: CreateProductDto, @Res() res: Response) {
        const response = await this.productService.create(dto);
        return res.json({ response });
    }

    @Put('/update/:id')
    async update(@Body() dto: UpdateProductDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.productService.update(id, dto);
        return res.json({ response });
    }

    @Post('/create-product-option-group')
    async createProductOptionGroup(@Body() dto: CreateProductOptionGroupDto, @Res() res: Response) {
        const response = await this.productOptionGroupService.create(dto);
        return res.json({ response });
    }

    @Post('/add-option-group-to-product')
    async addOptionGroupToProduct(@Body() dto: AddOptionGroupToProductDto, @Res() res: Response) {
        const response = await this.productService.addOptionGroupToProduct(dto);
        return res.json({ response });
    }

    @Post('/create-product-variant')
    async createProductVariants(@Body() dto: CreateProductVariantDto, @Res() res: Response) {
        const response = await this.productVariantService.create(dto);
        return res.json({ response });
    }
}
