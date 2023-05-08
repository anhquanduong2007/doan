import { Injectable } from '@nestjs/common';
import { speciality } from '@prisma/client';
import { IResponse } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpecialityCreateDto, SpecialityUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class SpecialityService {
  constructor(private readonly prisma: PrismaService) { }

  async create(input: SpecialityCreateDto, userId: number): Promise<IResponse<speciality>> {
    try {
      const { type_code, type_name, type_number, type, description, position, active } = input

      const data = {
        type_code,
        type_name,
        type_number,
        type,
        description,
        position,
        active,
        created_by: userId,
        modified_by: userId,
      }

      return {
        code: 200,
        message: 'Success',
        success: true,
        data: await this.prisma.speciality.create({ data })
      }
    } catch (error) {
      return {
        code: 500,
        message: "An error occurred in the system!",
        success: false,
      }
    }
  }

  async delete(id: number): Promise<IResponse<speciality>> {
    try {
      const speciality = await this.prisma.speciality.findUnique({
        where: { id }
      })

      if (speciality) {
        return {
          code: 200,
          message: 'Success',
          success: true,
          data: await this.prisma.speciality.delete({
            where: { id }
          })
        }
      }
      return {
        code: 404,
        message: 'Speciality does not exist in the system!',
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

  async speciality(id: number): Promise<IResponse<speciality>> {
    try {
      const speciality = await this.prisma.speciality.findUnique({
        where: { id },
        include: {
          product_speciality: true
        }
      })
      if (speciality) {
        return {
          code: 200,
          message: 'Success',
          success: true,
          data: speciality
        }
      }
      return {
        code: 404,
        message: 'Speciality does not exist in the system!',
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

  async specialitys(input: PaginationDto): Promise<IResponse<{ specialitys: speciality[], totalPage: number, skip: number, take: number, total: number }>> {
    try {
      const { skip, take } = input;

      const [totalRecord, specialitys] = await this.prisma.$transaction([
        this.prisma.speciality.count(),
        this.prisma.speciality.findMany({
          take: take || 10,
          skip: skip || 0,
          include: {
            product_speciality: true
          }
        }),
      ])
      return {
        code: 200,
        success: true,
        message: "Success!",
        data: {
          specialitys,
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

  async update(input: SpecialityUpdateDto, id: number, userId: number): Promise<IResponse<speciality>> {
    try {
      const { type_code, type_name, type_number, type, description, position, active } = input

      const speciality = await this.prisma.speciality.findUnique({
        where: { id }
      })

      if (speciality) {
        const data = {
          type_code,
          type_name,
          type_number,
          type,
          description,
          position,
          active,
          created_by: userId,
          modified_by: userId,
        }

        return {
          code: 200,
          message: 'Success',
          success: true,
          data: await this.prisma.speciality.update({
            where: { id },
            data
          })
        }
      }

      return {
        code: 404,
        message: 'Speciality does not exist in the system!',
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

}
