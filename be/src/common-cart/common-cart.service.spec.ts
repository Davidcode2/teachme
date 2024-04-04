import { Test, TestingModule } from '@nestjs/testing';
import { CommonCartService } from './common-cart.service';

describe('CommonCartService', () => {
  let service: CommonCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonCartService],
    }).compile();

    service = module.get<CommonCartService>(CommonCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
