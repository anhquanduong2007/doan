import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { ProductOptionService } from './service/product-option.service';
import { ProductVariantService } from './service/product-variant.service';
import { ProductOptionGroupService } from './service/product-option-group.service';

@Module({
  providers: [
    ProductService,
    ProductOptionGroupService,
    ProductVariantService,
    ProductOptionService
  ],
  controllers: [ProductController]
})
export class ProductModule { }
