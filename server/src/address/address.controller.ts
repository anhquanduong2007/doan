import { Body, Controller, Get, Param, ParseIntPipe, Query, Res, Put, Req, Delete, Post } from '@nestjs/common';
import { Response, Request } from 'express';
import { AddressService } from './address.service';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { AddressCreateDto } from './dto';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post('/create')
    @Permission(Permissions.UpdateCustomer)
    async create(@Body() dto: AddressCreateDto, @Res() res: Response) {
        const response = await this.addressService.create(dto);
        return res.json({ response });
    }
}
