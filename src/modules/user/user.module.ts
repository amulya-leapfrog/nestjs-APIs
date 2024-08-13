import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { AccessTokenStrategy } from '../auth/strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, AccessTokenStrategy],
})

export class UserModule {}
