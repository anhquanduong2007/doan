import { Controller, Post, Body, Res, Get, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('admin')
export class AuthAdminController {
  constructor() { }

  @Post('/create')
  async createAdministrator(@Body() dto: RegisterDto, @Res() res: Response) {
    const response = await this.authService.registerAdministrator(dto);
    return res.json({ response });
  }
}
