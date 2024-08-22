import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerFactory } from './consumer.service';

describe('ConsumerService', () => {
  let service: ConsumerFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumerFactory],
    }).compile();

    service = module.get<ConsumerFactory>(ConsumerFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
