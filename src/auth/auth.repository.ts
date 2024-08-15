import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ILogin, ISignUp } from './interface';

@Injectable()
export class AuthRepository {
  constructor(private dbConn: DatabaseService) {}

  async login(data: ILogin) {
    return this.dbConn.user.findUnique({
      where: {
        email: data.email,
      },
    });
  }

  async signup(data: ISignUp) {
    return this.dbConn.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  }
}
