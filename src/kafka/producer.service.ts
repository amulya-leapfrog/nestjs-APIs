import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { savedTopics } from 'src/kafka/constants/kafka';
import { splitIntoBatches } from './utils/kafka';
import { ITopic } from './interface/kafkaTopic';

@Injectable()
export class ProducerFactory {
  private readonly kafka = new Kafka({
    clientId: 'my-app-producer',
    brokers: ['localhost:9092'],
  });

  private readonly producer = this.kafka.producer();

  async kafkaProduce() {
    await this.producer.connect();
    // Compression GZIP ?? partitions
    // await Promise.all(
    //   savedTopics.map(async (topic, index) => {
    //     await this.producer.send({
    //       topic: `topic-${index + 1}`,
    //       messages: [{ value: JSON.stringify(topic) }],
    //     });
    //   }),
    // );
    const batchSize = 1000;
    let topicIndex = 0;
    for (const topic of savedTopics) {
      topicIndex += 1;
      const messages = splitIntoBatches(topic, batchSize);
      for (const batch of messages) {
        await this.producer.send({
          topic: `topic-${topicIndex}`,
          messages: batch.map((msg: ITopic) => ({
            value: JSON.stringify(msg),
          })),
        });
      }
    }
    await this.producer.disconnect();
  }
}
