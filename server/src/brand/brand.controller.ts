import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query, Req } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandCreateDto } from './dto';
import { Response, Request } from 'express';
import { BrandUpdateDto } from './dto/brandUpdate.dto';
import { PaginationDto } from 'src/common/dto';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';

@Controller('brand')
export class BrandController {
    constructor(
        private readonly brandService: BrandService
    ) { }

    @Post("create")
    @Permission(Permissions.CreateBrand)
    async createBrand(@Req() req: Request, @Body() dto: BrandCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.brandService.create(dto, userId)
        res.json({ response })
    }

    @Get(":id")
    @Permission(Permissions.ReadBrand)
    async getBrand(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.brandService.brand(id)
        res.json({ response })
    }

    @Delete("delete/:id")
    @Permission(Permissions.DeleteBrand)
    async deleteBrand(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.brandService.delete(id)
        res.json({ response })
    }

    @Put("update/:id")
    @Permission(Permissions.UpdateBrand)
    async editBrand(@Req() req: Request, @Body() dto: BrandUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.brandService.update(dto, id, userId)
        res.json({ response })
    }

    @Get()
    @Permission(Permissions.ReadBrand)
    async getBrands(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.brandService.brands(pagination);
        return res.json({ response });
    }
}
