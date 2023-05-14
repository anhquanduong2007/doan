import { Body, Controller, Get, Param, ParseIntPipe, Query, Res, Put, Req } from '@nestjs/common';
import { Response, Request } from 'express';
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

    @Get('administrators')
    @Permission(Permissions.ReadUser)
    async administrators(@Req() req: Request, @Query() pagination: PaginationDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.userAdminService.administrators(pagination, userId);
        return res.json({ response });
    }

}
