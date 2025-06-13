import { eq, sql } from "drizzle-orm";
import db from "../../src/Drizzle/db";
import { CarTable, TICar } from "../../src/Drizzle/schema";
import {
  createCarService,
  getCarService,
  getAllCarsService,
  updateCarService,
  deleteCarService,
} from "../../src/car/car.service";

// Mock the Drizzle module
jest.mock("../src/Drizzle/db", () => ({
  __esModule: true,
  default: {
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      CarTable: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  },
}));

jest.mock("drizzle-orm", () => {
  const actual = jest.requireActual("drizzle-orm");
  return {
    ...actual,
    eq: jest.fn(),
    sql: jest.fn(),
  };
});

const mockDb = db as jest.Mocked<typeof db>;

describe("Car Service CRUD Operations", () => {
  const mockCar: TICar = {
    carID: 1,
    carModel: "Sedan",
    year: "2022-01-01", // string as per your current code
    color: "Red",
    rentalRate: "50.00",
    availability: true,
    locationID: 101,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCarService", () => {
    it("should create a new car", async () => {
      (mockDb.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockCar]),
        }),
      }));

      const result = await createCarService(mockCar);

      expect(mockDb.insert).toHaveBeenCalledWith(CarTable);
      expect(result).toEqual(mockCar);
    });

    it("should throw an error when DB insert fails", async () => {
      const error = new Error("DB Insert Error");
      (mockDb.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockImplementation(() => {
          throw error;
        }),
      }));

      await expect(createCarService(mockCar)).rejects.toThrow("DB Insert Error");
    });
  });

  describe("getCarService", () => {
    it("should return undefined when car is not found", async () => {
      (mockDb.query.CarTable.findFirst as jest.Mock).mockResolvedValue(undefined);

      const result = await getCarService(999);
      expect(result).toBeUndefined();
    });

    it("should return undefined for invalid carID", async () => {
      (mockDb.query.CarTable.findFirst as jest.Mock).mockResolvedValue(undefined);

      const resultNull = await getCarService(null as any);
      const resultNegative = await getCarService(-1);

      expect(resultNull).toBeUndefined();
      expect(resultNegative).toBeUndefined();
    });
  });

  describe("getAllCarsService", () => {
    it("should retrieve all cars", async () => {
      (mockDb.query.CarTable.findMany as jest.Mock).mockResolvedValue([mockCar]);

      const result = await getAllCarsService();

      expect(mockDb.query.CarTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: {
            carID: true,
            carModel: true,
            year: true,
            color: true,
            rentalRate: true,
            availability: true,
            locationID: true,
          },
        })
      );
      expect(result).toEqual([mockCar]);
    });

    it("should return empty array when no cars exist", async () => {
      (mockDb.query.CarTable.findMany as jest.Mock).mockResolvedValue([]);

      const result = await getAllCarsService();
      expect(result).toEqual([]);
    });
  });

  describe("updateCarService", () => {
    it("should update a car", async () => {
      const updateData = { color: "Blue" };

      (mockDb.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{ ...mockCar, ...updateData }]),
          }),
        }),
      }));

      const result = await updateCarService(1, updateData);

      expect(mockDb.update).toHaveBeenCalledWith(CarTable);
      expect(result).toEqual({ ...mockCar, ...updateData });
    });

    it("should handle empty update data gracefully", async () => {
      (mockDb.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([mockCar]),
          }),
        }),
      }));

      const result = await updateCarService(1, {});
      expect(result).toEqual(mockCar);
    });

    it("should return undefined when carID does not exist", async () => {
      (mockDb.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        }),
      }));

      const result = await updateCarService(999, { color: "Green" });
      expect(result).toBeUndefined();
    });
  });

  describe("deleteCarService", () => {
    it("should delete a car and return the deleted car", async () => {
      (mockDb.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockCar]),
        }),
      }));

      const result = await deleteCarService(1);

      expect(mockDb.delete).toHaveBeenCalledWith(CarTable);
      expect(result).toEqual(mockCar);
    });

    it("should return undefined when no car is deleted", async () => {
      (mockDb.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }));

      const result = await deleteCarService(999);
      expect(result).toBeUndefined();
    });

    it("should return undefined for invalid carID", async () => {
      (mockDb.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      }));

      const result = await deleteCarService(-10);
      expect(result).toBeUndefined();
    });
  });
});
