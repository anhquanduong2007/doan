import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterAdminDto } from '../dto';
import { IResponse } from 'types';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) { }

  public async login(input: LoginDto): Promise<IResponse<User>> {
    const { email, password } = input;
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    })
    if (!user) {
      return {
        code: 400,
        success: false,
        message: 'Wrong email!',
        fieldError: 'email'
      }
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return {
        code: 400,
        success: false,
        message: 'Wrong password!',
        fieldError: 'password'
      }
    }
    const tokens = await this.getTokens(user.id, user.email);
    return {
      code: 200,
      success: true,
      message: 'Success!',
      ...tokens,
    };
  }

  public async register(input: RegisterAdminDto): Promise<IResponse<User>> {
    const {
      active,
      address,
      email,
      first_name,
      gender,
      last_name,
      password,
      phone,
    } = input;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        code: 400,
        success: false,
        message: 'Duplicated email!',
        fieldError: 'email',
      };
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        ...(address && { address }),
        ...(phone && { phone }),
        first_name: first_name,
        ...(gender && { gender }),
        last_name: last_name,
        password: hashedPassword,
        active: active ? active : true,
      },
    });
    delete newUser.password
    await this.prisma.refreshToken.create({
      data: {
        token: '',
        user_id: newUser.id
      }
    })
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return {
      code: 200,
      success: true,
      message: 'Success!',
      ...tokens,
      data: newUser
    }
  }

  public async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: this.config.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  public async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prisma.refreshToken.update({
      where: { user_id: userId },
      data: {
        token: hashedRefreshToken
      }
    })
  }

  public async logout(userId: any) {
    await this.prisma.refreshToken.update({
      where: { user_id: userId },
      data: {
        token: null
      }
    })
  }
}
