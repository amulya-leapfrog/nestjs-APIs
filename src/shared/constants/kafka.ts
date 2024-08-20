import { topic1, topic2, topic3 } from 'src/kafkaMock';

const savedTopics = [topic1, topic2, topic3];
const namedTopics = ['topic1', 'topic2', 'topic3'];
const userIds = [13, 15, 18];

export const topicName = namedTopics[0];
export const topic = savedTopics[0];
export const authorId = userIds[0];
