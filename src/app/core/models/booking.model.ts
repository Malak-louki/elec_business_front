export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface Booking {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalAmount: number;
  bookingStatus: BookingStatus;
  userId: string;
  stationId: string;
  stationName?: string;
  paymentId?: string;
  invoicePath?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingRequest {
  stationId: string;
  startDateTime: string;
  endDateTime: string;
}

export interface BookingResponse {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalAmount: number;
  bookingStatus: string;
  userId: string;
  stationId: string;
  stationName: string;
  paymentId?: string;
  invoicePath?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityRequest {
  stationId: string;
  startDateTime: string;
  endDateTime: string;
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}