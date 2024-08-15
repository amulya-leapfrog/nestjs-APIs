import { Injectable } from '@nestjs/common';

import { Pagination } from 'src/shared/interface';
import { ICreateBook, IUpdateBook } from './interface';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookRepository {
  constructor(private dbConn: DatabaseService) {}

  fetchAll(pagination: Pagination) {
    return this.dbConn.book.findMany({
      take: pagination.limit,
      skip: pagination.offset,
      select: {
        id: true,
        title: true,
        description: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  countAll() {
    return this.dbConn.book.count();
  }

  fetchById(bookId: number) {
    return this.dbConn.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  fetchMyBooks(pagination: Pagination, authorId: number) {
    return this.dbConn.book.findMany({
      take: pagination.limit,
      skip: pagination.offset,
      where: {
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    });
  }

  countMyBooks(authorId: number) {
    return this.dbConn.book.count({
      where: {
        authorId: authorId,
      },
    });
  }

  create(authorId: number, data: ICreateBook) {
    return this.dbConn.book.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: authorId,
      },
    });
  }

  update(authorId: number, bookId: number, data: IUpdateBook) {
    return this.dbConn.book.update({
      data: {
        title: data.title,
        description: data.description,
      },
      where: {
        id: bookId,
        authorId: authorId,
      },
    });
  }

  delete(authorId: number, bookId: number) {
    return this.dbConn.book.delete({
      where: {
        id: bookId,
        authorId: authorId,
      },
    });
  }
}
