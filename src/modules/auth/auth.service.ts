import * as bcrypt from 'bcrypt';
import serverConfig from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { TOKEN_EXPIRY } from 'src/constants/auth';
import { PASSWORD_SALT } from 'src/constants/user';
import { ERRORS, MESSAGES } from 'src/language/en';
import { DatabaseService } from '../database/database.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
  constructor(
    private dbConn: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.dbConn.user.findUnique({
      where: {
        email: data.email,
      },
    });

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

  async signup(data: SignUpDto) {
    try {
      const salt = await bcrypt.genSalt(PASSWORD_SALT);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      await this.dbConn.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      return { message: MESSAGES.SIGNUP_SUCCESS };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
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
