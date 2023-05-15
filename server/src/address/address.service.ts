import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressCreateDto } from './dto';
import { IResponse } from 'src/common/types';
import { address } from '@prisma/client';

@Injectable()
export class AddressService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async create(input: AddressCreateDto): Promise<IResponse<address>> {
        try {
            const { city, country, default_shipping_address, postal_code, province, street_line_1, street_line_2 ,customer_id} = input
            return {
                code: 200,
                success: true,
                message: "Successfully!",
                data: await this.prisma.address.create({
                    data: {
                        city,
                        country,
                        default_shipping_address,
                        postal_code,
                        province,
                        street_line_1,
                        street_line_2,
                        users_id: customer_id
                    }
                })
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }
}
