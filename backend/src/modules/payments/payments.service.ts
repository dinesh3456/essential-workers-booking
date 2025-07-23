import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';

import { Payment, PaymentStatus } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CreatePaymentIntentDto, ProcessPaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const { bookingId, amountasync createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
const { bookingId, amount, currency = 'usd' } = createPaymentIntentDto;
// Validate booking exists
const booking = await this.bookingRepository.findOne({
  where: { id: bookingId },
  relations: ['customer', 'worker', 'service'],
});

if (!booking) {
  throw new BadRequestException('Booking not found');
}

try {
  // Create Stripe PaymentIntent
  const paymentIntent = await this.stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata: {
      bookingId,
      customerId: booking.customer.id,
      workerId: booking.worker.id,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // Save payment record
  const payment = this.paymentRepository.create({
    booking,
    stripePaymentIntentId: paymentIntent.id,
    amount,
    currency,
    status: PaymentStatus.PENDING,
  });

  await this.paymentRepository.save(payment);

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
} catch (error) {
  throw new BadRequestException(`Payment intent creation failed: ${error.message}`);
}
}
async processPayment(bookingId: string) {
const payment = await this.paymentRepository.findOne({
where: { booking: { id: bookingId } },
relations: ['booking'],
});
if (!payment) {
  throw new BadRequestException('Payment not found for booking');
}

try {
  const paymentIntent = await this.stripe.paymentIntents.retrieve(
    payment.stripePaymentIntentId,
  );

  if (paymentIntent.status === 'succeeded') {
    await this.paymentRepository.update(payment.id, {
      status: PaymentStatus.COMPLETED,
      processedAt: new Date(),
    });

    return { success: true, message: 'Payment processed successfully' };
  } else {
    throw new BadRequestException('Payment not completed');
  }
} catch (error) {
  await this.paymentRepository.update(payment.id, {
    status: PaymentStatus.FAILED,
  });
  throw new BadRequestException(`Payment processing failed: ${error.message}`);
}
}
async processRefund(paymentId: string) {
const payment = await this.paymentRepository.findOne({
where: { id: paymentId },
});
if (!payment || payment.status !== PaymentStatus.COMPLETED) {
  throw new BadRequestException('Invalid payment for refund');
}

try {
  const refund = await this.stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
  });

  await this.paymentRepository.update(payment.id, {
    status: PaymentStatus.REFUNDED,
    refundedAt: new Date(),
  });

  return { success: true, refundId: refund.id };
} catch (error) {
  throw new BadRequestException(`Refund processing failed: ${error.message}`);
}
}
async handleWebhook(signature: string, payload: Buffer) {
const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
try {
  const event = this.stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret,
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
} catch (error) {
  throw new BadRequestException(`Webhook signature verification failed: ${error.message}`);
}
}
private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
const payment = await this.paymentRepository.findOne({
where: { stripePaymentIntentId: paymentIntent.id },
});
if (payment) {
  await this.paymentRepository.update(payment.id, {
    status: PaymentStatus.COMPLETED,
    processedAt: new Date(),
  });
}
}
private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
const payment = await this.paymentRepository.findOne({
where: { stripePaymentIntentId: paymentIntent.id },
});
if (payment) {
  await this.paymentRepository.update(payment.id, {
    status: PaymentStatus.FAILED,
  });
}
}
}