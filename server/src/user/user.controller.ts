import { Body, Controller, Get, Param, ParseIntPipe, Query, Res, Put } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AssignRolesToUserDto } from './dto';
import { PaginationDto } from 'src/common/dto';
import { Permissions } from 'src/constant';
import { Permission } from 'src/common/decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userAdminService: UserService) { }

    @Put('/assign-roles-to-user/:id')
    @Permission(Permissions.UpdateUser)
    async assignRolesToUser(@Body() dto: AssignRolesToUserDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.userAdminService.assignRolesToUser(id, dto);
        return res.json({ response });
    }

    @Get()
    @Permission(Permissions.ReadUser)
    async getList(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.userAdminService.users(pagination);
        return res.json({ response });
    }
}
