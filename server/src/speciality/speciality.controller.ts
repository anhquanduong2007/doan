import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res, Query, Req } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { SpecialityCreateDto, SpecialityUpdateDto } from './dto';
import { Response, Request } from 'express';
import { PaginationDto } from 'src/common/dto';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';

@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) { }

  @Post("create")
  @Permission(Permissions.CreateSpeciality)
  async createSpeciality(@Req() req: Request, @Body() dto: SpecialityCreateDto, @Res() res: Response) {
    const userId = req.user['userId']
    const response = await this.specialityService.create(dto, userId)
    return res.json({ response })
  }

  @Delete("delete/:id")
  @Permission(Permissions.DeleteSpeciality)
  async deleteSpeciality(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = await this.specialityService.delete(id)
    return res.json({ response })
  }

  @Put("update/:id")
  @Permission(Permissions.UpdateSpeciality)
  async updateSpeciality(@Req() req: Request, @Body() dto: SpecialityUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const userId = req.user['userId']
    const response = await this.specialityService.update(dto, id, userId)
    return res.json({ response })
  }

  @Get()
  @Permission(Permissions.ReadSpeciality)
  async getSpecialitys(@Query() pagination: PaginationDto, @Res() res: Response) {
    const response = await this.specialityService.specialitys(pagination);
    return res.json({ response });
  }

  @Get(":id")
  @Permission(Permissions.ReadSpeciality)
  async getSpeciality(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = await this.specialityService.speciality(id)
    return res.json({ response })
  }
}
