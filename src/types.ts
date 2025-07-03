 import {
  CustomerTable,
  LocationTable,
  CarTable,
  ReservationTable,
  BookingsTable,
  PaymentTable,
  MaintenanceTable,
  InsuranceTable
} from "./Drizzle/schema";

// INSERT TYPES
export type TICustomer = typeof CustomerTable.$inferInsert;
export type TILocation = typeof LocationTable.$inferInsert;
export type TICar = typeof CarTable.$inferInsert;
export type TIReservation = typeof ReservationTable.$inferInsert;
export type TIBooking = typeof BookingsTable.$inferInsert;
export type TIPayment = typeof PaymentTable.$inferInsert;
export type TIMaintenance = typeof MaintenanceTable.$inferInsert;
export type TIInsurance = typeof InsuranceTable.$inferInsert;

// SELECT TYPES
export type TSCustomer = typeof CustomerTable.$inferSelect;
export type TSLocation = typeof LocationTable.$inferSelect;
export type TSCar = typeof CarTable.$inferSelect;
export type TSReservation = typeof ReservationTable.$inferSelect;
export type TSBooking = typeof BookingsTable.$inferSelect;
export type TSPayment = typeof PaymentTable.$inferSelect;
export type TSMaintenance = typeof MaintenanceTable.$inferSelect;
export type TSInsurance = typeof InsuranceTable.$inferSelect;
