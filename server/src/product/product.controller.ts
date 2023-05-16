import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { AddProductVariantToCartDto, OptionBulkCreateDto, OptionCreateDto, ProductCreateDto, ProductUpdateDto, ProductVariantCreateDto } from './dto';
import { ProductService } from './product.service';
import { PaginationDto } from 'src/common/dto';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    // ** Cart
    @Get("cart")
    @Permission()
    async getListProductVariantFromCard(@Req() req: Request, @Query() pagination: PaginationDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.getListProductVariantFromCart(pagination, userId);
        return res.json({ response });
    }

    @Post("cart/:id")
    @Permission()
    async addProductVariantToCard(@Req() req: Request, @Param('id', ParseIntPipe) id: number, @Body() dto: AddProductVariantToCartDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.addProductVariantToCart(dto, userId, id)
        res.json({ response })
    }

    @Delete("cart/delete/:id")
    @Permission()
    async removeProductVariantFromCard(@Req() req: Request, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.removeProductVariantFromCart(userId, id)
        res.json({ response })
    }

    @Put("cart/update/:id")
    @Permission()
    async updateProductVariantInCard(@Req() req: Request, @Body() dto: AddProductVariantToCartDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.updateProductVariantInCart(dto, userId, id)
        res.json({ response })
    }

    // ** 
    @Post("create")
    @Permission(Permissions.CreateProduct)
    async createProduct(@Req() req: Request, @Body() dto: ProductCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.productCreate(dto, userId)
        res.json({ response })
    }

    @Get(":id")
    @Permission(Permissions.ReadProduct)
    async getProduct(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.productService.product(id)
        res.json({ response })
    }

    @Get()
    @Permission(Permissions.ReadProduct, Permissions.Anonymous)
    async getProducts(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.productService.products(pagination);
        return res.json({ response });
    }

    @Get("variant/:id")
    @Permission(Permissions.ReadProduct)
    async getProductVariant(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.productService.productVariant(id)
        res.json({ response })
    }

    @Get("variants/:id")
    @Permission(Permissions.ReadProduct)
    async getProductVariants(@Query() pagination: PaginationDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.productService.productVariants(pagination, id);
        return res.json({ response });
    }

    // @Delete("delete/:id")
    // @Permission(Permissions.DeleteProduct)
    // async deleteProduct(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    //     const response = await this.productService.delete(id)
    //     res.json({ response })
    // }



    // @Put("update/:id")
    // @Permission(Permissions.UpdateProduct)
    // async editCategory(@Req() req: Request, @Body() dto: ProductUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    //     const userId = req.user['userId']
    //     const response = await this.productService.update(dto, id, userId)
    //     res.json({ response })
    // }

    @Post("option/bulk-create")
    @Permission(Permissions.CreateProduct)
    async optionBulkCreate(@Req() req: Request, @Body() dto: OptionBulkCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.optionBulkCreate(dto, userId)
        res.json({ response })
    }

    @Post("option/create")
    @Permission(Permissions.CreateProduct)
    async optionCreate(@Req() req: Request, @Body() dto: OptionCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.optionCreate(dto, userId)
        res.json({ response })
    }

    @Post("variant/create")
    @Permission(Permissions.CreateProduct)
    async productVariantCreate(@Req() req: Request, @Body() dto: ProductVariantCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.productVariantCreate(dto, userId)
        res.json({ response })
    }

    @Post("variant/bulk-create")
    @Permission(Permissions.CreateProduct)
    async productVariantBulkCreate(@Req() req: Request, @Body() dto: { variants: ProductVariantCreateDto[] }, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.productService.productVariantBulkCreate(dto, userId)
        res.json({ response })
    }

    @Delete("variant/delete/:id")
    @Permission(Permissions.DeleteProduct)
    async productVariantDelete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.productService.productVariantDelete(id)
        res.json({ response })
    }
}
