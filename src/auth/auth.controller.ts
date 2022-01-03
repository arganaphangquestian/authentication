import { Get, Controller, Post, Body, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  async login(
    @Body() email: string,
    @Body() password: string,
    @Res() response: Response,
  ) {
    const { access_token, refresh_token } = await this.service.login(
      email,
      password,
    );
    response.cookie('jwt-token', refresh_token, { httpOnly: true });
    return { access_token };
  }

  @Post('/register')
  async register(@Body() data: Prisma.UserCreateInput) {
    return await this.service.register(data);
  }

  @Get('/protected')
  async protect() {
    return await this.service.protect();
  }
}
