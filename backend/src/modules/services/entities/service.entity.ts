import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ default: 60 })
    durationMinutes: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    categoryId: string;

    @Column({ nullable: true })
    imageUrl: string;

    @OneToMany(() => Booking, booking => booking.service)
    bookings: Booking[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}