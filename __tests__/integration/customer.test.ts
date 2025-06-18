import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

describe("Customer CRUD Operations Integration Tests", () => {
  let testCustomerId: number;

  // Test data
  const testCustomer = {
    firstName: "Test",
    lastName: "Customer",
    email: "test.customer@example.com",
    phoneNumber: "1234567890",
    address: "123 Test St"
  };

  const updatedCustomerData = {
    firstName: "Updated",
    lastName: "Customer",
    email: "updated.customer@example.com",
    phoneNumber: "9876543210",
    address: "456 Updated St"
  };

  beforeAll(async () => {
    // Clear any existing test data
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testCustomer.email));
    await db.delete(CustomerTable).where(eq(CustomerTable.email, updatedCustomerData.email));
  });

  afterAll(async () => {
    // Clean up any remaining test data
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testCustomer.email));
    await db.delete(CustomerTable).where(eq(CustomerTable.email, updatedCustomerData.email));
  });

  describe("Customer CRUD Operations", () => {
    it("1. CREATE - should create a new customer", async () => {
      const response = await request(app)
        .post("/customer")
        .send(testCustomer)
        .expect(201);

      expect(response.body).toHaveProperty("customerID");
      expect(response.body.firstName).toBe(testCustomer.firstName);
      expect(response.body.email).toBe(testCustomer.email);

      testCustomerId = response.body.customerID;
    });

    it("2. READ - should retrieve the created customer", async () => {
      const response = await request(app)
        .get(`/customer/${testCustomerId}`)
        .expect(200);

      expect(response.body.customerID).toBe(testCustomerId);
      expect(response.body.firstName).toBe(testCustomer.firstName);
    });

    it("3. READ ALL - should retrieve all customers (admin only)", async () => {
      const response = await request(app)
        .get("/customer")
        .set("Authorization", "Bearer admin-token") // Mock admin token
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("4. UPDATE - should update the customer", async () => {
      const response = await request(app)
        .put(`/customer/${testCustomerId}`)
        .send(updatedCustomerData)
        .expect(200);

      expect(response.body.customerID).toBe(testCustomerId);
      expect(response.body.firstName).toBe(updatedCustomerData.firstName);
      expect(response.body.email).toBe(updatedCustomerData.email);
    });

    it("5. DELETE - should delete the customer", async () => {
      // First verify the customer exists
      await request(app)
        .get(`/customer/${testCustomerId}`)
        .expect(200);

      // Delete the customer
      const deleteResponse = await request(app)
        .delete(`/customer/${testCustomerId}`)
        .expect(200);

      expect(deleteResponse.body.message).toMatch(/deleted successfully/i);

      // Verify deletion
      await request(app)
        .get(`/customer/${testCustomerId}`)
        .expect(404);
    });

    it("6. VALIDATION - should return 400 for invalid data", async () => {
      const invalidCustomer = {
        firstName: "Invalid", 
        // Missing required fields
      };

      await request(app)
        .post("/customer")
        .send(invalidCustomer)
        .expect(400);
    });

    it("7. NOT FOUND - should return 404 for non-existent customer", async () => {
      await request(app)
        .get("/customer/999999")
        .expect(404);
    });
  });
});