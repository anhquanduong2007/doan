import { Module } from '@nestjs/common';
import { AuthAdminService } from './admin/auth-admin.service';
import { AuthAdminController } from './admin/auth-admin.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthAdminService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthAdminController],
})
export class AuthModule { }
