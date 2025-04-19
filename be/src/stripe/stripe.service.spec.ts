import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { UsersService } from '../users/usersService/users.service';
import { FinderByPriceIdService } from '../material-price-id-finder/material-price-id-finder.service';
import { CommonCartService } from '../common-cart/common-cart.service';
import { Material } from '../materials/materials.entity';
import Stripe from 'stripe';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    products: {
      create: jest.fn(),
    },
    prices: {
      create: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe('StripeService', () => {
  let service: StripeService;
  let configService: ConfigService;
  let usersService: UsersService;
  let materialFinderService: FinderByPriceIdService;
  let commonCartService: CommonCartService;
  let stripeMock: jest.Mocked<Stripe>;

  const mockConfigService = {
    get: jest.fn((key) => {
      const config = {
        'STRIPE_TEST': 'test_key',
        'FE_URL': 'http://localhost:3000',
        'STRIPE_WEBHOOK_SECRET': 'whsec_test',
      };
      return config[key];
    }),
  };

  const mockUsersService = {
    findOneById: jest.fn(),
    addMaterials: jest.fn(),
  };

  const mockMaterialFinderService = {
    findByStripePriceIds: jest.fn(),
  };

  const mockCommonCartService = {
    removeItem: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: FinderByPriceIdService,
          useValue: mockMaterialFinderService,
        },
        {
          provide: CommonCartService,
          useValue: mockCommonCartService,
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    configService = module.get<ConfigService>(ConfigService);
    usersService = module.get<UsersService>(UsersService);
    materialFinderService = module.get<FinderByPriceIdService>(FinderByPriceIdService);
    commonCartService = module.get<CommonCartService>(CommonCartService);
    
    // Get the Stripe mock instance
    stripeMock = (service as any).stripe;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a Stripe product and price', async () => {
      // Arrange
      const material = {
        title: 'Test Material',
        description: 'Test Description',
        price: 1000,
      } as Material;
      
      const mockProduct = { id: 'prod_123' };
      const mockPrice = { id: 'price_123' };
      
      stripeMock.products.create.mockResolvedValue(mockProduct as any);
      stripeMock.prices.create.mockResolvedValue(mockPrice as any);
      
      // Act
      const result = await service.createProduct(material);
      
      // Assert
      expect(stripeMock.products.create).toHaveBeenCalledWith({
        name: 'Test Material',
        description: 'Test Description',
      });
      expect(stripeMock.prices.create).toHaveBeenCalledWith({
        unit_amount: 1000,
        currency: 'eur',
        product: 'prod_123',
      });
      expect(result).toEqual(mockPrice);
    });
  });

  describe('storeUserSession', () => {
    it('should store user session', () => {
      // Arrange
      const userId = 'user-123';
      const sessionId = 'session-123';
      
      // Act
      service.storeUserSession(userId, sessionId);
      
      // Assert
      expect((service as any).sessions[sessionId]).toBe(userId);
    });
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session', async () => {
      // Arrange
      const items = [
        { price: 'price_123', quantity: 1 },
        { price: 'price_456', quantity: 2 },
      ];
      
      const mockSession = {
        id: 'session-123',
        url: 'https://checkout.stripe.com/session',
      };
      
      stripeMock.checkout.sessions.create.mockResolvedValue(mockSession as any);
      
      // Act
      const result = await service.createCheckoutSession(items);
      
      // Assert
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith({
        line_items: items,
        mode: 'payment',
        success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/materials',
      });
      expect(result).toEqual(mockSession);
    });
  });

  describe('getSessionStatus', () => {
    it('should retrieve session status', async () => {
      // Arrange
      const sessionId = 'session-123';
      const mockSession = {
        id: sessionId,
        status: 'complete',
      };
      
      stripeMock.checkout.sessions.retrieve.mockResolvedValue(mockSession as any);
      
      // Act
      const result = await service.getSessionStatus(sessionId);
      
      // Assert
      expect(stripeMock.checkout.sessions.retrieve).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(mockSession);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify webhook signature successfully', () => {
      // Arrange
      const payload = 'payload';
      const signature = 'signature';
      const mockEvent = { type: 'checkout.session.completed' };
      
      (Stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);
      
      // Act
      const result = service.verifyWebhookSignature(payload, signature);
      
      // Assert
      expect(Stripe.webhooks.constructEvent).toHaveBeenCalledWith(payload, signature, 'whsec_test');
      expect(result).toEqual({ status: true, res: mockEvent });
    });

    it('should return error if signature verification fails', () => {
      // Arrange
      const payload = 'payload';
      const signature = 'invalid-signature';
      const mockError = new Error('Invalid signature');
      
      (Stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
        throw mockError;
      });
      
      // Act
      const result = service.verifyWebhookSignature(payload, signature);
      
      // Assert
      expect(result).toEqual({ status: false, res: mockError });
    });
  });

  describe('handleCheckoutSessionCompleted', () => {
    it('should fulfill order when checkout session is completed', async () => {
      // Arrange
      const mockEvent = {
        data: {
          object: {
            id: 'session-123',
          },
        },
      };
      
      const mockSessionWithLineItems = {
        line_items: {
          data: [
            { price: { id: 'price-1' } },
            { price: { id: 'price-2' } },
          ],
        },
      };
      
      stripeMock.checkout.sessions.retrieve.mockResolvedValue(mockSessionWithLineItems as any);
      
      // Mock private methods
      const popSessionSpy = jest.spyOn(service as any, 'popSession').mockReturnValue('user-123');
      const fulfillOrderSpy = jest.spyOn(service as any, 'fulfillOrder').mockResolvedValue(undefined);
      
      // Act
      await service.handleCheckoutSessionCompleted(mockEvent as any);
      
      // Assert
      expect(stripeMock.checkout.sessions.retrieve).toHaveBeenCalledWith('session-123', {
        expand: ['line_items'],
      });
      expect(fulfillOrderSpy).toHaveBeenCalledWith(mockSessionWithLineItems.line_items, 'session-123');
    });
  });

  describe('fulfillOrder', () => {
    it('should add materials to user and remove from cart', async () => {
      // Arrange
      const lineItems = {
        data: [
          { price: { id: 'price-1' } },
          { price: { id: 'price-2' } },
        ],
      };
      const checkoutId = 'session-123';
      const userId = 'user-123';
      
      const mockMaterials = [
        { id: 'material-1', stripe_price_id: 'price-1' },
        { id: 'material-2', stripe_price_id: 'price-2' },
      ];
      
      // Mock private method
      jest.spyOn(service as any, 'popSession').mockReturnValue(userId);
      
      mockMaterialFinderService.findByStripePriceIds.mockResolvedValue(mockMaterials);
      
      // Act
      await (service as any).fulfillOrder(lineItems, checkoutId);
      
      // Assert
      expect(mockMaterialFinderService.findByStripePriceIds).toHaveBeenCalledWith(['price-1', 'price-2']);
      expect(mockUsersService.addMaterials).toHaveBeenCalledWith(mockMaterials, userId);
      expect(mockCommonCartService.removeItem).toHaveBeenCalledTimes(2);
      expect(mockCommonCartService.removeItem).toHaveBeenCalledWith(userId, 'material-1');
      expect(mockCommonCartService.removeItem).toHaveBeenCalledWith(userId, 'material-2');
    });
  });
});
