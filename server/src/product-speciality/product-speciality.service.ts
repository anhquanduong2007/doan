import { Injectable } from '@nestjs/common';
import { product_speciality } from '@prisma/client';
import { IResponse } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductSpecialityCreateDto, ProductSpecialityUpdateDto } from './dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductSpecialityService {
  constructor(private readonly prisma: PrismaService) { }

  async create(input: ProductSpecialityCreateDto): Promise<IResponse<product_speciality>> {
    try {
      const { speciality_id, product_id } = input

      const data = {
        speciality_id,
        product_id,
      }

      return {
        code: 200,
        message: 'Success',
        success: true,
        data: await this.prisma.product_speciality.create({ data })
      }
    } catch (error) {
      return {
        code: 500,
        message: "An error occurred in the system!",
        success: false,
      }
    }
  }

  async delete(id: number): Promise<IResponse<product_speciality>> {
    try {
      const productSpeciality = await this.prisma.product_speciality.findUnique({
        where: { id },
        include: {
          product: true,
          speciality: true
        }
      })

      if (productSpeciality) {
        return {
          code: 200,
          message: 'Success',
          success: true,
          data: await this.prisma.product_speciality.delete({
            where: { id }
          })
        }
      }
      return {
        code: 404,
        message: 'Product speciality does not exist in the system!',
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

  async specialityByProduct(productId: number): Promise<IResponse<{ productSpecialities: product_speciality[] }>> {
    try {
      const productSpecialities = await this.prisma.product_speciality.findMany({
        where: {
          product_id: productId
        },
        include: {
          product: true,
          speciality: true
        }
      })
      console.log(productSpecialities)
      if (productSpecialities) {
        return {
          code: 200,
          message: 'Success',
          success: true,
          data: {
            productSpecialities
          }
        }
      }
      return {
        code: 404,
        message: 'Product Speciality does not exist in the system!',
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

  async productSpecialities(input: PaginationDto): Promise<IResponse<{ productSpecialities: product_speciality[], totalPage: number, skip: number, take: number, total: number }>> {
    try {
      const { skip, take } = input;

      const [totalRecord, productSpecialities] = await this.prisma.$transaction([
        this.prisma.product_speciality.count(),
        this.prisma.product_speciality.findMany({
          take: take || 10,
          skip: skip || 0,
          include: {
            product: true,
            speciality: true
          }
        }),
      ])
      return {
        code: 200,
        success: true,
        message: "Success!",
        data: {
          productSpecialities,
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

  async update(input: ProductSpecialityUpdateDto, id: number): Promise<IResponse<product_speciality>> {
    try {
      const { speciality_id, product_id } = input

      const productSpeciality = await this.prisma.product_speciality.findUnique({
        where: { id }
      })

      if (productSpeciality) {
        const data = {
          product_id,
          speciality_id
        }

        return {
          code: 200,
          message: 'Success',
          success: true,
          data: await this.prisma.product_speciality.update({
            where: { id },
            data
          })
        }
      }

      return {
        code: 404,
        message: 'Product Speciality does not exist in the system!',
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
