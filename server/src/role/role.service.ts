import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateRoleDto } from './dto/createRoleDto';
import { IResponse } from 'types';
import { Role } from '@prisma/client';
import { UpdateRoleDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class RoleService {
    constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) { }

    public async create(input: CreateRoleDto): Promise<IResponse<Role>> {
        const { code, description, permissions } = input;
        const isCodeExist = await this.prisma.role.findUnique({
            where: { code },
        });
        if (isCodeExist) {
            return {
                code: 400,
                success: false,
                message: 'Code already exist!',
                fieldError: 'code',
            };
        }
        const newRole = await this.prisma.role.create({
            data: {
                code,
                description,
                permissions
            },
        });
        return {
            code: 200,
            success: true,
            message: 'Success!',
            data: newRole
        }
    }

    public async delete(id: number) {
        const role = await this.prisma.role.findUnique({
            where: { id }
        })
        if (role) {
            const roleDelete = await this.prisma.role.delete({ where: { id } })
            return {
                code: 200,
                message: 'Delete successfully!',
                success: true,
                data: roleDelete
            }

        }
        return {
            code: 400,
            message: 'Role does not exist in the system!',
            success: false,
        }
    }

    public async getRole(id: number) {
        const role = await this.prisma.role.findUnique({
            where: { id }
        })
        if (role) {
            return {
                code: 200,
                message: 'Success',
                success: true,
                data: role
            }
        }
        return {
            code: 400,
            message: 'Role does not exist in the system!',
            success: false,
        }
    }

    public async getRoles(input: PaginationDto): Promise<IResponse<{ roles: Role[], totalPage: number, skip: number, take: number, total: number }>> {
        const { skip, take } = input;
        const [totalRecord, roles] = await this.prisma.$transaction([
            this.prisma.role.count(),
            this.prisma.role.findMany({
                take: take || 10,
                skip: skip || 0,
            }),
        ])
        return {
            code: 200,
            success: true,
            message: "Success!",
            data: {
                roles,
                totalPage: take ? Math.ceil(totalRecord / take) : Math.ceil(totalRecord / 10),
                total: totalRecord,
                skip: skip || 0,
                take: take || 10
            }
        }
    }

    public async update(id: number, input: UpdateRoleDto) {
        const { code, description, permissions } = input;
        const role = await this.prisma.role.findUnique({
            where: { id }
        })
        if (role) {
            const isCodeExist = await this.prisma.role.findFirst({
                where: {
                    AND: [
                        { code },
                        {
                            NOT: [
                                { id }
                            ]
                        }
                    ]
                },
            })
            if (isCodeExist) {
                return {
                    code: 400,
                    success: false,
                    message: 'Code already exist!',
                    fieldError: 'code',
                }
            }
            const roleUpdate = await this.prisma.role.update({
                where: { id },
                data: {
                    ...code && { code },
                    ...description && { description },
                    ...permissions && { permissions }
                },
            })
            return {
                code: 200,
                success: true,
                message: 'Success!',
                data: roleUpdate
            }
        }
        return {
            code: 400,
            message: 'Role does not exist in the system!',
            success: false,
        }
    }
}
