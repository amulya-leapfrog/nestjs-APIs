import { Injectable } from '@nestjs/common';

import { IUpdateUser } from './interface';
import { Pagination } from 'src/shared/interface';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserRepository {
  constructor(private dbConn: DatabaseService) {}

  fetchAll(pagination: Pagination) {
    return this.dbConn.user.findMany({
      take: pagination.limit,
      skip: pagination.offset,
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  countAll() {
    return this.dbConn.user.count();
  }

  fetchMyDetails(id: number) {
    return this.dbConn.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  fetchById(id: number) {
    return this.dbConn.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  fetchByEmail(email: string) {
    return this.dbConn.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  update(id: number, data: IUpdateUser) {
    return this.dbConn.user.update({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      where: {
        id: id,
      },
    });
  }

  delete(id: number) {
    return this.dbConn.user.delete({
      where: {
        id: id,
      },
    });
  }
}
