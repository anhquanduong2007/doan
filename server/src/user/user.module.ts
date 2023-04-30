import { Module } from '@nestjs/common';
import { UserAdminService } from './admin/user-admin.service';
import { UserAdminController } from './admin/user-admin.controller';

@Module({
  providers: [UserAdminService],
  controllers: [UserAdminController]
})
export class UserModule { }
