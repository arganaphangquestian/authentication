import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Payload } from '../types/payload';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET.split('').reverse().join('')}`,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: Payload) {
    const refresh_token = req.get('Authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      refresh_token,
    };
  }
}
