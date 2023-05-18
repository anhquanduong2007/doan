import { Controller, Post, Body, Res, Get, Put, Delete, Param, ParseIntPipe, Query, Req, OnApplicationBootstrap } from '@nestjs/common';
import { Permission } from 'src/common/decorator';
import { Permissions } from 'src/constant';
import { Response, Request } from 'express';
import { OrderService } from './order.service';
import { OrderConfirmRefund, OrderCreateDto } from './dto';
import { PaginationDto } from 'src/common/dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { fromString } from 'uuidv4';
const paypal = require('paypal-rest-sdk');



@Controller('order')
export class OrderController implements OnApplicationBootstrap {
    constructor(
        private readonly orderService: OrderService,
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) { }

    async onApplicationBootstrap() {
        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': this.config.get('PAYPAL_CLIENT_ID'),
            'client_secret': this.config.get('PAYPAL_SECRET_KEY')
        });
    }

    @Get('history/:id')
    @Permission(Permissions.ReadOrder)
    async getOrderHistory(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.getOrderHistory(id);
        return res.json({ response });
    }

    @Get('/success')
    async paymentSuccess(@Req() req: Request, @Res() res: Response) {
        try {
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;
            const order = await this.prisma.order.update({
                where: { payment_id: paymentId as string },
                data: {
                    payer_id: payerId as string
                }
            })
            const variant = await this.prisma.product_variant.findUnique({ where: { id: order.product_variant_id } })
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": `${order.total_price.toLocaleString('en-US',
                            { style: 'currency', currency: 'USD' }
                        ).substring(1)}`
                    }
                }]
            };
            paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
                if (error) {
                    throw error;
                } else {
                    await Promise.all([
                        await this.prisma.order.update({
                            where: { id: order.id },
                            data: {
                                payment: true
                            }
                        }),
                        await this.prisma.order_history.create({
                            data: {
                                order_id: order.id,
                                content: "Order has been created"
                            }
                        }),
                        await this.prisma.product_variant.update({
                            where: { id: variant.id },
                            data: {
                                stock: variant.stock - 1
                            }
                        })
                    ])
                    return res.redirect('http://localhost:4201/');
                }
            });
        } catch (error) {
            return res.json({
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            })
        }
    }

    @Get('/cancel')
    async paymentFailed(@Res() res: Response) {
        return res.json({
            code: 400,
            success: false,
            message: 'Payment failed!',
        });
    }

    @Post('payment')
    @Permission(Permissions.CreateOrder)
    async payment(@Req() req: Request, @Body() dto: OrderCreateDto, @Res() res: Response) {
        try {
            const userId = req.user['userId']
            const { address_id, payment_method, product_variant_id, promotion_id, quantity } = dto
            if (payment_method !== PaymentMethod.Card) {
                return res.json({
                    code: 400,
                    message: "Cannot use this payment method!",
                    success: false,
                })
            }
            const [isValidAddress, isValidProductVariant, isValidPromotion] = await Promise.all([
                this.prisma.address.findFirst({ where: { id: address_id, users_id: userId } }),
                this.prisma.product_variant.findUnique({ where: { id: product_variant_id } }),
                ...promotion_id ? [this.prisma.promotion.findUnique({ where: { id: promotion_id } })] : []
            ])
            if (!isValidAddress) {
                return res.json({
                    code: 404,
                    message: 'Address does not exist in this customer!',
                    success: false,
                })
            }
            if (!isValidProductVariant) {
                return res.json({
                    code: 404,
                    message: 'Product variant does not exist in this customer!',
                    success: false,
                })
            }
            if (promotion_id) {
                if (!isValidPromotion) {
                    return res.json({
                        code: 404,
                        message: 'Promotion does not exist in the system!',
                        success: false,
                    })
                }
            }
            if (promotion_id) {
                if (!isValidPromotion) {
                    return res.json({
                        code: 404,
                        message: 'Promotion does not exist in the system!',
                        success: false,
                    })
                }
            }
            let price: number = 0
            if (promotion_id) {
                price = isValidProductVariant.price * quantity * ((100 - isValidPromotion.discount) / 100)
            } else {
                price = isValidProductVariant.price * quantity
            }
            const create_payment_json = {
                "intent": "authorize",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:1234/order/success",
                    "cancel_url": "http://localhost:1234/order/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": isValidProductVariant.name,
                            "sku": isValidProductVariant.sku,
                            "price": `${price.toLocaleString('en-US',
                                { style: 'currency', currency: 'USD' }
                            ).substring(1)}`,
                            "currency": "USD",
                            "quantity": 1,

                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": `${price.toLocaleString('en-US',
                            { style: 'currency', currency: 'USD' }
                        ).substring(1)}`
                    },
                    "description": isValidProductVariant.name
                }]
            };
            paypal.payment.create(create_payment_json, async (error, payment) => {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            await this.prisma.order.create({
                                data: {
                                    payment_method,
                                    quantity,
                                    status: OrderStatus.Open,
                                    address_id,
                                    ...promotion_id && { promotion_id },
                                    code: fromString(`${userId} ${Date.now()}`),
                                    users_id: userId,
                                    total_price: price,
                                    product_variant_id,
                                    payment_id: payment.id
                                }
                            })
                            return res.json({ paymentUrl: payment.links[i].href })
                        }
                    }
                }
            });
        } catch (error) {
            return res.json({
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            })
        }
    }

    @Put('cancel/:id')
    @Permission(Permissions.UpdateOrder)
    async cancelOrder(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.cancel(id);
        return res.json({ response });
    }

    @Put('confirm/:id')
    @Permission(Permissions.UpdateOrder)
    async confirmOrder(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.confirm(id);
        return res.json({ response });
    }

    @Put('shipped/:id')
    @Permission(Permissions.UpdateOrder)
    async shippedOrder(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.shipped(id);
        return res.json({ response });
    }

    @Put('completed/:id')
    @Permission(Permissions.UpdateOrder)
    async completedOrder(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.completed(id);
        return res.json({ response });
    }

    @Put('refund/:id')
    @Permission(Permissions.UpdateOrder)
    async refundOrder(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.refund(id);
        return res.json({ response });
    }

    @Post('/create')
    @Permission(Permissions.CreateOrder)
    async create(@Req() req: Request, @Body() dto: OrderCreateDto, @Res() res: Response) {
        const userId = req.user['userId']
        const response = await this.orderService.create(dto, userId);
        return res.json({ response });
    }

    @Get(':id')
    @Permission(Permissions.ReadOrder)
    async getOrder(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.order(id);
        return res.json({ response });
    }

    @Delete('/delete/:id')
    @Permission(Permissions.DeleteOrder)
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const response = await this.orderService.delete(id);
        return res.json({ response });
    }

    @Get()
    @Permission(Permissions.ReadOrder)
    async getOrders(@Query() pagination: PaginationDto, @Res() res: Response) {
        const response = await this.orderService.orders(pagination);
        return res.json({ response });
    }
}
