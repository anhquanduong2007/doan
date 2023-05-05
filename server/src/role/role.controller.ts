import { Controller, Post, Body, Res, Get, Req, Put, Delete, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Response, Request } from 'express';
import { PaginationDto } from 'src/common/dto';

@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Post('/create')
    async create(@Body() dto: CreateRoleDto, @Res() res: Response) {
        const response = await this.roleService.create(dto);
        return res.json({ response });
    }

    @Delete('/delete/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.roleService.delete(id);
        return res.json({ response });
    }

    @Get(':id')
    async getRole(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.roleService.role(id);
        return res.json({ response });
    }

    @Get('')
    async getRoles(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.roleService.roles(pagination);
        return res.json({ response });
    }

    @Put('/update/:id')
    async update(@Body() dto: UpdateRoleDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.roleService.update(id, dto);
        return res.json({ response });
    }

}
