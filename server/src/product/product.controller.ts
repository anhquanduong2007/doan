import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { ProductCreateDto, ProductUpdateDto } from './dto';
import { ProductService } from './product.service';
import { PaginationDto } from 'src/common/dto';


@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post("create")
    @Permission(Permissions.CreateProduct)
    async createBrand(@Req() req: Request, @Body() dto: ProductCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.create(dto, userId)
        res.json({ response })
    }

    @Get(":id")
    @Permission(Permissions.ReadProduct)
    async getProduct(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.productService.product(id)
        res.json({ response })
    }

    @Delete("delete/:id")
    @Permission(Permissions.DeleteProduct)
    async deleteProduct(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.productService.delete(id)
        res.json({ response })
    }

    @Get()
    @Permission(Permissions.ReadProduct)
    async getCategories(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.productService.products(pagination);
        return res.json({ response });
    }

    @Put("update/:id")
    @Permission(Permissions.UpdateProduct)
    async editCategory(@Req() req: Request, @Body() dto: ProductUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.update(dto, id, userId)
        res.json({ response })
    }
}
