import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';

const moduleMocker = new ModuleMocker(global);

describe('MaterialsController', () => {
  let controller: MaterialsController;
  let materialsService: MaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialsController],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === MaterialsService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<MaterialsController>(MaterialsController);
    materialsService = module.get<MaterialsService>(MaterialsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
