import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { ICreateBook } from './interface';
import { BookRepository } from './book.repository';
import { ERRORS, MESSAGES } from 'src/language/en';
import { PaginationQuery } from 'src/shared/interface';
import { buildMeta, getPaginationOptions } from 'src/util/dbHelper';

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async fetchAll(query: PaginationQuery) {
    const { page, size } = query;

    const paginationOption = getPaginationOptions({ page, size });

    const dataPromise = this.bookRepository.fetchAll(paginationOption);
    const totalCountPromise = this.bookRepository.countAll();

    const [data, totalCount] = await Promise.all([
      dataPromise,
      totalCountPromise,
    ]);

    const total = totalCount;
    const meta = buildMeta(total, size, page);

    return { data, meta };
  }

  async fetchById(bookId:number){
    const book = await this.bookRepository.fetchById(bookId);

    if (!book) {
      throw new NotFoundException(ERRORS.BOOK_NOT_FOUND);
    }

    return book;
  }

  async fetchMyBooks(authorId: number, query: PaginationQuery) {
    const { page, size } = query;

    const paginationOption = getPaginationOptions({ page, size });

    const dataPromise = this.bookRepository.fetchMyBooks(
      paginationOption,
      authorId,
    );
    const totalCountPromise = this.bookRepository.countMyBooks(authorId);

    const [data, totalCount] = await Promise.all([
      dataPromise,
      totalCountPromise,
    ]);

    const total = totalCount;
    const meta = buildMeta(total, size, page);

    return { data, meta };
  }

  async create(authorId: number, data: ICreateBook) {
    try {
      await this.bookRepository.create(authorId, data);
      
      return { message: MESSAGES.BOOK_CREATE_SUCCESS };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003' // prisma code for foreign key constraint error
      ) {
        throw new ConflictException(ERRORS.INVALID_AUTHOR);
      }

      throw error;
    }
  }

  async update(authorId: number, bookId: number, data: ICreateBook) {
    try {
      await this.bookRepository.update(authorId, bookId, data);
      
      return { message: MESSAGES.BOOK_UPDATE_SUCCESS };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025' // prisma code for record not found (authorId mismatch)
      ) {
        throw new NotFoundException(ERRORS.BOOK_NOT_FOUND);
      }
      
      throw error;
    }
  }

  async delete(authorId: number, bookId: number) {
    try {
      await this.bookRepository.delete(authorId, bookId);
      
      return { message: MESSAGES.BOOK_DELETE_SUCCESS };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025' // prisma code for record not found (authorId mismatch)
      ) {
        throw new NotFoundException(ERRORS.BOOK_NOT_FOUND);
      }
      
      throw error;
    }
  }
}
