import { Controller, Post, Body, Res, Get, Req, UsePipes, UseGuards } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { Response, Request } from 'express';
import { LoginDto, RegisterAdminDto } from '../dto';
import { AccessTokenGuard } from 'src/common/guard';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';

@Controller('admin/auth')
export class AuthAdminController {
    constructor(private readonly authService: AuthAdminService) { }

    @Post('/register')
    async createUser(@Body() dto: RegisterAdminDto, @Res() res: Response) {
        const response = await this.authService.register(dto);
        return res.json({ response });
    }

    @Post('/login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const response = await this.authService.login(dto);
        return res.json({ response });
    }

    @Get('logout')
    @Permission()
    async logout(@Req() req: Request, @Res() res: Response) {
        // console.log(req.user)
        // console.log(req.user['userId'])
        // await this.authService.logout(req.user['userId']);
        return {
            "hi": "hi"
        }
    }
}
