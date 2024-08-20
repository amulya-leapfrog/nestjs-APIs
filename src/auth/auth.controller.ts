import { LoginDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ProducerFactory } from 'src/kafka/producer.service';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private kafkaProducer: ProducerFactory,
  ) {}

  @Post('login')
  login() {
    return this.kafkaProducer.kafkaProduce();
  }

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }
}
