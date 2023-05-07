import { Controller, Post, Body, Res, Get, Req, UsePipes, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    @Permission(Permissions.CreateUser)
    async createUser(@Body() dto: RegisterDto, @Res() res: Response) {
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
        const response = await this.authService.logout(req.user['userId']);
        return res.json({ response });

    }
}
