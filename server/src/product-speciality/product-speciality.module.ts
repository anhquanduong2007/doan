import { ProductSpecialityController } from './product-speciality.controller';
import { ProductSpecialityService } from './product-speciality.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ProductSpecialityController],
  providers: [ProductSpecialityService]
})
export class ProductSpecialityModule { }
