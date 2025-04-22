import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MaterialsService } from './materials.service';
import { Material } from './materials.entity';
import { StripeService } from '../stripe/stripe.service';
import { UsersService } from '../users/usersService/users.service';
import { ImageService } from './image.service';
import * as fs from 'node:fs/promises';
import MaterialDtoIn from '../shared/Models/MaterialsIn';

jest.mock('node:fs/promises');
jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('MaterialsService', () => {
  let service: MaterialsService;
  let materialsRepository: Repository<Material>;
  let stripeService: StripeService;
  let usersService: UsersService;
  let imageService: ImageService;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
  } as unknown as SelectQueryBuilder<Material>;

  const mockMaterialsRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    merge: jest.fn(),
  };

  const mockStripeService = {
    createProduct: jest.fn(),
  };

  const mockUsersService = {
    findOneById: jest.fn(),
    update: jest.fn(),
    updateWithAuthor: jest.fn(),
  };

  const mockImageService = {
    createThumbnail: jest.fn(),
    createPreview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialsService,
        {
          provide: getRepositoryToken(Material),
          useValue: mockMaterialsRepository,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ImageService,
          useValue: mockImageService,
        },
      ],
    }).compile();

    service = module.get<MaterialsService>(MaterialsService);
    materialsRepository = module.get<Repository<Material>>(
      getRepositoryToken(Material),
    );
    stripeService = module.get<StripeService>(StripeService);
    usersService = module.get<UsersService>(UsersService);
    imageService = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single material', async () => {
      const material = { id: '1', title: 'Material 1' };
      mockMaterialsRepository.findOneBy.mockResolvedValue(material as any);

      const result = await service.findOne('1');
      expect(result).toEqual(material);
      expect(mockMaterialsRepository.findOneBy).toHaveBeenCalledWith({
        id: '1',
      });
    });

    it('should return null if material not found', async () => {
      mockMaterialsRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne('1');
      expect(result).toBeNull();
      expect(mockMaterialsRepository.findOneBy).toHaveBeenCalledWith({
        id: '1',
      });
    });
  });

  describe('findPaginated', () => {
    it('should return paginated materials with thumbnails', async () => {
      // Arrange
      const page = 0;
      const pageSize = 10;
      const mockMaterials = [
        {
          id: 'material-1',
          title: 'Material 1',
          thumbnail_path: 'path/to/thumbnail1',
        },
        {
          id: 'material-2',
          title: 'Material 2',
          thumbnail_path: 'path/to/thumbnail2',
        },
      ];

      const mockThumbnails = [
        { material: mockMaterials[0], thumbnail: Buffer.from('thumbnail1') },
        { material: mockMaterials[1], thumbnail: Buffer.from('thumbnail2') },
      ];

      // Mock the mapThumbnails method
      jest.spyOn(service, 'mapThumbnails').mockResolvedValue(mockThumbnails);

      // Act
      const result = await service.findPaginated(page, pageSize);

      // Assert
      expect(mockMaterialsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'material',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      //expect(service.mapThumbnails).toHaveBeenCalledWith(mockMaterials);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 'material-1');
      expect(result[0]).toHaveProperty('thumbnail', Buffer.from('thumbnail1'));
    });
  });

  describe('getTotal', () => {
    it('should return the total count of materials', async () => {
      // Arrange
      mockMaterialsRepository.count.mockResolvedValue(42);

      // Act
      const result = await service.getTotal();

      // Assert
      expect(result).toBe(42);
      expect(mockMaterialsRepository.count).toHaveBeenCalled();
    });
  });

  describe('findByCreator', () => {
    it('should return materials created by a user', async () => {
      // Arrange
      const userId = 'user-id';
      const mockMaterials = [
        {
          id: 'material-1',
          title: 'Material 1',
          thumbnail_path: 'path/to/thumbnail1',
        },
        {
          id: 'material-2',
          title: 'Material 2',
          thumbnail_path: 'path/to/thumbnail2',
        },
      ];

      const mockUser = {
        author: {
          materials: mockMaterials,
        },
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);

      const mockThumbnails = [
        { material: mockMaterials[0], thumbnail: Buffer.from('thumbnail1') },
        { material: mockMaterials[1], thumbnail: Buffer.from('thumbnail2') },
      ];

      jest.spyOn(service, 'mapThumbnails').mockResolvedValue(mockThumbnails);

      // Act
      const result = await service.findByCreator(userId);

      // Assert
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
      expect(service.mapThumbnails).toHaveBeenCalledWith(mockMaterials);
      expect(result).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('should create a new material', async () => {
      // Arrange
      const userId = 'user-id';
      const materialDto: MaterialDtoIn = {
        title: 'New Material',
        userId: userId,
        link: 'https://example.com',
        description: 'Test Description',
        price: '1000',
        file: { buffer: Buffer.from('test-file') } as Express.Multer.File,
      };

      const mockUser = {
        authorId: 'author-id',
        author: {
          materials: [],
        },
      };

      const mockMaterial = {
        title: 'New Material',
        description: 'Test Description',
        date_published: expect.any(Date),
        price: 1000,
        file_path: 'assets/materials/mock-uuid.pdf',
        thumbnail_path: 'path/to/thumbnail',
        preview_path: 'path/to/preview',
        stripe_price_id: 'price-id',
        author_id: 'author-id',
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockImageService.createThumbnail.mockResolvedValue('path/to/thumbnail');
      mockImageService.createPreview.mockResolvedValue('path/to/preview');
      mockStripeService.createProduct.mockResolvedValue({ id: 'price-id' });
      mockMaterialsRepository.save.mockResolvedValue(mockMaterial);

      // Mock fs.writeFile
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      await service.create(userId, materialDto);

      // Assert
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
      expect(mockMaterialsRepository.save).toHaveBeenCalled();
      expect(mockStripeService.createProduct).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(mockUser.author.materials).toContainEqual(
        expect.objectContaining({
          title: 'New Material',
          description: 'Test Description',
        }),
      );
      expect(mockUsersService.updateWithAuthor).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update an existing material', async () => {
      // Arrange
      const materialId = 'material-id';
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const file = {
        buffer: Buffer.from('updated-file'),
      } as Express.Multer.File;

      const existingMaterial = {
        id: materialId,
        title: 'Original Title',
        description: 'Original Description',
      };

      const updatedMaterial = {
        id: materialId,
        title: 'Updated Title',
        description: 'Updated Description',
        file_path: 'assets/materials/mock-uuid.pdf',
        thumbnail_path: 'path/to/updated/thumbnail',
        preview_path: 'path/to/updated/preview',
      };

      mockMaterialsRepository.findOneBy.mockResolvedValue(existingMaterial);
      mockImageService.createThumbnail.mockResolvedValue(
        'path/to/updated/thumbnail',
      );
      mockImageService.createPreview.mockResolvedValue(
        'path/to/updated/preview',
      );
      mockMaterialsRepository.merge.mockReturnValue(updatedMaterial);
      mockMaterialsRepository.save.mockResolvedValue(updatedMaterial);

      // Mock fs.writeFile
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await service.update(materialId, updateDto, file);

      // Assert
      expect(mockMaterialsRepository.findOneBy).toHaveBeenCalledWith({
        id: materialId,
      });
      expect(mockMaterialsRepository.merge).toHaveBeenCalledWith(
        existingMaterial,
        expect.objectContaining({
          title: 'Updated Title',
          description: 'Updated Description',
        }),
      );
      expect(mockMaterialsRepository.save).toHaveBeenCalledWith(
        updatedMaterial,
      );
      expect(result).toEqual(updatedMaterial);
    });

    it('should update without file if no file provided', async () => {
      // Arrange
      const materialId = 'material-id';
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const existingMaterial = {
        id: materialId,
        title: 'Original Title',
        description: 'Original Description',
      };

      const updatedMaterial = {
        id: materialId,
        title: 'Updated Title',
        description: 'Updated Description',
      };

      mockMaterialsRepository.findOneBy.mockResolvedValue(existingMaterial);
      mockMaterialsRepository.merge.mockReturnValue(updatedMaterial);
      mockMaterialsRepository.save.mockResolvedValue(updatedMaterial);

      // Act
      const result = await service.update(materialId, updateDto, null);

      // Assert
      expect(mockMaterialsRepository.findOneBy).toHaveBeenCalledWith({
        id: materialId,
      });
      expect(mockMaterialsRepository.merge).toHaveBeenCalledWith(
        existingMaterial,
        updateDto,
      );
      expect(mockMaterialsRepository.save).toHaveBeenCalledWith(
        updatedMaterial,
      );
      expect(result).toEqual(updatedMaterial);
    });
  });

  describe('delete', () => {
    it('should delete a material', async () => {
      // Arrange
      const materialId = 'material-id';
      const mockMaterial = { id: materialId, title: 'Test Material' };

      mockMaterialsRepository.findOneBy.mockResolvedValue(mockMaterial);
      mockMaterialsRepository.delete.mockResolvedValue({ affected: 1 });

      // Act
      const result = await service.delete(materialId);

      // Assert
      expect(result).toEqual(mockMaterial);
      expect(mockMaterialsRepository.findOneBy).toHaveBeenCalledWith({
        id: materialId,
      });
      expect(mockMaterialsRepository.delete).toHaveBeenCalledWith(materialId);
    });

    it('should return null if material not found', async () => {
      // Arrange
      const materialId = 'non-existent-id';

      mockMaterialsRepository.findOneBy.mockResolvedValue(null);

      // Act
      const result = await service.delete(materialId);

      // Assert
      expect(result).toBeNull();
      expect(mockMaterialsRepository.findOneBy).toHaveBeenCalledWith({
        id: materialId,
      });
      expect(mockMaterialsRepository.delete).not.toHaveBeenCalled();
    });
  });

describe('search', () => {
    it('should search for materials by title', async () => {
      // Arrange
      const searchTerm = 'test';
      const mockMaterialsToSave = [
        { id: 'material-1', title: 'Test Material 1', file_path: 'path/1' },
        { id: 'material-2', title: 'Test Material 2', file_path: 'path/2' },
      ];

      // Mock the save method (still important if other parts of your service use it)
      const mockSave = jest.fn().mockResolvedValue(mockMaterialsToSave);
      mockMaterialsRepository.save = mockSave;

      // Mock the query builder and its methods
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(), // Mock where and make it chainable
        getMany: jest.fn().mockResolvedValue(mockMaterialsToSave), // Mock getMany to return our saved data
      };
      jest.spyOn(mockMaterialsRepository, 'createQueryBuilder').mockReturnValue(
        mockQueryBuilder as any, // Type assertion to bypass strict type checking
      );

      const mockThumbnails = [
        {
          material: { id: 'material-1', title: 'Test Material 1' },
          thumbnail: Buffer.from('thumbnail1'),
        },
        {
          material: { id: 'material-2', title: 'Test Material 2' },
          thumbnail: Buffer.from('thumbnail2'),
        },
      ];

      jest.spyOn(service, 'mapThumbnails').mockResolvedValue(mockThumbnails);

      // Act
      const result = await service.search(searchTerm);

      // Assert
      expect(mockMaterialsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'material',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'material.title LIKE :term',
        { term: '%test%' },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result.map(item => item.id)).toEqual(['material-1', 'material-2']);
    });
  });

  describe('mapThumbnails', () => {
    it('should map thumbnails to materials', async () => {
      // Arrange
      const mockMaterials: Material[] = [
        { id: 'material-1', thumbnail_path: 'path/to/thumbnail1', title: 'Material 1', file_path: 'path/to/file1', description: 'Description 1', price: 200, stripe_price_id: "123456790", preview_path: "blub/blub", link: "test", date_published: new Date(), author_id: "lksfjlkjls"  },
        { id: 'material-2', thumbnail_path: 'path/to/thumbnail2', title: 'Material 2', file_path: 'path/to/file2', description: 'Description 2', price: 200, stripe_price_id: "223456790", preview_path: "test/blub", link: "test2", date_published: new Date(), author_id: "author-124"},
      ];

      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce(Buffer.from('thumbnail1'))
        .mockResolvedValueOnce(Buffer.from('thumbnail2'));

      // Act
      const result = await service.mapThumbnails(mockMaterials);

      // Assert
      expect(fs.readFile).toHaveBeenCalledTimes(2);
      expect(fs.readFile).toHaveBeenCalledWith('path/to/thumbnail1');
      expect(fs.readFile).toHaveBeenCalledWith('path/to/thumbnail2');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        material: mockMaterials[0],
        thumbnail: Buffer.from('thumbnail1'),
      });
      expect(result[1]).toEqual({
        material: mockMaterials[1],
        thumbnail: Buffer.from('thumbnail2'),
      });
    });
  });
});
