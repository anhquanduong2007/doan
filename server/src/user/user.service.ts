import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignRolesToUserDto } from './dto';
import { IResponse } from 'src/common/types';
import { PaginationDto } from 'src/common/dto';
import { users } from '@prisma/client';
import { truncate } from 'lodash';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async assignRolesToUser(userId: number, input: AssignRolesToUserDto): Promise<IResponse<{}>> {
        try {
            const { role_ids } = input
            // Need check list role exsit here
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
                include: {
                    users_role: {
                        select: {
                            role_id: true
                        }
                    }
                }
            })
            if (user) {
                // ** Delete all roles of user before
                await this.prisma.users.update({
                    where: { id: userId },
                    data: {
                        users_role: {
                            deleteMany: user?.users_role.map((role) => {
                                return {
                                    role_id: role.role_id
                                }
                            })
                        }
                    }
                })
                // ** assign new roles for this user
                await this.prisma.users.update({
                    where: { id: userId },
                    data: {
                        users_role: {
                            createMany: {
                                data: role_ids.map((role_id) => {
                                    return {
                                        role_id
                                    }
                                })
                            }
                        }
                    }
                })
                return {
                    code: 200,
                    success: true,
                    message: 'Success!',
                }
            }
            return {
                code: 400,
                message: 'User does not exist in the system!',
                success: false,
            }
        } catch (error) {
            return {
                code: 500,
                message: "An error occurred in the system!",
                success: false,
            }
        }
    }

    // ** Administrators
    public async administrators(input: PaginationDto, userId: number): Promise<IResponse<{ administrators: Omit<users, "hashed_rt" | "password">[], totalPage: number, skip: number, take: number, total: number }>> {
        try {
            const { skip, take, search } = input;
            const customerRole = this.prisma.role.findUnique({
                where: { role_code: "customer" }
            })
            const [totalRecord, administrators] = await this.prisma.$transaction([
                this.prisma.users.count({
                    where: {
                        NOT: {
                            id: userId
                        },
                        users_role: {
                            none: {
                                role_id: (await customerRole).id
                            }
                        }
                    },
                }),
                this.prisma.users.findMany({
                    take: take || 10,
                    skip: skip || 0,
                    where: {
                        NOT: {
                            id: userId
                        },
                        users_role: {
                            none: {
                                role_id: (await customerRole).id
                            }
                        },

                    },
                    select: {
                        email: true,
                        id: true,
                        first_name: true,
                        last_name: true,
                        gender: true,
                        date_of_birth: true,
                        phone: true,
                        active: true,
                        created_date: true,
                        modified_date: true,
                        created_by: true,
                        modified_by: true
                    }
                }),
            ])
            return {
                code: 200,
                success: true,
                message: "Success!",
                data: {
                    administrators,
                    totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                    total: totalRecord,
                    skip: skip || 0,
                    take: take || 10
                }
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
