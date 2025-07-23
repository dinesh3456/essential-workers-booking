import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Service } from "../../services/entities/service.entity";
import { Booking } from "../../bookings/entities/booking.entity";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", default: 5 })
  rating: number;

  @Column({ type: "text" })
  comment: string;

  @ManyToOne(() => User, (user) => user.reviewsGiven, { nullable: false })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.reviewsReceived, { nullable: false })
  provider: User;

  @ManyToOne(() => Service, (service) => service.reviews, { nullable: false })
  service: Service;

  @ManyToOne(() => Booking, (booking) => booking.review, { nullable: false })
  booking: Booking;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
