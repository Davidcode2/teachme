import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Material } from 'src/materials/materials.entity';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripeTest: string;
  private stripe = null;

  constructor(private configuration: ConfigService) {
    this.stripeTest = this.configuration.get('STRIPE_TEST');
    this.stripe = new Stripe(this.stripeTest);
  }

  public async createProduct(material: Material): Promise<Material> {
    const product = await this.stripe.products.create({
      name: material.title,
      description: material.description,
    });
    const prices = await this.stripe.prices.create({
      unit_amount: material.price,
      currency: 'eur',
      product: product.id,
    });

    return prices;
  }

  public async createCheckoutSession(price) {
    console.log(price);
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/login`,
      cancel_url: `http://localhost:5173/signup`,
    });
    return session;
  }
}
