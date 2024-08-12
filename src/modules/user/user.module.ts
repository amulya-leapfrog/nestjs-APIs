import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccessTokenStrategy } from '../auth/strategy';
import { userRepository } from './user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, userRepository, AccessTokenStrategy],
})
export class UserModule {}
