import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'types';
import { AssignRolesToUserAdminDto } from '../dto';
import { PaginationDto } from 'src/common/dto';
import { User } from '@prisma/client';

@Injectable()
export class UserAdminService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async assignRolesToUser(userId: number, input: AssignRolesToUserAdminDto): Promise<IResponse<{}>> {
        const { role_ids } = input
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                user_on_role: {
                    select: {
                        role_id: true
                    }
                }
            }
        })
        if (user) {
            // ** Delete all roles of user before
            const a = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    user_on_role: {
                        deleteMany: user?.user_on_role.map((role) => {
                            return {
                                role_id: role.role_id
                            }
                        })
                    }
                }
            })
            // ** assign new roles for this user
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    user_on_role: {
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
    }

    public async getUsers(input: PaginationDto): Promise<IResponse<{ users: User[], totalPage: number, skip: number, take: number, total: number }>> {
        const { skip, take, search } = input;
        const [totalRecord, users] = await this.prisma.$transaction([
            this.prisma.user.count(),
            this.prisma.user.findMany({
                take: take || 10,
                skip: skip || 0,
            }),
        ])
        return {
            code: 200,
            success: true,
            message: "Success!",
            data: {
                users,
                totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                total: totalRecord,
                skip: skip || 0,
                take: take || 10
            }
        }
    }
}
