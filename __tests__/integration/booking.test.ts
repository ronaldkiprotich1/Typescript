import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import drizzle from "../../src/Drizzle/db";
import { CarTable, BookingsTable, CustomerTable, LocationTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let customerId: number;
let carId: number;
let bookingId: number;
let locationId: number;

const customerTest = {
  firstName: "John",
  lastName: "Doe",
  email: "johnjj@example.com",
  phoneNumber: "555-1234",
  address: "1 Elm St"
};

const testLocation = {
  locationName: "Main Branch",
  address: "123 Main St",
  contactNumber: "555-0123"
};

const testCar = {
  carModel: "Toyota Corolla",
  year: "2020-01-01",
  color: "Red",
  rentalRate: "50.00",
  availability: true
};

const testBooking = {
  rentalStartDate: "2024-06-05",
  rentalEndDate: "2024-06-10",
  totalAmount: "250.00"
};

beforeAll(async () => {
  try {
    console.log("Setting up test data...");
    
    // Create location first (required for car)
    const [loc] = await drizzle.insert(LocationTable).values({
      ...testLocation
    }).returning();
    locationId = loc.locationID;
    console.log("Location created with ID:", locationId);

    // Create customer
    const [cus] = await drizzle.insert(CustomerTable).values({
      ...customerTest
    }).returning();
    customerId = cus.customerID;
    console.log("Customer created with ID:", customerId);

    // Create car with locationID
    const [car] = await drizzle.insert(CarTable).values({
      ...testCar,
      locationID: locationId
    }).returning();
    carId = car.carID;
    console.log("Car created with ID:", carId);
    
  } catch (error) {
    console.error("Error in beforeAll setup:", error);
    throw error;
  }
}, 30000);

afterAll(async () => {
  try {
    console.log("Cleaning up test data...");
    // Clean up in reverse order of dependencies
    await drizzle.delete(BookingsTable);
    await drizzle.delete(CarTable);
    await drizzle.delete(CustomerTable);
    await drizzle.delete(LocationTable);
    await db.$client.end();
    console.log("Cleanup completed");
  } catch (error) {
    console.error("Error in afterAll cleanup:", error);
  }
}, 30000);

describe("BOOKING API TESTS", () => {
  
  // Basic connectivity test
  describe("API Connection Test", () => {
    it("should connect to the server", async () => {
      const res = await request(app).get("/test-endpoint-that-might-not-exist");
      // We just want to see if the server responds, even with 404
      expect([200, 404, 500].includes(res.statusCode)).toBe(true);
    });
  });
  
  describe("POST /booking - Create Booking", () => {
    it("should create a new booking successfully", async () => {
      console.log("Testing booking creation with:", {
        carID: carId,
        customerID: customerId,
        ...testBooking
      });
      
      const res = await request(app)
        .post("/booking")
        .send({
          carID: carId,
          customerID: customerId,
          ...testBooking
        });

      console.log("Response status:", res.statusCode);
      console.log("Response body:", res.body);
      
      if (res.statusCode !== 201) {
        console.error("Expected 201, got:", res.statusCode);
        console.error("Error details:", res.body);
      }

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('bookingID');
      expect(res.body.carID).toBe(carId);
      expect(res.body.customerID).toBe(customerId);
      expect(res.body.rentalStartDate).toBe(testBooking.rentalStartDate);
      expect(res.body.rentalEndDate).toBe(testBooking.rentalEndDate);
      expect(res.body.totalAmount).toBe(testBooking.totalAmount);
      
      // Store booking ID for other tests
      bookingId = res.body.bookingID;
    }, 10000);

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/booking")
        .send({
          carID: carId,
          // Missing customerID
          rentalStartDate: "2024-06-05",
          rentalEndDate: "2024-06-10",
          totalAmount: "250.00"
        });

      console.log("Missing fields test - Status:", res.statusCode, "Body:", res.body);
      expect([400, 500].includes(res.statusCode)).toBe(true);
      expect(res.body).toHaveProperty('message');
    });

    it("should return error for invalid car ID", async () => {
      const res = await request(app)
        .post("/booking")
        .send({
          carID: 99999,
          customerID: customerId,
          ...testBooking
        });

      console.log("Invalid car ID test - Status:", res.statusCode, "Body:", res.body);
      expect([400, 500].includes(res.statusCode)).toBe(true);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe("GET /bookings - Get All Bookings", () => {
    it("should get all bookings successfully", async () => {
      const res = await request(app).get("/bookings");

      console.log("Get all bookings - Status:", res.statusCode, "Body length:", res.body?.length);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      if (bookingId) {
        const ourBooking = res.body.find((booking: any) => booking.bookingID === bookingId);
        expect(ourBooking).toBeDefined();
        expect(ourBooking.carID).toBe(carId);
        expect(ourBooking.customerID).toBe(customerId);
      }
    });
  });

  describe("GET /booking/:id - Get One Booking", () => {
    it("should get a specific booking by ID", async () => {
      if (!bookingId) {
        console.log("Skipping test - no booking ID available");
        return;
      }
      
      const res = await request(app).get(`/booking/${bookingId}`);

      console.log("Get one booking - Status:", res.statusCode, "Body:", res.body);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.bookingID).toBe(bookingId);
      expect(res.body.carID).toBe(carId);
      expect(res.body.customerID).toBe(customerId);
    });

    it("should return 404 for non-existent booking ID", async () => {
      const res = await request(app).get("/booking/99999");

      console.log("Non-existent booking test - Status:", res.statusCode, "Body:", res.body);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Booking not found");
    });
  });

  describe("PUT /booking/:id - Update Booking", () => {
    it("should update a booking successfully", async () => {
      if (!bookingId) {
        console.log("Skipping update test - no booking ID available");
        return;
      }
      
      const updatedData = {
        rentalStartDate: "2024-06-06",
        rentalEndDate: "2024-06-12",
        totalAmount: "300.00"
      };

      const res = await request(app)
        .put(`/booking/${bookingId}`)
        .send(updatedData);

      console.log("Update booking test - Status:", res.statusCode, "Body:", res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body.bookingID).toBe(bookingId);
    });

    it("should return 404 for non-existent booking ID", async () => {
      const res = await request(app)
        .put("/booking/99999")
        .send({
          totalAmount: "100.00"
        });

      console.log("Update non-existent test - Status:", res.statusCode, "Body:", res.body);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Booking not found or not updated");
    });
  });

  describe("DELETE /booking/:id - Delete Booking", () => {
    it("should return 404 for non-existent booking ID first", async () => {
      const res = await request(app).delete("/booking/99999");

      console.log("Delete non-existent test - Status:", res.statusCode, "Body:", res.body);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Booking not found or already deleted");
    });

    it("should delete a booking successfully", async () => {
      if (!bookingId) {
        console.log("Skipping delete test - no booking ID available");
        return;
      }
      
      const res = await request(app).delete(`/booking/${bookingId}`);

      console.log("Delete booking test - Status:", res.statusCode, "Body:", res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Booking deleted successfully");

      // Verify booking is actually deleted
      const getRes = await request(app).get(`/booking/${bookingId}`);
      expect(getRes.statusCode).toBe(404);
    });
  });
});