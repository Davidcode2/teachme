import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Material } from 'src/materials/materials.entity';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripeTest: string;
  private stripe = null;

  constructor(
    private configuration: ConfigService,
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

  public async createCheckoutSession(price) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancelled`,
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
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      },
    );
    const lineItems = sessionWithLineItems.line_items;

    this.fulfillOrder(lineItems);
  }

  private fulfillOrder(lineItems: Stripe.LineItem[]) {
    //this.consumerService.addMaterial();
  }
}
