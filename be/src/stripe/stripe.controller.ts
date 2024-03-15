import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post()
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: { priceId: string; },
  ): Promise<Stripe.Checkout.Session> {
    return this.stripeService.createCheckoutSession(createCheckoutSessionDto);
  }
}
