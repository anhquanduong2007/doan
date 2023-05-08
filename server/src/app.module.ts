import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guard';
import { BrandModule } from './brand/brand.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CampaignModule } from './campaign/campaign.module';
import { CategoryModule } from './category/category.module';
import { AssetModule } from './asset/asset.module';
import { ProductModule } from './product/product.module';
import { AppService } from './app.service';
import { RateModule } from './rate/rate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrismaModule,
    CloudinaryModule,
    BrandModule,
    RoleModule,
    AuthModule,
    UserModule,
    CampaignModule,
    CategoryModule,
    AssetModule,
    ProductModule,
    RateModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    AppService,
    Logger
  ],
})
export class AppModule { }
