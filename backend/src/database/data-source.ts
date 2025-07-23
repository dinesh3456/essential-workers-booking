import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Worker } from '../modules/workers/entities/worker.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { Service } from '../modules/services/entities/service.entity';
import { Payment } from '../modules/payments/entities/payment.entity';
import { Review } from '../modules/reviews/entities/review.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Worker, Booking, Service, Payment, Review],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
});