import serverConfig from 'src/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TOKEN_STRATEGY } from 'src/shared/constants/auth';
import { DatabaseService } from 'src/database/database.service';
import { ERRORS } from 'src/shared/language/en';
import { ITokenStrategy } from '../interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  TOKEN_STRATEGY.ACCESS,
) {
  constructor(private dbConn: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: serverConfig.accessTokenSecret,
    });
  }

  async validate(payload: ITokenStrategy) {
    const user = await this.dbConn.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) throw new ForbiddenException(ERRORS.INVALID_CREDENTIALS);

    return { id: user.id };
  }
}
