import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Booking } from "../../bookings/entities/booking.entity";
import { Service } from "../../services/entities/service.entity";
import { Review } from "../../reviews/entities/review.entity";

export enum WorkerStatus {
  PENDING = "pending",
  APPROVED = "approved",
  SUSPENDED = "suspended",
  REJECTED = "rejected",
}

@Entity("workers")
export class Worker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.workerProfile)
  @JoinColumn()
  user: User;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  hourlyRate: number;

  @Column({ type: "json", nullable: true })
  availability: {
    [day: string]: { start: string; end: string; available: boolean };
  };

  @Column({ type: "json", nullable: true })
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: "int", default: 0 })
  totalReviews: number;

  @Column({ type: "int", default: 0 })
  completedJobs: number;

  @Column({
    type: "enum",
    enum: WorkerStatus,
    default: WorkerStatus.PENDING,
  })
  status: WorkerStatus;

  @Column({ type: "json", nullable: true })
  certifications: string[];

  @Column({ type: "json", nullable: true })
  portfolio: { title: string; description: string; imageUrl: string }[];

  @Column({ type: "boolean", default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Booking, (booking) => booking.worker)
  bookings: Booking[];

  @ManyToMany(() => Service, (service) => service.workers)
  @JoinTable()
  services: Service[];

  @OneToMany(() => Review, (review) => review.worker)
  reviews: Review[];
}
