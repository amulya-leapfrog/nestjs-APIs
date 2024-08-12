import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtService]
})
export class AuthModule {}
