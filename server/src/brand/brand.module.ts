import { Module } from '@nestjs/common';
import { BrandController as BrandAdminController } from './admin/brand.controller';
import { BrandService as BrandAdminService } from './admin/brand.service';

@Module({
  controllers: [BrandAdminController],
  providers: [BrandAdminService]
})
export class BrandModule { }
