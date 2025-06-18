import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { InsuranceTable, CarTable, LocationTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let carId: number;
let locationId: number;
let insuranceId: number;

beforeAll(async () => {
  // First create a location since cars require locations
  const [location] = await db.insert(LocationTable).values({
    locationName: "Test Location",
    address: "123 Test St",
    contactNumber: "555-1234"
  }).returning();
  locationId = location.locationID;

  // Then create a car
  const [car] = await db.insert(CarTable).values({
    carModel: "Toyota Corolla",
    year: "2020-01-01",
    color: "Silver",
    rentalRate: "50.00",
    availability: true,
    locationID: locationId
  }).returning();
  carId = car.carID;

  // Finally create initial insurance record
  const [insurance] = await db.insert(InsuranceTable).values({
    carID: carId,
    insuranceProvider: "Test Provider",
    policyNumber: "POL-12345",
    startDate: "2023-01-01",
    endDate: "2024-01-01"
  }).returning();
  insuranceId = insurance.insuranceID;
});

afterAll(async () => {
  // Clean up in reverse order
  await db.delete(InsuranceTable).where(eq(InsuranceTable.carID, carId));
  await db.delete(CarTable).where(eq(CarTable.carID, carId));
  await db.delete(LocationTable).where(eq(LocationTable.locationID, locationId));
});

describe("Insurance Routes Integration Tests", () => {
  describe("POST /insurance", () => {
    it("should create a new insurance record", async () => {
      const res = await request(app).post("/insurance").send({
        carID: carId,
        insuranceProvider: "New Provider",
        policyNumber: "POL-67890",
        startDate: "2023-06-01",
        endDate: "2024-06-01"
      });
      expect(res.status).toBe(201);
    });

    // it("should return 500 if service throws error", async () => {
    //   const res = await request(app).post("/insurance").send({
    //     carID: null,
    //   });
    //   expect(res.status).toBe(500);
    // });
  });

  describe("GET /insurance", () => {
    it("should retrieve all insurance records", async () => {
      const res = await request(app).get("/insurance");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /insurance/:id", () => {
    it("should get insurance by ID", async () => {
      const res = await request(app).get(`/insurance/${insuranceId}`);
      expect(res.status).toBe(200);
    });

    // it("should return 400 for invalid ID", async () => {
    //   const res = await request(app).get("/insurance/abc");
    //   expect(res.status).toBe(400);
    // });

    // it("should return 404 for non-existent ID", async () => {
    //   const res = await request(app).get("/insurance/999999");
    //   expect(res.status).toBe(404);
    // });
  });

  describe("PUT /insurance/:id", () => {
    it("should update insurance record", async () => {
      const res = await request(app)
        .put(`/insurance/${insuranceId}`)
        .send({
          policyNumber: "UPD-12345"
        });
      expect(res.status).toBe(200);
    });

    // it("should return 404 if record not found", async () => {
    //   const res = await request(app).put("/insurance/999999").send({
    //     policyNumber: "Nonexistent",
    //   });
    //   expect(res.status).toBe(404);
    // });
  });

  describe("DELETE /insurance/:id", () => {
    it("should delete the insurance record", async () => {
      // Create a new insurance record to delete
      const [insurance] = await db.insert(InsuranceTable).values({
        carID: carId,
        insuranceProvider: "Temp Provider",
        policyNumber: "TMP-12345",
        startDate: "2023-01-01",
        endDate: "2024-01-01"
      }).returning();
      const tempInsuranceId = insurance.insuranceID;

      const res = await request(app).delete(`/insurance/${tempInsuranceId}`);
      expect(res.status).toBe(200);
    });
  });
});