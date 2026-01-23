export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED'
}

export enum RoleName {
  USER = 'USER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userStatus: UserStatus | string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}