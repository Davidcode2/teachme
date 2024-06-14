import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialsService } from './materials.service';
import { Material } from './materials.entity';
import { StripeService } from '../stripe/stripe.service';
import { UsersService } from '../users/usersService/users.service';
import { ImageService } from './image.service';

const mockMaterialRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockStripeService = () => ({
  createProduct: jest.fn(),
});

const mockUsersService = () => ({
  findOneById: jest.fn(),
});

const mockImageService = () => ({
  createPreview: jest.fn(),
});

describe('MaterialsService', () => {
  let service: MaterialsService;
  let materialRepository: Repository<Material>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialsService,
        {
          provide: getRepositoryToken(Material),
          useFactory: mockMaterialRepository,
        },
        {
          provide: StripeService,
          useFactory: mockStripeService,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
        {
          provide: ImageService,
          useFactory: mockImageService,
        },
      ],
    }).compile();

    service = module.get<MaterialsService>(MaterialsService);
    materialRepository = module.get<Repository<Material>>(
      getRepositoryToken(Material),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single material', async () => {
      const material = { id: '1', title: 'Material 1' };
      jest
        .spyOn(materialRepository, 'findOneBy')
        .mockResolvedValue(material as any);

      const result = await service.findOne('1');
      expect(result).toEqual(material);
    });

    it('should return null if material not found', async () => {
      jest.spyOn(materialRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOne('1');
      expect(result).toBeNull();
    });
  });
});
