import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Material } from 'src/materials/materials.entity';
import { UsersService } from 'src/users/usersService/users.service';
import Stripe from 'stripe';
import { FinderByPriceIdService } from 'src/material-price-id-finder/material-price-id-finder.service';
import { CommonCartService } from 'src/common-cart/common-cart.service';

@Injectable()
export class StripeService {
  private stripeTest: string;
  private stripe = null;
  private sessions = {};

  constructor(
    private configuration: ConfigService,
    private userService: UsersService,
    private materialFinderService: FinderByPriceIdService,
    private commonCartService: CommonCartService,
  ) {
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

  public storeUserSession(userId: string, sessionId: string) {
    this.sessions[sessionId] = userId;
  }

  public async createCheckoutSession(items: { price: string, quantity: number}[]) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: items,
      mode: 'payment',
      success_url: `${this.configuration.get('FE_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configuration.get('FE_URL')}/materials`,
    });
    return session;
  }

  public async getSessionStatus(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }

  public verifyWebhookSignature(payload: any, sig: string) {
    const endpointSecret = this.configuration.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = Stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      return { status: true, res: event };
    } catch (err) {
      return { status: false, res: err };
    }
  }

  public async handleCheckoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    const checkoutId = event.data.object.id;
    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      },
    );
    const lineItems = sessionWithLineItems.line_items;

    console.log("fulfilling order...");
    this.fulfillOrder(lineItems, checkoutId);
  }

  private popSession(sessionId: string) {
    const userId = this.sessions[sessionId];
    this.sessions = [];
    return userId;
  }

  private async fulfillOrder(lineItems: any, checkoutId: string) {
    const userId = this.popSession(checkoutId);
    const priceIds = lineItems.data.map((lineItem) => lineItem.price.id);
    const materials = await this.materialFinderService.findByStripePriceIds(priceIds);
    await this.userService.addMaterials(materials, userId);
    for (const material of materials) {
      this.commonCartService.removeItem(userId, material.id);
    }
  }
}
