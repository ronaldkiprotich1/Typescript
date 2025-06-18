import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { ReservationTable, CustomerTable, CarTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let reservationId: number;
let customerId: number;
let carId: number;

beforeAll(async () => {
  try {
    // Clean up and seed required data
    await db.delete(ReservationTable);
    await db.delete(CustomerTable);
    await db.delete(CarTable);

    // Insert customer with error handling
    const customers = await db
      .insert(CustomerTable)
      .values({
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        // Add other required fields if they exist in your schema
        // phoneNumber: "1234567890",
        // address: "123 Test St"
      })
      .returning();
    
    if (!customers || customers.length === 0) {
      throw new Error("Failed to create customer");
    }
    customerId = customers[0].customerID;
    console.log("Created customer with ID:", customerId);

    // Insert car with error handling
    const cars = await db
      .insert(CarTable)
      .values({
        carModel: "Toyota",
        year: "2022-01-01", // Make sure this matches your schema type
        rentalRate: "100.00", // Make sure this matches your schema type
        // Add other required fields if they exist
        // availability: true,
        // location: "Test Location"
      })
      .returning();
    
    if (!cars || cars.length === 0) {
      throw new Error("Failed to create car");
    }
    carId = cars[0].carID;
    console.log("Created car with ID:", carId);

  } catch (error) {
    console.error("Setup error:", error);
    throw error;
  }
}, 30000); // Increase timeout for setup

afterAll(async () => {
  try {
    await db.delete(ReservationTable);
    await db.delete(CustomerTable);
    await db.delete(CarTable);
  } catch (error) {
    console.error("Cleanup error:", error);
  }
});

describe("Reservation Routes Integration", () => {
  test("Create a reservation", async () => {
    console.log("Testing with customerID:", customerId, "carID:", carId);
    
    const reservationData = {
      customerID: customerId,
      carID: carId,
      reservationDate: "2025-06-15",
      pickupDate: "2025-06-20",
      returnDate: "2025-06-25",
    };
    
    const res = await request(app)
      .post("/reservation")
      .send(reservationData);
    
    console.log("Create reservation response:", res.status, res.body);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("reservationID");
    reservationId = res.body.reservationID;
  }, 10000);

  test("Get all reservations", async () => {
    const res = await request(app).get("/reservation");
    console.log("Get all reservations response:", res.status, res.body);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Get reservation by ID", async () => {
    const res = await request(app).get(`/reservation/${reservationId}`);
    console.log("Get reservation by ID response:", res.status, res.body);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reservationID", reservationId);
  });

  test("Update reservation by ID", async () => {
    const updateData = {
      reservationDate: "2025-06-16",
      pickupDate: "2025-06-21",
      returnDate: "2025-06-26",
    };
    
    const res = await request(app)
      .put(`/reservation/${reservationId}`)
      .send(updateData);
    
    console.log("Update reservation response:", res.status, res.body);
    
    expect(res.status).toBe(200);
    const updated = Array.isArray(res.body) ? res.body[0] : res.body;
    expect(updated).toHaveProperty("reservationDate");
    const date = new Date(updated.reservationDate);
    expect(date.toISOString().startsWith("2025-06-16")).toBe(true);
  });

  test("Delete reservation by ID", async () => {
    const res = await request(app).delete(`/reservation/${reservationId}`);
    console.log("Delete reservation response:", res.status, res.body);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Reservation deleted successfully");
  });

  test("Get non-existent reservation by ID", async () => {
    const res = await request(app).get(`/reservation/99999`);
    console.log("Get non-existent reservation response:", res.status, res.body);
    
    expect(res.status).toBe(404);
  });

  test("Update non-existent reservation", async () => {
    const res = await request(app).put(`/reservation/99999`).send({
      reservationDate: "2025-06-16",
    });
    console.log("Update non-existent reservation response:", res.status, res.body);
    
    expect(res.status).toBe(404);
  });

  test("Delete non-existent reservation", async () => {
    const res = await request(app).delete(`/reservation/99999`);
    console.log("Delete non-existent reservation response:", res.status, res.body);
    
    expect(res.status).toBe(404);
  });

  test("Invalid reservation ID format", async () => {
    const res = await request(app).get(`/reservation/invalid`);
    console.log("Invalid ID format response:", res.status, res.body);
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid reservation ID");
  });
});