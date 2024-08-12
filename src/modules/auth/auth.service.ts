import * as bcrypt from 'bcrypt';
import serverConfig from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_EXPIRY } from 'src/constants/auth';
import { PASSWORD_SALT } from 'src/constants/user';
import { ERRORS, MESSAGES } from 'src/language/en';
import { AuthRepository } from './auth.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ILogin, ISignUp } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async login(data: ILogin) {
    const user = await this.authRepository.login(data);

    if (!user) {
      throw new ForbiddenException(ERRORS.INVALID_CREDENTIALS);
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch) {
      throw new ForbiddenException(ERRORS.INVALID_CREDENTIALS);
    }

    const accessToken = this.accessToken(user.id);
    const refreshToken = this.refreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async signup(data: ISignUp) {
    try {
      const salt = await bcrypt.genSalt(PASSWORD_SALT);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      await this.authRepository.signup({ ...data, password: hashedPassword });

      return { message: MESSAGES.SIGNUP_SUCCESS };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002' // prisma code for unique constraint error
      ) {
        throw new ForbiddenException(ERRORS.EMAIL_TAKEN);
      }
      throw error;
    }
  }

  accessToken(id: number) {
    const accessToken = this.jwtService.sign(
      { id },
      {
        // expiresIn: TOKEN_EXPIRY.ACCESS,
        secret: serverConfig.accessTokenSecret,
      },
    );

    return accessToken;
  }

  refreshToken(id: number) {
    const refreshToken = this.jwtService.sign(
      { id },
      {
        // expiresIn: TOKEN_EXPIRY.REFRESH,
        secret: serverConfig.refreshTokenSecret,
      },
    );

    return refreshToken;
  }
}
