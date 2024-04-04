import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/usersService/users.service';
import { Material } from 'src/materials/materials.entity';
import { MaterialsService } from 'src/materials/materials.service';
import { StripeService } from 'src/stripe/stripe.service';
import { CommonCartService } from 'src/common-cart/common-cart.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private userService: UsersService,
    private materialsService: MaterialsService,
    private stripeService: StripeService,
    private commonCartService: CommonCartService,
  ) { }

  async create(userId: string): Promise<Cart> {
    const cart = new Cart();
    const user = await this.userService.findOneById(userId);
    user.consumer.cart = cart;
    user.consumer.cart.materials = [];
    this.cartRepository.save(cart);
    this.userService.update(user);
    return cart;
  }

  async getItems(id: string): Promise<Material[]> {
    await this.createCartIfNotExists(id);
    const user = await this.userService.findOneById(id);
    const materials = user.consumer.cart.materials;
    return materials;
  }

  async removeItem(id: string, materialId: string): Promise<Material[]> {
    return this.commonCartService.removeItem(id, materialId);
  }

  async addItem(userId: string, materialId: string) {
    await this.createCartIfNotExists(userId);
    const user = await this.userService.findOneById(userId);
    const material = await this.materialsService.findOne(materialId);
    user.consumer.cart.materials.push(material);
    this.userService.update(user);
    return material;
  }

  private async createCartIfNotExists(userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user.consumer.cart) {
      await this.create(userId);
    }
  }

  async buyMaterial(materialIds: string[]) {
    const materials = await this.materialsService.findMany(materialIds);
    const stripePriceIds = materials.map((m) => m.stripe_price_id);
    const lineItems = stripePriceIds.map((m) => { return { "price": m, "quantity": 1 }});
    const session = await this.stripeService.createCheckoutSession(lineItems);
    return session;
  }
}
