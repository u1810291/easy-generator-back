export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  status: UserStatus
  createDate: Date
  updatedDate: Date
  lastLogin: Date
  hashRefreshToken: string
}

export class UserM extends User {
  password: string
}
