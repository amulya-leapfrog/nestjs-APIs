import { Module } from '@nestjs/common';
import { ProducerFactory } from './producer.service';
import { ConsumerFactory } from './consumer.service';
import { BookRepository } from 'src/book/book.repository';

@Module({
  providers: [ProducerFactory, ConsumerFactory, BookRepository],
  exports: [ProducerFactory, ConsumerFactory],
})
export class KafkaModule {}
