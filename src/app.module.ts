import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [AuthModule, UserModule, BookModule, DatabaseModule],
})
export class AppModule {}
