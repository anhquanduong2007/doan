import { Body, Controller, Get, Param, ParseIntPipe, Query, Res, Put, Req, Delete } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { AssignRolesToUserDto, UserUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dto';
import { Permissions } from 'src/constant';
import { Permission } from 'src/common/decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userAdminService: UserService) { }

    @Put('/assign-roles-to-user/:id')
    @Permission(Permissions.UpdateAdministrator)
    async assignRolesToUser(@Body() dto: AssignRolesToUserDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.userAdminService.assignRolesToUser(id, dto);
        return res.json({ response });
    }

    @Get('administrators')
    @Permission(Permissions.ReadAdministrator)
    async administrators(@Req() req: Request, @Query() pagination: PaginationDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.userAdminService.administrators(pagination, userId);
        return res.json({ response });
    }

    @Delete('administrator/delete/:id')
    @Permission(Permissions.DeleteAdministrator)
    async deleteAdministrator(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.userAdminService.deleteAdministrator(id);
        return res.json({ response });
    }

    @Get('administrator/:id')
    @Permission(Permissions.DeleteAdministrator)
    async getAdministrator(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.userAdminService.administrator(id);
        return res.json({ response });
    }

    @Put('administrator/update/:id')
    @Permission(Permissions.UpdateAdministrator)
    async updateAdministrator(@Body() dto: UserUpdateDto, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.userAdminService.updateAdministrator(id, dto);
        return res.json({ response });
    }

}
