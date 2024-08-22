import { Kafka } from 'kafkajs';
import { namedTopics } from 'src/kafka/constants/kafka';

const kafka = new Kafka({
  clientId: 'my-app-admin',
  brokers: ['localhost:9092'],
});

const admin = kafka.admin();

export const deleteExistingTopics = async () => {
  try {
    await admin.connect();
    await admin.deleteTopics({ topics: namedTopics });
  } catch (error) {
    console.error('Error fetching topics:', error);
  } finally {
    await admin.disconnect();
  }
};

export const getTopics = async () => {
  try {
    await admin.connect();

    const topics = await admin.listTopics();

    const customTopics = topics.filter(
      (topic: string) => !topic.startsWith('__'),
    );

    return customTopics;
  } catch (error) {
    console.error('Error fetching topics:', error);
  } finally {
    await admin.disconnect();
  }
};
