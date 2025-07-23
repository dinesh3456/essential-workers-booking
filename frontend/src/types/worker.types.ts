import { User } from "./user.types";

export interface Worker extends User {
  services: string[];
  hourlyRate: number;
  availability: {
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
    timeSlots: {
      start: string; // "09:00"
      end: string; // "17:00"
    }[];
  };
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
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  certifications?: string[];
  experience: number; // years
  description: string;
}

export interface WorkerService {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  duration: number; // minutes
}

export interface WorkerReview {
  id: string;
  clientId: string;
  workerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface WorkerSearchFilters {
  services?: string[];
  location?: string;
  radius?: number; // miles
  minRating?: number;
  maxHourlyRate?: number;
  availability?: {
    date: string;
    timeSlot?: {
      start: string;
      end: string;
    };
  };
}
