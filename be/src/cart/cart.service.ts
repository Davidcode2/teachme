import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/usersService/users.service';
import { Material } from '../materials/materials.entity';
import { MaterialsService } from '../materials/materials.service';
import { StripeService } from '../stripe/stripe.service';
import { CommonCartService } from '../common-cart/common-cart.service';
import { User } from 'src/users/user.entity';
import MaterialOutDto from 'src/shared/DTOs/materialOutDto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private userService: UsersService,
    private materialsService: MaterialsService,
    private stripeService: StripeService,
    private commonCartService: CommonCartService,
  ) {}

  async create(userId: string): Promise<Cart> {
    Logger.log('Creating cart for user with id: ' + userId);
    const cart = new Cart();
    const user = await this.userService.findOneById(userId);
    user.consumer.cart = cart;
    user.consumer.cart.materials = [];
    await this.cartRepository.save(cart);
    await this.userService.update(user);
    return cart;
  }

  async getItems(id: string): Promise<MaterialOutDto[]> {
    await this.createCartIfNotExists(id);
    const user = await this.userService.findOneById(id);
    const materials = user.consumer.cart.materials;
    const materialsWithThumbnails =
      await this.materialsService.mapThumbnails(materials);
    const materialsOutDto = materialsWithThumbnails.map((m) => {
      return {
        id: m.material.id,
        title: m.material.title,
        description: m.material.description,
        price: m.material.price,
        thumbnail: m.thumbnail,
      };
    });
    return materialsOutDto;
  }

  async removeItem(id: string, materialId: string): Promise<Material[]> {
    return this.commonCartService.removeItem(id, materialId);
  }

  async addItem(userId: string, materialId: string) {
    await this.createCartIfNotExists(userId);
    const user = await this.userService.findOneById(userId);
    const material = await this.materialsService.findOne(materialId);
    if (this.alreadyInCart(user, material)) {
      return user.consumer.cart.materials.length;
    }
    user.consumer.cart.materials.push(material);
    await this.userService.update(user);
    return user.consumer.cart.materials.length;
  }

  private async createCartIfNotExists(userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user.consumer.cart) {
      return await this.create(userId);
    }
  }

  private alreadyInCart(user: User, material: Material) {
    for (const m of user.consumer.cart.materials) {
      if (m.id === material.id) {
        return user.consumer.cart.materials.length;
      }
    }
  }

  async buyMaterial(materialIds: string[], userId: string) {
    const materials = await this.materialsService.findMany(materialIds);
    const stripePriceIds = materials.map((m) => m.stripe_price_id);
    const lineItems = stripePriceIds.map((m) => {
      return { price: m, quantity: 1 };
    });
    const session = await this.stripeService.createCheckoutSession(lineItems);
    this.stripeService.storeUserSession(userId, session.id);
    return session;
  }
}
