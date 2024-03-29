import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post()
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: { priceId: string },
  ): Promise<Stripe.Checkout.Session> {
    return this.stripeService.createCheckoutSession(createCheckoutSessionDto);
  }

  @Get('/session-status')
  async getSessionStatus(
    @Query('session_id') sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripeService.getSessionStatus(sessionId);
    return session;
  }

  @Post('/webhook')
  async stripeWebhook(
    @Res() response: Response,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<any> {
    const payload = req.rawBody;
    const sig = req.headers['stripe-signature'] as string;

    const res = this.stripeService.verifyWebhookSignature(payload, sig);
    if (res.status !== true) {
      return response.status(400).send(`Webhook Error: ${res.res.message}`);
    }

    if (res.res.type === 'checkout.session.completed') {
      this.stripeService.handleCheckoutSessionCompleted(res.res);
    }

    return response.status(200).end();
  }
}
