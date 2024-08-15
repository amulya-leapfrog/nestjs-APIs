import serverConfig from 'src/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TOKEN_STRATEGY } from 'src/shared/constants/auth';
import { ITokenStrategy } from '../interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  TOKEN_STRATEGY.REFRESH,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: serverConfig.refreshTokenSecret,
    });
  }

  async validate(payload: ITokenStrategy) {
    return payload;
  }
}
