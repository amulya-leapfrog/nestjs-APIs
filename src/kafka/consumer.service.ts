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

    let currentTopic = 'topic_1';

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (currentTopic === 'topic_1') {
          this.consumer.pause([
            { topic: 'topic_2', partitions: [0] },
            { topic: 'topic_3', partitions: [0] },
          ]);
        } else if (currentTopic === 'topic_2') {
          this.consumer.pause([
            { topic: 'topic_1', partitions: [0] },
            { topic: 'topic_3', partitions: [0] },
          ]);
        } else if (currentTopic === 'topic_3') {
          this.consumer.pause([
            { topic: 'topic_1', partitions: [0] },
            { topic: 'topic_2', partitions: [0] },
          ]);
        }

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
          offset: JSON.parse(message.offset),
        });

        if (lastOffset[0].offset == JSON.parse(message.offset) + 1) {
          if (currentTopic === 'topic_1') {
            console.log('Should go to topic 2');
            currentTopic = 'topic_2';
            this.consumer.resume([{ topic: 'topic_2', partitions: [0] }]);
            this.consumer.pause([
              { topic: 'topic_1', partitions: [0] },
              { topic: 'topic_3', partitions: [0] },
            ]);
          } else if (currentTopic === 'topic_2') {
            console.log('Should go to topic 3');
            currentTopic = 'topic_3';
            this.consumer.resume([{ topic: 'topic_3', partitions: [0] }]);
            this.consumer.pause([
              { topic: 'topic_1', partitions: [0] },
              { topic: 'topic_2', partitions: [0] },
            ]);
          } else if (currentTopic === 'topic_3') {
            console.log('Should go to topic 1');
            currentTopic = 'topic_1';
            this.consumer.resume([{ topic: 'topic_1', partitions: [0] }]);
            this.consumer.pause([
              { topic: 'topic_2', partitions: [0] },
              { topic: 'topic_3', partitions: [0] },
            ]);
          }
        }
      },
    });
  }
}
