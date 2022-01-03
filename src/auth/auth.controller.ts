import {
  Get,
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Login } from './dto/login.dto';
import { Register } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: Login, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token } = await this.service.login(
      data.email,
      data.password,
    );
    res.cookie('jwt-refresh', refresh_token, { httpOnly: true });
    return { access_token, refresh_token };
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() data: Register,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.service.register(data);
    res.cookie('jwt-refresh', refresh_token, { httpOnly: true });
    return { access_token, refresh_token };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refresh_token(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.service.refresh_token(
      req.cookies('jwt-refresh'),
    );
    res.cookie('jwt-refresh', refresh_token, { httpOnly: true });
    return { access_token, refresh_token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt-refresh');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/protected')
  @HttpCode(HttpStatus.OK)
  async protect() {
    return this.service.protect();
  }
}
