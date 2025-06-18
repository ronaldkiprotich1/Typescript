import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { PaymentTable, BookingsTable, CarTable, CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let bookingId: number;
let paymentId: number;
let carId: number;
let customerId: number;

beforeAll(async () => {
  // Create test customer
  const [customer] = await db.insert(CustomerTable).values({
    firstName: "Test",
    lastName: "Customer",
    email: "test.customer@example.com",
    phoneNumber: "1234567890",
    address: "123 Test St"
  }).returning();
  customerId = customer.customerID;

  // Create test car
  const [car] = await db.insert(CarTable).values({
    carModel: "Toyota Camry",
    year: "2022-01-01",
    color: "Blue",
    rentalRate: "75.00",
    availability: true,
  }).returning();
  carId = car.carID;

  // Create test booking
  const [booking] = await db.insert(BookingsTable).values({
    carID: carId,
    customerID: customerId,
    rentalStartDate: "2025-07-01",
    rentalEndDate: "2025-07-05",
    totalAmount: "300.00"
  }).returning();
  bookingId = booking.bookingID;

  // Create initial payment for testing
  const [payment] = await db.insert(PaymentTable).values({
    bookingID: bookingId,
    paymentDate: "2025-06-15",
    amount: "150.00",
    paymentMethod: "Credit Card"
  }).returning();
  paymentId = payment.paymentID;
});

afterAll(async () => {
  // Clean up in reverse order of creation
  await db.delete(PaymentTable).where(eq(PaymentTable.paymentID, paymentId));
  await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, bookingId));
  await db.delete(CarTable).where(eq(CarTable.carID, carId));
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerId));
});

describe("Payment Routes Integration Tests", () => {
  describe("POST /payment", () => {
    it("should create a new payment record", async () => {
      const res = await request(app).post("/payment").send({
        bookingID: bookingId,
        paymentDate: "2025-06-16",
        amount: "150.00",
        paymentMethod: "Credit Card"
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("paymentID");
    });

    it("should return 400 for invalid payment data", async () => {
      const res = await request(app).post("/payment").send({
        bookingID: bookingId,
        amount: "invalid-amount" // Invalid amount format
      });
      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent booking", async () => {
      const res = await request(app).post("/payment").send({
        bookingID: 999999, // Non-existent booking
        paymentDate: "2025-06-16",
        amount: "150.00",
        paymentMethod: "Credit Card"
      });
      expect(res.status).toBe(404);
    });
  });

  describe("GET /payment", () => {
    it("should retrieve all payment records", async () => {
      const res = await request(app).get("/payment");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /payment/:id", () => {
    it("should get payment by ID", async () => {
      const res = await request(app).get(`/payment/${paymentId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("paymentID", paymentId);
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app).get("/payment/abc");
      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent payment", async () => {
      const res = await request(app).get("/payment/999999");
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /payment/:id", () => {
    it("should update a payment record", async () => {
      const res = await request(app).put(`/payment/${paymentId}`).send({
        amount: "200.00",
        paymentMethod: "Bank Transfer"
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("amount", "200.00");
    });

    it("should return 404 for non-existent payment", async () => {
      const res = await request(app).put("/payment/999999").send({
        amount: "200.00"
      });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /payment/:id", () => {
    it("should delete a payment record", async () => {
      const res = await request(app).delete(`/payment/${paymentId}`);
      expect(res.status).toBe(200);
    });

    it("should return 404 for non-existent payment", async () => {
      const res = await request(app).delete("/payment/999999");
      expect(res.status).toBe(404);
    });
  });
});