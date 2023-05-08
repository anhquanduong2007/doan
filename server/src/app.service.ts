import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { superadminPermissions, userPermissions } from './constant';
import { role, users } from '@prisma/client';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger,
    ) { }

    async onApplicationBootstrap() {
        // ** ur - user role, sar - superadmin role
        // const [ur, sar, superadmin] = await Promise.all([
        //     this.prisma.role.findUnique({
        //         where: { role_code: "user" }
        //     }),
        //     this.prisma.role.findUnique({
        //         where: { role_code: "superadmin" }
        //     }),
        //     this.prisma.users.findUnique({
        //         where: { email: "superadmin@gmail.com" },
        //         include: {
        //             users_role: {
        //                 select: {
        //                     role_id: true
        //                 }
        //             }
        //         }
        //     })
        // ])
        // switch (true) {
        //     case !ur:
        //         await this.createUserRole(false)
        //         this.logger.log("Create user role successfully!")
        //         return;
        //     case !sar:
        //         const role = await this.createSuperadminRole(true)
        //         if (role) {
        //             this.logger.log("Create superadmin role successfully!")
        //             // if()
        //         }
        //         return;
        //     // case !ur && !sar:
        //     //     await Promise.all([this.createUserRole(false), this.createSuperadminRole(false)])
        //     //     console.log("Create user and superadmin role successfully!")
        //     //     return;
        //     default:
        //         return;
        // }
    }

    private async createUserRole(isReturn: boolean): Promise<void | role> {
        try {
            const role = await this.prisma.role.create({
                data: {
                    role_code: "user",
                    role_name: "user",
                    description: "user",
                    permissions: userPermissions
                }
            })
            if (isReturn) {
                return role
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async createSuperadminRole(isReturn: boolean): Promise<void | role> {
        try {
            const role = await this.prisma.role.create({
                data: {
                    role_code: "superadmin",
                    role_name: "superadmin",
                    description: "superadmin",
                    permissions: superadminPermissions
                }
            })
            if (isReturn) {
                return role
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async createSuperadmin(isReturn: boolean): Promise<void | users> {
        try {
            const user = await this.prisma.users.create({
                data: {
                    email: "superadmin@gmail.com",
                    password: "superadmin"
                }
            })
            if (isReturn) {
                return user
            }
        } catch (error) {
            console.log(error)
        }
    }
}
