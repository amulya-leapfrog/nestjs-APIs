import { Module } from '@nestjs/common';

import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { AccessTokenStrategy } from '../auth/strategy';

@Module({
  controllers: [BookController],
  providers: [BookService, BookRepository, AccessTokenStrategy],
})

export class BookModule {}
