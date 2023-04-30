import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { Response } from 'express';
import { AssignRolesToUserAdminDto } from '../dto';
import { PaginationDto } from 'src/common/dto';
import { Permissions } from 'src/constant';
import { Permission } from 'src/common/decorator';

@Controller('admin/user')
export class UserAdminController {
    constructor(private readonly userAdminService: UserAdminService) { }

    @Post('/assign-roles-to-user/:id')
    @Permission(Permissions.UpdateAdministrator)
    async createUser(@Body() dto: AssignRolesToUserAdminDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.userAdminService.assignRolesToUser(id, dto);
        return res.json({ response });
    }

    @Get('/list')
    @Permission(Permissions.ReadAdministrator)
    async getList(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.userAdminService.getUsers(pagination);
        return res.json({ response });
    }
}
