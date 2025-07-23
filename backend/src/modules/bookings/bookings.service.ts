import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { User } from '../users/entities/user.entity';
import { Worker } from '../workers/entities/worker.entity';
import { Service } from '../services/entities/service.entity';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private paymentsService: PaymentsService,
    private notificationsService: NotificationsService,
  ) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    const {
      workerId,
      serviceId,
      scheduledDate,
      description,
      customerLocation,
      additionalRequirements,
    } = createBookingDto;

    // Validate worker exists and is available
    const worker = await this.workerRepository.findOne({
      where: { id: workerId, isAvailable: true, status: 'approved' },
      relations: ['user'],
    });

    if (!worker) {
      throw new NotFoundException('Worker not found or not available');
    }

    // Validate service exists
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Check if worker provides this service
    const workerServices = await this.workerRepository
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.services', 'service')
      .where('worker.id = :workerId', { workerId })
      .andWhere('service.id = :serviceId', { serviceId })
      .getOne();

    if (!workerServices) {
      throw new BadRequestException('Worker does not provide this service');
    }

    // Check for scheduling conflicts
    const conflictingBooking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.workerId = :workerId', { workerId })
      .andWhere('booking.scheduledDate = :scheduledDate', { scheduledDate })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
      })
      .getOne();

    if (conflictingBooking) {
      throw new BadRequestException('Worker is not available at the requested time');
    }

    // Calculate total amount
    const totalAmount = worker.hourlyRate * (service.estimatedDuration / 60);

    // Create booking
    const booking = this.bookingRepository.create({
      customer: { id: userId } as User,
      worker,
      service,
      description,
      scheduledDate: new Date(scheduledDate),
      estimatedDuration: service.estimatedDuration,
      totalAmount,
      customerLocation,
      additionalRequirements,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Send notifications
    await this.notificationsService.sendBookingNotification(
      savedBooking.id,
      'booking_created',
    );

    return savedBooking;
  }

  async getBookingsByUser(userId: string, role: string) {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.worker', 'worker')
      .leftJoinAndSelect('worker.user', 'workerUser')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.payment', 'payment');

    if (role === 'customer') {
      queryBuilder.where('customer.id = :userId', { userId });
    } else if (role === 'worker') {
      queryBuilder
        .leftJoin('worker.user', 'user')
        .where('user.id = :userId', { userId });
    }

    return queryBuilder
      .orderBy('booking.scheduledDate', 'DESC')
      .getMany();
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.worker', 'worker')
      .leftJoinAndSelect('worker.user', 'workerUser')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.payment', 'payment')
      .where('booking.id = :id', { id })
      .getOne();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user has permission to view this booking
    if (
      booking.customer.id !== userId &&
      booking.worker.user.id !== userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async updateBookingStatus(
    id: string,
    userId: string,
    updateBookingDto: UpdateBookingDto,
  ) {
    const { status } = updateBookingDto;

    const booking = await this.getBookingById(id, userId);

    // Validate status transition
    const validTransitions = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
      [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      throw new BadRequestException(`Cannot change status from ${booking.status} to ${status}`);
    }

    // Update booking
    const updatedBooking = await this.bookingRepository.save({
      ...booking,
      status,
      startedAt: status === BookingStatus.IN_PROGRESS ? new Date() : booking.startedAt,
      completedAt: status === BookingStatus.COMPLETED ? new Date() : booking.completedAt,
    });

    // Handle payment processing for completed bookings
    if (status === BookingStatus.COMPLETED) {
      await this.paymentsService.processPayment(booking.id);
    }

    // Send notifications
    await this.notificationsService.sendBookingNotification(
      booking.id,
      `booking_${status}`,
    );

    return updatedBooking;
  }

  async cancelBooking(id: string, userId: string, reason: string) {
    const booking = await this.getBookingById(id, userId);

    if (![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel booking in current status');
    }

    const updatedBooking = await this.bookingRepository.save({
      ...booking,
      status: BookingStatus.CANCELLED,
      cancellationReason: reason,
    });

    // Handle refund if payment was already processed
    if (booking.payment) {
      await this.paymentsService.processRefund(booking.payment.id);
    }

    // Send notifications
    await this.notificationsService.sendBookingNotification(
      booking.id,
      'booking_cancelled',
    );

    return updatedBooking;
  }
}