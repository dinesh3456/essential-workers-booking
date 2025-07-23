import { User } from "./user.types";
import { Worker } from "./worker.types";

export interface Booking {
  id: string;
  clientId: string;
  workerId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: {
    start: string;
    end: string;
  };
  duration: number; // minutes
  totalAmount: number;
  paymentStatus: PaymentStatus;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client: User;
  worker: Worker;
  service: {
    id: string;
    name: string;
    description: string;
  };
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface CreateBookingRequest {
  workerId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: {
    start: string;
    end: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
}

export interface BookingSearchFilters {
  status?: BookingStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  workerId?: string;
  clientId?: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}
