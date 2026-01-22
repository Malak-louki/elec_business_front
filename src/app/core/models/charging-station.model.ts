export interface ChargingStation {
  id: string;
  name: string;
  hourlyPrice: number;
  chargingPowerKw: number;
  chargingPower: string;
  instruction?: string;
  hasStand?: boolean;
  mediaUrl?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
  address: Address;
  location: Location;
  availabilities?: Availability[];
  owner?: OwnerInfo;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Availability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface OwnerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface ChargingStationRequest {
  name: string;
  hourlyPrice: number;
  chargingPowerKw: number;
  instruction?: string;
  hasStand?: boolean;
  mediaUrl?: string;
  address: Address;
  location: Location;
  availabilities?: Availability[];
}

export interface ChargingStationResponse {
  id: string;
  name: string;
  hourlyPrice: number;
  chargingPowerKw: number;
  chargingPower: string;
  instruction?: string;
  hasStand?: boolean;
  mediaUrl?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  address: Address;
  location: Location;
  availabilities?: Availability[];
  owner?: OwnerInfo;
}