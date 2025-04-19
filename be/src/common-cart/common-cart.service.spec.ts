import { Test, TestingModule } from '@nestjs/testing';
import { CommonCartService } from './common-cart.service';
import { UsersService } from '../users/usersService/users.service';
import { Material } from '../materials/materials.entity';

describe('CommonCartService', () => {
  let service: CommonCartService;
  let usersService: UsersService;

  const mockUsersService = {
    findOneById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonCartService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<CommonCartService>(CommonCartService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', async () => {
      // Arrange
      const userId = 'user-id';
      const materialId = 'material-id';
      const material1 = { id: materialId } as Material;
      const material2 = { id: 'other-material-id' } as Material;
      
      const mockUser = {
        consumer: {
          cart: {
            materials: [material1, material2],
          },
        },
      };
      
      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(mockUser);

      // Act
      const result = await service.removeItem(userId, materialId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('other-material-id');
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser);
      expect(mockUser.consumer.cart.materials).toEqual([material2]);
    });

    it('should return empty array if material not found', async () => {
      // Arrange
      const userId = 'user-id';
      const materialId = 'non-existent-id';
      const material = { id: 'other-id' } as Material;
      
      const mockUser = {
        consumer: {
          cart: {
            materials: [material],
          },
        },
      };
      
      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(mockUser);

      // Act
      const result = await service.removeItem(userId, materialId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('other-id');
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser);
    });
  });
});
