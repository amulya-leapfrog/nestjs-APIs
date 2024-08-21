import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { savedTopics } from 'src/shared/constants/kafka';

@Injectable()
export class ProducerFactory {
  private readonly kafka = new Kafka({
    clientId: 'my-app-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer = this.kafka.producer();

  async kafkaProduce() {
    await this.producer.connect();
    await Promise.all(
      savedTopics.map(async (topic, index) => {
        await this.producer.send({
          topic: `topic-${index + 1}`,
          messages: [{ value: JSON.stringify(topic) }],
        });
      }),
    );
    await this.producer.disconnect();
  }
}
