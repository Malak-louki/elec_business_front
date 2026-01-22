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
  expiresAt: string;
  bookingStatus: BookingStatus;
  invoicePath?: string;
  createdAt: string;
  updatedAt: string;
  chargingStation: ChargingStationSummary;
  customer?: UserSummary;
  payment?: PaymentSummary;
}

export interface ChargingStationSummary {
  id: string;
  name: string;
  hourlyPrice: number;
  chargingPower: string;
  address: string;
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface PaymentSummary {
  id: string;
  stripePaymentIntentId?: string;
  paymentStatus: string;
}

export interface BookingRequest {
  chargingStationId: string;
  startDateTime: string;
  endDateTime: string;
  notes?: string;
}

export interface BookingResponse {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalAmount: number;
  expiresAt: string;
  bookingStatus: string;
  invoicePath?: string;
  createdAt: string;
  updatedAt: string;
  chargingStation: ChargingStationSummary;
  customer?: UserSummary;
  payment?: PaymentSummary;
}

export interface AvailabilityRequest {
  stationId: string;
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  available: boolean;
}