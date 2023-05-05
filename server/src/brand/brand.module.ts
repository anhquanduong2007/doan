import { Module } from '@nestjs/common';
import { BrandController as BrandAdminController } from './brand.controller';
import { BrandService as BrandAdminService } from './brand.service';

@Module({
  controllers: [BrandAdminController],
  providers: [BrandAdminService]
})
export class BrandModule { }
