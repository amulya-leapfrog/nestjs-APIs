import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service';
import { AccessTokenGuard } from '../auth/guards';
import { CreateBookDto, UpdateBookDto } from './dto';
import { GetRequestUser } from 'src/shared/decorator';
import { PaginationQuery } from 'src/shared/interface';


@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  fetchAll(@Query() query: PaginationQuery) {
    return this.bookService.fetchAll(query);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  fetchMyBooks(
    @GetRequestUser('id') authorId: number,
    @Query() query: PaginationQuery,
  ) {
    return this.bookService.fetchMyBooks(authorId, query);
  }

  @Get(':id')
  fetchById(@Param('id') id: number) {
    return this.bookService.fetchById(Number(id));
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @GetRequestUser('id') authorId: number,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.bookService.create(authorId, createBookDto);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @GetRequestUser('id') authorId: number,
    @Param('id') bookId: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(authorId, Number(bookId), updateBookDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@GetRequestUser('id') authorId: number, @Param('id') bookId: number) {
    return this.bookService.delete(authorId, Number(bookId));
  }
}
