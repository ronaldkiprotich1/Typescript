import { relations } from "drizzle-orm";
import {
 pgTable, serial, varchar,integer,decimal,date, boolean } 
  from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
export const RoleEnum = pgEnum("role", ["admin", "user"]);
export const UsersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("firstName", { length: 50 }).notNull(),
  lastName: varchar("lastName", { length: 50 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  verificationCode: varchar("verification_code", { length: 10 }),
  role: RoleEnum("role").notNull().default("user")
});


export const CustomerTable = pgTable("customer", {
  customerID: serial("customerID").primaryKey(),
  firstName: varchar("firstName", { length: 50 }).notNull(),
  lastName: varchar("lastName", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 15 }),
  address: varchar("address", { length: 255 })
});


export const LocationTable = pgTable("location", {
  locationID: serial("LocationID").primaryKey(),
  locationName: varchar("LocationName", { length: 100 }).notNull(),
  address: varchar("Address", { length: 255 }).notNull(),
  contactNumber: varchar("ContactNumber", { length: 20 })
});


export const CarTable = pgTable("car", {
  carID: serial("CarID").primaryKey(),
  carModel: varchar("CarModel", { length: 100 }).notNull(),
  year: date("Year").notNull(),
  color: varchar("Color", { length: 30 }),
  rentalRate: decimal("RentalRate", { precision: 10, scale: 2 }).notNull(),
  availability: boolean("Availability").default(true),
  locationID: integer("LocationID").references(() => LocationTable.locationID, { onDelete: "set null" })
});

// ----------------------------
// Reservation Table
// ----------------------------
export const ReservationTable = pgTable("reservation", {
  reservationID: serial("ReservationID").primaryKey(),
  customerID: integer("CustomerID").notNull().references(() => CustomerTable.customerID, { onDelete: "cascade" }),
  carID: integer("CarID").notNull().references(() => CarTable.carID, { onDelete: "cascade" }),
  reservationDate: date("ReservationDate").notNull(),
  pickupDate: date("PickupDate").notNull(),
  returnDate: date("ReturnDate")
});

// ----------------------------
// Bookings Table
// ----------------------------
export const BookingsTable = pgTable("bookings", {
  bookingID: serial("BookingID").primaryKey(),
  carID: integer("CarID").notNull().references(() => CarTable.carID, { onDelete: "cascade" }),
  customerID: integer("CustomerID").notNull().references(() => CustomerTable.customerID, { onDelete: "cascade" }),
  rentalStartDate: date("RentalStartDate").notNull(),
  rentalEndDate: date("RentalEndDate").notNull(),
  totalAmount: decimal("TotalAmount", { precision: 10, scale: 2 }).notNull()
});

// ----------------------------
// Payment Table
// ----------------------------
export const PaymentTable = pgTable("payment", {
  paymentID: serial("PaymentID").primaryKey(),
  bookingID: integer("BookingID").notNull().references(() => BookingsTable.bookingID, { onDelete: "cascade" }),
  paymentDate: date("PaymentDate").notNull(),
  amount: decimal("Amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("PaymentMethod", { length: 50 })
});

// ----------------------------
// Maintenance Table
// ----------------------------
export const MaintenanceTable = pgTable("maintenance", {
  maintenanceID: serial("MaintenanceID").primaryKey(),
  carID: integer("CarID").notNull().references(() => CarTable.carID, { onDelete: "cascade" }),
  maintenanceDate: date("MaintenanceDate").notNull(),
  description: varchar("Description", { length: 255 }),
  cost: decimal("Cost", { precision: 10, scale: 2 })
});

// ----------------------------
// Insurance Table
// ----------------------------
export const InsuranceTable = pgTable("insurance", {
  insuranceID: serial("InsuranceID").primaryKey(),
  carID: integer("CarID").notNull().references(() => CarTable.carID, { onDelete: "cascade" }),
  insuranceProvider: varchar("InsuranceProvider", { length: 100 }).notNull(),
  policyNumber: varchar("PolicyNumber", { length: 50 }).notNull(),
  startDate: date("StartDate").notNull(),
  endDate: date("EndDate")
});

// ----------------------------
// RELATIONSHIPS
// ----------------------------

export const CustomerRelations = relations(CustomerTable, ({ many }) => ({
  reservations: many(ReservationTable),
  bookings: many(BookingsTable)
}));

export const LocationRelationships = relations(LocationTable, ({ many }) => ({
  cars: many(CarTable)
}));

export const CarRelations = relations(CarTable, ({ many, one }) => ({
  location: one(LocationTable, {
    fields: [CarTable.locationID],
    references: [LocationTable.locationID]
  }),
  reservations: many(ReservationTable),
  bookings: many(BookingsTable),
  maintenanceRecords: many(MaintenanceTable),
  insurancePolicies: many(InsuranceTable)
}));

export const ReservationRelations = relations(ReservationTable, ({ one }) => ({
  customer: one(CustomerTable, {
    fields: [ReservationTable.customerID],
    references: [CustomerTable.customerID]
  }),
  car: one(CarTable, {
    fields: [ReservationTable.carID],
    references: [CarTable.carID]
  })
}));

export const BookingsRelations = relations(BookingsTable, ({ one, many }) => ({
  customer: one(CustomerTable, {
    fields: [BookingsTable.customerID],
    references: [CustomerTable.customerID]
  }),
  car: one(CarTable, {
    fields: [BookingsTable.carID],
    references: [CarTable.carID]
  }),
  payments: many(PaymentTable)
}));

export const PaymentRelations = relations(PaymentTable, ({ one }) => ({
  booking: one(BookingsTable, {
    fields: [PaymentTable.bookingID],
    references: [BookingsTable.bookingID]
  })
}));

export const MaintenanceRelations = relations(MaintenanceTable, ({ one }) => ({
  car: one(CarTable, {
    fields: [MaintenanceTable.carID],
    references: [CarTable.carID]
  })
}));

export const InsuranceRelations = relations(InsuranceTable, ({ one }) => ({
  car: one(CarTable, {
    fields: [InsuranceTable.carID],
    references: [CarTable.carID]
  })
}));

// ----------------------------
// TYPES
// ----------------------------

export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TICustomer = typeof CustomerTable.$inferInsert;
export type TSCustomer = typeof CustomerTable.$inferSelect;

export type TILocation = typeof LocationTable.$inferInsert;
export type TSLocation = typeof LocationTable.$inferSelect;

export type TICar = typeof CarTable.$inferInsert;
export type TSCar = typeof CarTable.$inferSelect;

export type TIReservation = typeof ReservationTable.$inferInsert;
export type TSReservation = typeof ReservationTable.$inferSelect;

export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;

export type TIPayment = typeof PaymentTable.$inferInsert;
export type TSPayment = typeof PaymentTable.$inferSelect;

export type TIMaintenance = typeof MaintenanceTable.$inferInsert;
export type TSMaintenance = typeof MaintenanceTable.$inferSelect;

export type TIInsurance = typeof InsuranceTable.$inferInsert;
export type TSInsurance = typeof InsuranceTable.$inferSelect;
