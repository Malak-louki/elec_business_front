export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentRequest {
  bookingId: string;
  paymentMethod?: string;
  simulateSuccess?: boolean;
}

export interface PaymentResponse {
  id: string;
  stripePaymentIntentId: string;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  bookingId: string;
  bookingStatus: string;
}