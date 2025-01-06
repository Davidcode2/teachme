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
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get('/session-status')
  async getSessionStatus(
    @Query('session_id') sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    const session: Stripe.Checkout.Session =
      await this.stripeService.getSessionStatus(sessionId);
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
      console.log('Checkout session completed');
      this.stripeService.handleCheckoutSessionCompleted(res.res);
    }

    return response.status(200).end();
  }
}
