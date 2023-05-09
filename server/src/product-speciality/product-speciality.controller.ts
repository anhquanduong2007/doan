import { product_speciality } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query, Req } from '@nestjs/common';
import { ProductSpecialityService } from './product-speciality.service';
import { ProductSpecialityCreateDto, ProductSpecialityUpdateDto } from './dto';
import { Response, Request } from 'express';
import { PaginationDto } from 'src/common/dto';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';

@Controller('product-speciality')
export class ProductSpecialityController {
  constructor(private readonly productSpecialityService: ProductSpecialityService) { }

  @Post("create")
  @Permission(Permissions.CreateProductSpeciality)
  async createProductSpeciality(@Req() req: Request, @Body() dto: ProductSpecialityCreateDto, @Res() res: Response) {
    const response = await this.productSpecialityService.create(dto)
    return res.json({ response })
  }

  @Delete("delete/:id")
  @Permission(Permissions.DeleteProductSpeciality)
  async deleteProductSpeciality(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = await this.productSpecialityService.delete(id)
    return res.json({ response })
  }

  @Put("update/:id")
  @Permission(Permissions.UpdateProductSpeciality)
  async updateSpeciality(@Req() req: Request, @Body() dto: ProductSpecialityUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = await this.productSpecialityService.update(dto, id)
    return res.json({ response })
  }

  @Get()
  @Permission(Permissions.ReadProductSpeciality)
  async getProductSpecialities(@Query() pagination: PaginationDto, @Res() res: Response) {
    const response = await this.productSpecialityService.productSpecialities(pagination);
    return res.json({ response });
  }

  @Get(":productId")
  @Permission(Permissions.ReadProductSpeciality)
  async getProductSpeciality(@Param('productId', ParseIntPipe) productId: number, @Res() res: Response) {
    const response = await this.productSpecialityService.specialityByProduct(productId)
    return res.json({ response })
  }
}
