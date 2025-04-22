import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { UsersService } from '../users/usersService/users.service';
import { MaterialsService } from '../materials/materials.service';
import { StripeService } from '../stripe/stripe.service';
import { CommonCartService } from '../common-cart/common-cart.service';
import { Material } from '../materials/materials.entity';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let usersService: UsersService;
  let materialsService: MaterialsService;
  let stripeService: StripeService;
  let commonCartService: CommonCartService;

  const mockCartRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUsersService = {
    findOneById: jest.fn(),
    update: jest.fn(),
  };

  const mockMaterialsService = {
    findOne: jest.fn(),
    findMany: jest.fn(),
    mapThumbnails: jest.fn(),
  };

  const mockStripeService = {
    createCheckoutSession: jest.fn(),
    storeUserSession: jest.fn(),
  };

  const mockCommonCartService = {
    removeItem: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: MaterialsService,
          useValue: mockMaterialsService,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
        {
          provide: CommonCartService,
          useValue: mockCommonCartService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    usersService = module.get<UsersService>(UsersService);
    materialsService = module.get<MaterialsService>(MaterialsService);
    stripeService = module.get<StripeService>(StripeService);
    commonCartService = module.get<CommonCartService>(CommonCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cart for a user', async () => {
      // Arrange
      const userId = 'user-id';
      const mockUser = {
        consumer: {},
      };
      const mockCart = new Cart();
      mockCart.materials = [];

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockCartRepository.save.mockResolvedValue(mockCart);

      // Act
      const result = await service.create(userId);

      // Assert
      expect(result).toEqual(mockCart);
      expect(mockCartRepository.save).toHaveBeenCalledWith(mockCart);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getItems', () => {
    it('should return cart items with thumbnails', async () => {
      // Arrange
      const userId = 'user-id';
      const mockMaterial = { id: 'material-id', title: 'Test Material', description: 'Test Description', price: 1000 };
      const mockUser = {
        consumer: {
          cart: {
            materials: [mockMaterial],
          },
        },
      };

      const mockThumbnail = Buffer.from('test-thumbnail');
      const mockMaterialWithThumbnail = [
        { material: mockMaterial, thumbnail: mockThumbnail }
      ];

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockMaterialsService.mapThumbnails.mockResolvedValue(mockMaterialWithThumbnail);

      // Act
      const result = await service.getItems(userId);

      // Assert
      expect(result).toEqual([
        {
          id: 'material-id',
          title: 'Test Material',
          description: 'Test Description',
          price: 1000,
          thumbnail: mockThumbnail,
        },
      ]);
      expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
      expect(mockMaterialsService.mapThumbnails).toHaveBeenCalledWith([mockMaterial]);
    });

    it('should create a cart if it does not exist', async () => {
      // Arrange
      const userId = 'user-id';
      const mockUser = {
        consumer: {},
      };
      const mockCart = new Cart();
      mockCart.materials = [];

      mockUsersService.findOneById.mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({
          consumer: {
            cart: {
              materials: [],
            },
          },
        });
      mockCartRepository.save.mockResolvedValue(mockCart);
      mockMaterialsService.mapThumbnails.mockResolvedValue([]);

      // Act
      const result = await service.getItems(userId);

      // Assert
      expect(result).toEqual([]);
      expect(mockCartRepository.save).toHaveBeenCalledWith(expect.any(Cart));
    });
  });

  describe('removeItem', () => {
    it('should delegate to commonCartService', async () => {
      // Arrange
      const userId = 'user-id';
      const materialId = 'material-id';
      const mockMaterials = [{ id: 'other-material-id' }];

      mockCommonCartService.removeItem.mockResolvedValue(mockMaterials);

      // Act
      const result = await service.removeItem(userId, materialId);

      // Assert
      expect(result).toEqual(mockMaterials);
      expect(mockCommonCartService.removeItem).toHaveBeenCalledWith(userId, materialId);
    });
  });

  describe('addItem', () => {
    it('should add an item to the cart', async () => {
      // Arrange
      const userId = 'user-id';
      const materialId = 'material-id';
      const mockMaterial = { id: materialId } as Material;
      const mockUser = {
        consumer: {
          cart: {
            materials: [],
          },
        },
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockMaterialsService.findOne.mockResolvedValue(mockMaterial);

      // Act
      const result = await service.addItem(userId, materialId);

      // Assert
      expect(result).toBe(1); // Length of materials array after adding
      expect(mockUser.consumer.cart.materials).toContain(mockMaterial);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser);
    });

    it('should not add duplicate items', async () => {
      // Arrange
      const userId = 'user-id';
      const materialId = 'material-id';
      const mockMaterial = { id: materialId } as Material;
      const mockUser = {
        consumer: {
          cart: {
            materials: [mockMaterial],
          },
        },
      };

      mockUsersService.findOneById.mockResolvedValue(mockUser);
      mockMaterialsService.findOne.mockResolvedValue(mockMaterial);

      // Act
      const result = await service.addItem(userId, materialId);

      // Assert
      expect(result).toBe(1); // Length of materials array (unchanged)
      expect(mockUser.consumer.cart.materials).toHaveLength(1);
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });

    it('should create a cart if it does not exist', async () => {
      // Arrange
      const userId = 'user-id';
      const materialId = 'material-id';
      const mockMaterial = { id: materialId } as Material;
      
      // First call - no cart
      const mockUserNoCart = {
        consumer: {},
      };
      
      // Second call - with cart
      const mockUserWithCart = {
        consumer: {
          cart: {
            materials: [],
          },
        },
      };

      mockUsersService.findOneById
        .mockResolvedValueOnce(mockUserNoCart)
        .mockResolvedValueOnce(mockUserWithCart);
      
      mockMaterialsService.findOne.mockResolvedValue(mockMaterial);
      mockCartRepository.save.mockResolvedValue(new Cart());

      // Act
      const result = await service.addItem(userId, materialId);

      // Assert
      expect(result).toBe(1);
      expect(mockCartRepository.save).toHaveBeenCalled();
    });
  });

  describe('buyMaterial', () => {
    it('should create a checkout session and store user session', async () => {
      // Arrange
      const userId = 'user-id';
      const materialIds = ['material-id-1', 'material-id-2'];
      const mockMaterials = [
        { id: 'material-id-1', stripe_price_id: 'price-id-1' },
        { id: 'material-id-2', stripe_price_id: 'price-id-2' },
      ];
      const mockSession = { id: 'session-id', url: 'checkout-url' };

      mockMaterialsService.findMany.mockResolvedValue(mockMaterials);
      mockStripeService.createCheckoutSession.mockResolvedValue(mockSession);

      // Act
      const result = await service.buyMaterial(materialIds, userId);

      // Assert
      expect(result).toEqual(mockSession);
      expect(mockMaterialsService.findMany).toHaveBeenCalledWith(materialIds);
      expect(mockStripeService.createCheckoutSession).toHaveBeenCalledWith([
        { price: 'price-id-1', quantity: 1 },
        { price: 'price-id-2', quantity: 1 },
      ]);
      expect(mockStripeService.storeUserSession).toHaveBeenCalledWith(userId, 'session-id');
    });
  });
});
