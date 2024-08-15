import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import {
  buildMeta,
  extractUserData,
  getPaginationOptions,
} from 'src/util/dbHelper';
import { IUpdateUser } from './interface';
import { UserRepository } from './user.repository';
import { ERRORS, MESSAGES } from 'src/shared/language/en';
import { PaginationQuery } from 'src/shared/interface';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async fetchAll(query: PaginationQuery) {
    const { page, size } = query;

    const paginationOption = getPaginationOptions({ page, size });

    const dataPromise = this.userRepository.fetchAll(paginationOption);
    const totalCountPromise = this.userRepository.countAll();

    const [data, totalCount] = await Promise.all([
      dataPromise,
      totalCountPromise,
    ]);

    const total = totalCount;
    const meta = buildMeta(total, size, page);

    return { data, meta };
  }

  async fetchMyDetails(id: number) {
    const user = await this.userRepository.fetchMyDetails(id);

    const filteredUser = extractUserData(user);

    return filteredUser;
  }

  async fetchById(id: number) {
    const user = await this.userRepository.fetchById(id);

    if (!user) {
      throw new NotFoundException(ERRORS.USER_NOT_FOUND);
    }

    const filteredUser = extractUserData(user);

    return filteredUser;
  }

  async update(id: number, data: IUpdateUser) {
    try {
      await this.userRepository.update(id, data);

      return { message: MESSAGES.USER_UPDATE_SUCCESS };
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

  async delete(id: number) {
    try {
      await this.userRepository.delete(id);

      return { message: MESSAGES.USER_DELETE_SUCCESS };
    } catch (error) {
      throw error;
    }
  }
}
