import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { Token } from './types/token';
import { compareSync, hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './types/payload';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException();
    }
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    return this.generate_token(user);
  }

  async register(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashSync(data.password),
      },
    });
    return this.generate_token(user);
  }

  async refresh_token(email: string): Promise<Token> {
    console.log(email);
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new ForbiddenException();
    }
    return this.generate_token(user);
  }

  async protect() {
    return { message: 'Success' };
  }

  private generate_token(user: User): Token {
    const payload: Payload = { id: `${user.id}`, email: user.email };
    const token = {
      access_token: this.jwtService.sign(payload, {
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: 60 * 15, // 15 Menit
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: `${process.env.JWT_SECRET.split('').reverse().join('')}`,
        expiresIn: '1y', // 1 Tahun
      }),
    };
    return token;
  }
}
