import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../user.entity';
import { Author } from '../author.entity';
import { ConsumerService } from '../../consumer/consumer.service';
import { AuthorService } from '../author/author.service';
import { Material } from '../../materials/materials.entity';
import * as fs from 'node:fs/promises';

jest.mock('node:fs/promises');
jest.mock('jdenticon', () => ({
  toPng: jest.fn().mockReturnValue(Buffer.from('mock-avatar')),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let authorRepository: Repository<Author>;
  let consumerService: ConsumerService;
  let authorService: AuthorService;

  const mockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
    existsBy: jest.fn(),
  };

  const mockAuthorRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockConsumerService = {
    create: jest.fn(),
    findById: jest.fn(),
    getMaterials: jest.fn(),
    getCart: jest.fn(),
    addMaterials: jest.fn(),
    getNumberOfMaterials: jest.fn(),
  };

  const mockAuthorService = {
    getMaterials: jest.fn(),
    update: jest.fn(),
  };

  // Mock the UsersService for methods that call itself
  const mockUsersService = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorRepository,
        },
        {
          provide: ConsumerService,
          useValue: mockConsumerService,
        },
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    authorRepository = module.get<Repository<Author>>(
      getRepositoryToken(Author),
    );
    consumerService = module.get<ConsumerService>(ConsumerService);
    authorService = module.get<AuthorService>(AuthorService);
    
    // Mock the service's own methods that are called internally
    service.findOneById = mockUsersService.findOneById;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const mockUsers = [{ id: 'user-1' }, { id: 'user-2' }];
      mockUsersRepository.find.mockResolvedValue(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(mockUsersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = { id: 'user-1', email };
      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOneByEmail(email);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should return null if email is not provided', async () => {
      // Act
      const result = await service.findOneByEmail(null);

      // Assert
      expect(result).toBeNull();
      expect(mockUsersRepository.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const userId = 'user-123';
      const username = 'testuser';

      const mockConsumer = { id: 'consumer-123' };
      const mockAuthor = { id: 'author-123', materials: [] };
      const mockUser = {
        idpUserId: userId,
        signUpDate: expect.any(Date),
        author: mockAuthor,
        consumer: mockConsumer,
        avatar: 'assets/avatars/testuser.png',
      };

      service.findOneById = jest.fn().mockResolvedValue(mockUser);
      mockUsersRepository.existsBy.mockResolvedValue(false);
      mockConsumerService.create.mockResolvedValue(mockConsumer);
      mockAuthorRepository.save.mockResolvedValue(mockAuthor);
      mockUsersRepository.save.mockImplementation((user) =>
        Promise.resolve(user),
      );

      // Mock fs.writeFile
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await service.create(userId, username);

      // Assert
      expect(mockUsersRepository.existsBy).toHaveBeenCalledWith({ id: userId });
      expect(mockConsumerService.create).toHaveBeenCalled();
      expect(mockAuthorRepository.save).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(result).toMatchObject({
        idpUserId: userId,
        consumer: mockConsumer,
        avatar: expect.stringContaining(username),
      });
    });

    it('should throw error if user ID already exists', async () => {
      // Arrange
      mockUsersRepository.existsBy.mockResolvedValue(true);

      // Act & Assert
      await expect(service.create('existing-id', 'username')).rejects.toThrow(
        'UserId is already in use',
      );
      expect(mockConsumerService.create).not.toHaveBeenCalled();
    });
  });

  describe('updateWithAuthor', () => {
    it('should update user with author', async () => {
      // Arrange
      const mockUser = {
        id: 'user-1',
        author: { id: 'author-1', materials: [] },
      };

      mockUsersRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await service.updateWithAuthor(mockUser as any);

      // Assert
      expect(mockAuthorService.update).toHaveBeenCalledWith(mockUser.author);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      // Arrange
      const mockUser = { id: 'user-1' };
      mockUsersRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await service.update(mockUser as any);

      // Assert
      expect(mockUsersRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('partialUpdate', () => {
    it('should partially update user', async () => {
      // Arrange
      const userId = 'user-123';
      const updateDto = { displayName: 'New Name' };

      const mockUser = { id: 'internal-id', displayName: 'Old Name' };
      const updatedUser = { ...mockUser, displayName: 'New Name' };

      service.findOneById = jest.fn().mockResolvedValue(mockUser);
      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);
      mockUsersRepository.merge.mockReturnValue(updatedUser);
      mockUsersRepository.save.mockResolvedValue(updatedUser);

      // Act
      const result = await service.partialUpdate(userId, updateDto);

      // Assert
      expect(mockUsersRepository.merge).toHaveBeenCalledWith(
        mockUser,
        updateDto,
      );
      expect(mockUsersRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('addMaterials', () => {
    it('should add materials to user', async () => {
      // Arrange
      const userId = 'user-123';
      const materials = [
        { id: 'material-1' },
        { id: 'material-2' },
      ] as Material[];

      const mockUser = {
        id: 'internal-id',
        consumerId: 'consumer-123',
        consumer: {
          materials: [],
        },
      };

      const updatedConsumer = {
        ...mockUser.consumer,
        materials,
      };

      service.findOneById = jest.fn().mockResolvedValue(mockUser);
      mockUsersRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      mockConsumerService.addMaterials.mockResolvedValue(updatedConsumer);

      // Act
      await service.addMaterials(materials, userId);

      // Assert
      expect(mockConsumerService.addMaterials).toHaveBeenCalledWith(
        materials,
        'consumer-123',
      );
      expect(mockUsersRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        consumer: updatedConsumer,
      });
    });

    it('should throw error if user already has materials', async () => {
      // Arrange
      const userId = 'user-123';
      const material = { id: 'material-1' } as Material;

      const mockUser = {
        id: userId,
        consumerId: 'consumer-123',
        consumer: {
          id: 'consumer-123',
          materials: [material],
        },
      };

      service.findOneById = jest.fn().mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.addMaterials([material], userId)).rejects.toThrow(
        'User already has these materials',
      );
      expect(mockConsumerService.addMaterials).not.toHaveBeenCalled();
    });
  });

  describe('getStatistics', () => {
    it('should return user statistics', async () => {
      // Arrange
      const userId = 'user-123';

      const mockUser = {
        consumerId: 'consumer-123',
        authorId: 'author-123',
      };

      const mockAuthorMaterials = [{ id: 'material-1' }, { id: 'material-2' }];

      service.findOneById = jest.fn().mockResolvedValue(mockUser);
      mockConsumerService.getNumberOfMaterials.mockResolvedValue(5);
      mockAuthorService.getMaterials.mockResolvedValue(mockAuthorMaterials);

      // Act
      const result = await service.getStatistics(userId);

      // Assert
      expect(result).toEqual({
        numberOfBoughtMaterials: 5,
        numberOfCreatedMaterials: 2,
      });
    });
  });
});
