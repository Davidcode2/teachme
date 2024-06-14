import { Test, TestingModule } from '@nestjs/testing';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/usersService/users.service';
import { FinderByPriceIdService } from '../material-price-id-finder/material-price-id-finder.service';
import { CommonCartService } from '../common-cart/common-cart.service';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

describe('StripeController', () => {
  let controller: StripeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeController],
      providers: [
        StripeService,
        ConfigService,
        UsersService,
        FinderByPriceIdService,
        CommonCartService,
        Repository<User>,
      ],
    }).compile();

    controller = module.get<StripeController>(StripeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
