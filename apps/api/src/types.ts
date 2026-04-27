export type PaymentType = "rent" | "dues";

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  role: UserRole;
};
