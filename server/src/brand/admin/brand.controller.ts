import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandCreateDto } from '../dto';
import { Response } from 'express';
import { BrandEditDto } from '../dto/brandEdit.dto';
import { PaginationDto } from 'src/common/dto';

@Controller('admin/brand')
export class BrandController {
    constructor(
        private readonly brandService: BrandService
    ) { }

    @Post("create")
    async createBrand(@Body() dto: BrandCreateDto, @Res() res: Response) {
        const response = await this.brandService.create(dto)
        res.json({ response })
    }

    @Get(":id")
    async getBrand(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.brandService.brand(id)
        res.json({ response })
    }

    @Delete("delete/:id")
    async deleteBrand(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.brandService.delete(id)
        res.json({ response })
    }

    @Put("edit/:id")
    async editBrand(@Body() dto: BrandEditDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.brandService.edit(dto, id)
        res.json({ response })
    }

    @Get()
    async getBrands(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.brandService.brands(pagination);
        return res.json({ response });
    }

}
