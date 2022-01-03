import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { Token } from './dto/token.dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    return await this.generate_token(user);
  }

  async register(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
      data,
    });
    return await this.generate_token(user);
  }

  async protect() {
    return { message: 'Success' };
  }

  private async generate_token(user: User): Promise<Token> {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload),
    };
  }
}
