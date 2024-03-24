export enum UserType {
  ADMIN = 1,
  USER = 2,
}

export const BCRYPT_HASH_ROUND = 10;

export enum OrderStatus {
  PLACED = 1,
  PENDING,
  ACCEPTED,
  ONGOING,
  DELIVERED,
  CANCELLED_BY_CUSTOMER,
  CANCELLED_BY_DRIVER,
  CANCELLED_BY_ADMIN,
}
