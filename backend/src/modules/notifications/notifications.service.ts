import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sgMail from '@sendgrid/mail';
import { Twilio } from 'twilio';

import { Notification, NotificationType } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class NotificationsService {
  private twilioClient: Twilio;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {
    // Initialize SendGrid
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));

    // Initialize Twilio
    this.twilioClient = new Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendBookingNotification(bookingId: string, eventType: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['customer', 'worker', 'worker.user', 'service'],
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const notifications = this.getNotificationTemplates(eventType, booking);

    // Send to customer
    await this.sendNotification(
      booking.customer,
      notifications.customer,
      NotificationType.BOOKING_UPDATE,
    );

    // Send to worker
    await this.sendNotification(
      booking.worker.user,
      notifications.worker,
      NotificationType.BOOKING_UPDATE,
    );
  }

  async sendNotification(
    user: User,
    content: { title: string; message: string; emailContent?: string },
    type: NotificationType,
  ) {
    // Save notification to database
    const notification = this.notificationRepository.create({
      user,
      title: content.title,
      message: content.message,
      type,
    });

    await this.notificationRepository.save(notification);

    // Send email notification
    if (user.email && content.emailContent) {
      await this.sendEmail(user.email, content.title, content.emailContent);
    }

    // Send SMS notification (if phone number is verified)
    if (user.phoneNumber && user.isPhoneVerified) {
      await this.sendSMS(user.phoneNumber, content.message);
    }

    // Send push notification (implementation depends on your push service)
    await this.sendPushNotification(user.id, content.title, content.message);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const msg = {
        to,
        from: this.configService.get('FROM_EMAIL'),
        subject,
        html,
      };

      await sgMail.send(msg);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }

  private async sendSMS(to: string, body: string) {
    try {
      await this.twilioClient.messages.create({
        body,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to,
      });
    } catch (error) {
      console.error('SMS sending failed:', error);
    }
  }

  private async sendPushNotification(userId: string, title: string, body: string) {
    // Implementation depends on your push notification service (FCM, APNs, etc.)
    // This is a placeholder for push notification logic
    console.log(`Push notification to user ${userId}: ${title} - ${body}`);
  }

  private getNotificationTemplates(eventType: string, booking: Booking) {
    const templates = {
      booking_created: {
        customer: {
          title: 'Booking Confirmed',
          message: `Your booking for ${booking.service.name} has been created and is pending worker confirmation.`,
          emailContent: this.getBookingCreatedEmailTemplate(booking, 'customer'),
        },
        worker: {
          title: 'New Booking Request',
          message: `You have a new booking request for ${booking.service.name}.`,
          emailContent: this.getBookingCreatedEmailTemplate(booking, 'worker'),
        },
      },
      booking_confirmed: {
        customer: {
          title: 'Booking Confirmed',
          message: `Your booking for ${booking.service.name} has been confirmed by the worker.`,
          emailContent: this.getBookingConfirmedEmailTemplate(booking),
        },
        worker: {
          title: 'Booking Confirmed',
          message: `You confirmed the booking for ${booking.service.name}.`,
          emailContent: this.getBookingConfirmedEmailTemplate(booking),
        },
      },
      booking_cancelled: {
        customer: {
          title: 'Booking Cancelled',
          message: `Your booking for ${booking.service.name} has been cancelled.`,
          emailContent: this.getBookingCancelledEmailTemplate(booking),
        },
        worker: {
          title: 'Booking Cancelled',
          message: `The booking for ${booking.service.name} has been cancelled.`,
          emailContent: this.getBookingCancelledEmailTemplate(booking),
        },
      },
      booking_completed: {
        customer: {
          title: 'Service Completed',
          message: `Your ${booking.service.name} service has been completed. Please rate your experience.`,
          emailContent: this.getBookingCompletedEmailTemplate(booking),
        },
        worker: {
          title: 'Service Completed',
          message: `You completed the ${booking.service.name} service.`,
          emailContent: this.getBookingCompletedEmailTemplate(booking),
        },
      },
    };

    return templates[eventType] || templates.booking_created;
  }

  private getBookingCreatedEmailTemplate(booking: Booking, userType: 'customer' | 'worker'): string {
    return `
      <h2>Booking ${userType === 'customer' ? 'Created' : 'Request'}</h2>
      <p>A new booking has been ${userType === 'customer' ? 'created' : 'requested'}:</p>
      <ul>
        <li><strong>Service:</strong> ${booking.service.name}</li>
        <li><strong>Date:</strong> ${booking.scheduledDate.toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${booking.scheduledDate.toLocaleTimeString()}</li>
        <li><strong>Duration:</strong> ${booking.estimatedDuration} minutes</li>
        <li><strong>Amount:</strong> ${booking.totalAmount}</li>
        <li><strong>Location:</strong> ${booking.customerLocation.address}</li>
      </ul>
      ${userType === 'worker' ? '<p>Please confirm or decline this booking in your dashboard.</p>' : ''}
    `;
  }

  private getBookingConfirmedEmailTemplate(booking: Booking): string {
    return `
      <h2>Booking Confirmed</h2>
      <p>Your booking has been confirmed:</p>
      <ul>
        <li><strong>Service:</strong> ${booking.service.name}</li>
        <li><strong>Date:</strong> ${booking.scheduledDate.toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${booking.scheduledDate.toLocaleTimeString()}</li>
        <li><strong>Worker:</strong> ${booking.worker.user.firstName} ${booking.worker.user.lastName}</li>
      </ul>
    `;
  }

  private getBookingCancelledEmailTemplate(booking: Booking): string {
    return `
      <h2>Booking Cancelled</h2>
      <p>Your booking has been cancelled:</p>
      <ul>
        <li><strong>Service:</strong> ${booking.service.name}</li>
        <li><strong>Date:</strong> ${booking.scheduledDate.toLocaleDateString()}</li>
        <li><strong>Reason:</strong> ${booking.cancellationReason || 'Not specified'}</li>
      </ul>
      <p>Any payments will be refunded within 3-5 business days.</p>
    `;
  }

  private getBookingCompletedEmailTemplate(booking: Booking): string {
    return `
      <h2>Service Completed</h2>
      <p>Your service has been completed:</p>
      <ul>
        <li><strong>Service:</strong> ${booking.service.name}</li>
        <li><strong>Worker:</strong> ${booking.worker.user.firstName} ${booking.worker.user.lastName}</li>
        <li><strong>Completed:</strong> ${booking.completedAt?.toLocaleString()}</li>
      </ul>
      <p>Please rate your experience to help us improve our service.</p>
    `;
  }
}