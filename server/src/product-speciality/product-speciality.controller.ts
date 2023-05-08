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

  // @Delete("delete/:id")
  // @Permission(Permissions.DeleteSpeciality)
  // async deleteSpeciality(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
  //   const response = await this.specialityService.delete(id)
  //   return res.json({ response })
  // }

  // @Put("update/:id")
  // @Permission(Permissions.UpdateSpeciality)
  // async updateSpeciality(@Req() req: Request, @Body() dto: SpecialityUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
  //   const userId = req.user['userId']
  //   const response = await this.specialityService.update(dto, id, userId)
  //   return res.json({ response })
  // }

  @Get()
  @Permission(Permissions.ReadProductSpeciality)
  async getProductSpecialitys(@Query() pagination: PaginationDto, @Res() res: Response) {
    const response = await this.productSpecialityService.productSpecialitys(pagination);
    return res.json({ response });
  }

  // @Get(":id")
  // @Permission(Permissions.ReadSpeciality)
  // async getSpeciality(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
  //   const response = await this.specialityService.speciality(id)
  //   return res.json({ response })
  // }
}
