import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { BookRepository } from 'src/book/book.repository';
import { namedTopics, userIds } from 'src/kafka/constants/kafka';
import { deleteExistingTopics, getTopics } from './admin';

@Injectable()
export class ConsumerFactory implements OnModuleInit, OnModuleDestroy {
  constructor(private bookRepo: BookRepository) {}

  private readonly kafka = new Kafka({
    clientId: 'my-app-consumer',
    brokers: ['localhost:9092'],
  });

  private readonly consumer = this.kafka.consumer({ groupId: 'test-group' });
  private readonly admin = this.kafka.admin();

  async onModuleInit() {
    await this.kafkaConsume();
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  private async kafkaConsume() {
    await this.consumer.connect();

    await deleteExistingTopics();

    await this.consumer.subscribe({
      topics: namedTopics,
      fromBeginning: true,
    });

    let currentTopicIndex = 0;

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.handleTopicPause.call(this, currentTopicIndex);

        const lastOffset = await this.admin.fetchTopicOffsets(topic);

        const topicIndex = namedTopics.indexOf(topic);
        const authorId = userIds[topicIndex];

        await this.bookRepo.create(
          authorId,
          JSON.parse(message.value.toString()),
        );

        console.log({
          topic,
          authorId,
          partition,
          value: JSON.parse(message.value.toString()),
          key: JSON.parse(message.key.toString()),
        });

        if (lastOffset[0].offset == JSON.parse(message.offset) + 1) {
          const nextTopicIndex = (currentTopicIndex + 1) % namedTopics.length;

          this.handleTopicPause.call(this, nextTopicIndex);

          this.consumer.resume([
            { topic: namedTopics[nextTopicIndex], partitions: [0] },
          ]);

          currentTopicIndex = nextTopicIndex;
        }
      },
    });
  }

  private handleTopicPause(topicIndex: number) {
    const topicsToPause = namedTopics
      .filter((_, index) => index !== topicIndex)
      .map((topic) => ({ topic, partitions: [0] }));

    this.consumer.pause(topicsToPause);
  }
}
