import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class UserService {
  constructor(private dbConn: DatabaseService) {}

  fetchAll() {
    return 'All users';
  }

  fetchMyDetails() {
    return 'My details';
  }

  fetchById(id: number) {
    return `Id user: ${id}`;
  }

  update() {
    return 'Update user';
  }

  delete() {
    return 'Delete user';
  }
}
