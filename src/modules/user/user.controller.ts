import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../auth/guards';
import { GetRequestUser } from 'src/shared/decorator';
import { UpdateUserDto } from './dto';
import { PaginationQuery } from 'src/shared/interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  fetchAll(@Query() query: PaginationQuery) {
    return this.userService.fetchAll(query);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  fetchMyDetails(@GetRequestUser('id') userId: number) {
    return this.userService.fetchMyDetails(userId);
  }

  @Get(':id')
  fetchById(@Param('id') id: number) {
    return this.userService.fetchById(Number(id));
  }

  @UseGuards(AccessTokenGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  update(
    @GetRequestUser('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  delete(@GetRequestUser('id') userId: number) {
    return this.userService.delete(userId);
  }
}
