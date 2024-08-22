import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { BookRepository } from 'src/book/book.repository';
import { namedTopics, userIds } from 'src/kafka/constants/kafka';
import { getTopics } from './admin';

@Injectable()
export class ConsumerFactory implements OnModuleInit, OnModuleDestroy {
  constructor(private bookRepo: BookRepository) {}

  private readonly kafka = new Kafka({
    clientId: 'my-app-consumer',
    brokers: ['localhost:9092'],
  });

  private readonly consumer = this.kafka.consumer({ groupId: 'test-group' });

  async onModuleInit() {
    await this.kafkaConsume();
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  private async kafkaConsume() {
    await this.consumer.connect();

    const topicsList = await getTopics();

    const filteredTopics = topicsList
      .filter((topic) => namedTopics.includes(topic))
      .sort();

    await Promise.all(
      filteredTopics.map(async (_, index) => {
        await this.consumer.subscribe({
          topic: `topic-${index + 1}`,
          fromBeginning: true,
        });
      }),
    );

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const topicIndex = filteredTopics.indexOf(topic);
        const authorId = userIds[topicIndex];

        await this.bookRepo.create(
          authorId,
          [JSON.parse(message.value.toString())],
        );

        console.log({
          topic,
          authorId,
          partition,
          value: JSON.parse(message.value.toString()),
        });
      },
    });
  }
}
