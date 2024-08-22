import { ITopic } from '../interface/kafkaTopic';

export function splitIntoBatches(data: ITopic[], batchSize: number) {
  const result = [];
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    result.push(batch);
  }
  return result;
}
