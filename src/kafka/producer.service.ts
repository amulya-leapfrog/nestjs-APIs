import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  topic,
  topicName,
} from 'src/shared/constants/kafka';

@Injectable()
export class ProducerFactory {
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  });

  private readonly producer = this.kafka.producer();

  async kafkaProduce() {
    await this.producer.connect();
    await this.producer.send({
      topic: topicName,
      messages: [{ value: JSON.stringify(topic) }],
    });
    await this.producer.disconnect();
  }
}
