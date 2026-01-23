// dashboard.model.ts

export interface OwnerDashboardStats {
  totalStations: number;
  availableStations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  upcomingBookings: number;
  uniqueCustomers: number;
  averageOccupancyRate: number;
  averageRevenuePerBooking: number;
}

export interface StationPerformance {
  stationId: string;
  stationName: string;
  hourlyPrice: number;
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  averageRevenuePerBooking: number;
  occupancyRate: number;
  uniqueCustomers: number;
  totalBookedHours: number;
  available: boolean;
}

export interface RevenueAnalytics {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  bookingsCount: number;
  averageDailyRevenue: number;
  averageRevenuePerBooking: number;
  dailyRevenues: DailyRevenue[];
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  bookingsCount: number;
}

export interface StationBookingHistory {
  stationId: string;
  stationName: string;
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  bookings: any[]; // BookingResponse[]
}