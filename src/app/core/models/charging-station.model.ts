export enum StationStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum PowerType {
  AC = 'AC',
  DC = 'DC'
}

export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  powerType: PowerType;
  maxPower: number;
  pricePerHour: number;
  stationStatus: StationStatus;
  ownerId: string;
  ownerName?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChargingStationRequest {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  powerType: PowerType;
  maxPower: number;
  pricePerHour: number;
  description?: string;
}

export interface ChargingStationResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  powerType: string;
  maxPower: number;
  pricePerHour: number;
  stationStatus: string;
  ownerId: string;
  ownerName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}